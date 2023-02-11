const puppeteer = require("puppeteer");

const getCertInfo = async (ppidArray) => {
  const chunkSize = 5;
  const chunks = [];
  for (let i = 0; i < ppidArray.length; i += chunkSize) {
    chunks.push(ppidArray.slice(i, i + chunkSize));
  }

  const browser = await puppeteer.launch({
    args: ["--disabled-setuid-sandbox", "--no-sandbox"],
    headless: false,
  });

  const allTeacherInfo = [];

  for (const chunk of chunks) {
    const promises = [];
    for (const ppid of chunk) {
      promises.push(scrapePpid(ppid, browser));
    }
    const chunkTeacherObjs = await Promise.all(promises);
    chunkTeacherObjs.forEach((teacherObj, i) => {
      allTeacherInfo.push(teacherObj);
    });
  }

  console.log("allTeacherInfo from scraper:", allTeacherInfo);

  browser.close();

  return allTeacherInfo; //Expected output: Array of Objects.
};

const scrapePpid = async (ppid, browser) => {
  const page = await browser.newPage();

  await page.goto(
    "http://www.teachercertification.pa.gov/Screens/wfSearchEducators.aspx"
  );
  await page.waitForSelector("#MainContent_txtPPID");
  await page.type("#MainContent_txtPPID", ppid);
  await page.click("#MainContent_cmdSearch");

  // Wait for either element to appear
  const ppidCheck = await Promise.race([
    page.waitForSelector("#MainContent_lblNoPPIDRec", {
      timeout: 120000,
    }),
    page.waitForSelector("#MainContent_lblPPID", {
      timeout: 120000,
    }),
  ]);

  const ppidCheckId = await ppidCheck.getProperty("id");
  const ppidCheckValue = await ppidCheckId.jsonValue();

  if (ppidCheckValue == "MainContent_lblNoPPIDRec") {
    console.log("No ppid found: ", ppid);
    await page.close();
    return {
      ppid,
      error: "no ppid found",
    };
  }

  const standardCredentialsExists =
    (await page.$("#MainContent_gvStdCr")) !== null;

  let standardCredentials = [];

  if (standardCredentialsExists) {
    standardCredentials = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#MainContent_gvStdCr > tbody > tr")
      );

      return rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.innerText);
      });
    });
    //Remove first blank array which contained the headers
    standardCredentials.shift();
  }

  const emergencyCredentialsExists =
    (await page.$("#MainContent_gvEmgCr")) !== null;

  let emergencyCredentials = [];

  if (emergencyCredentialsExists) {
    emergencyCredentials = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#MainContent_gvEmgCr > tbody > tr")
      );

      return rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.innerText);
      });
    });
    emergencyCredentials.shift();
  }

  const applicationsExists = (await page.$("#MainContent_gvApplInfo")) !== null;

  let applications = [];

  if (applicationsExists) {
    applications = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#MainContent_gvApplInfo > tbody > tr")
      );

      return rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.innerText);
      });
    });

    applications.shift();
  }

  await page.close();

  return {
    ppid,
    standardCredentials,
    emergencyCredentials,
    applications,
  };
};

// getCertInfo(["2940231"]);

/* In Browser:
3482578,
2940231,
1019256,
7262458,
2036486,
6570247,
3743295,
5862375,
*/

//No Record Found: 5842568

module.exports = getCertInfo;
