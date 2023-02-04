const puppeteer = require("puppeteer");
const screenshot = "screenshot.png";

const getCertInfo = async (ppidArray) => {
  //should change to expect input to be an array of ppids

  const browser = await puppeteer.launch({
    args: ["--disabled-setuid-sandbox", "--no-sandbox"],
    headless: false,
  });

  const asyncMap = async (ppidArray) => {
    return Promise.all(
      ppidArray.map(async (ppid) => {
        // do something asynchronous with item
        const page = await browser.newPage();

        await page.goto(
          "http://www.teachercertification.pa.gov/Screens/wfSearchEducators.aspx"
        );

        await page.waitForSelector("#MainContent_txtPPID");
        await page.type("#MainContent_txtPPID", ppid);
        await page.click("#MainContent_cmdSearch");
        console.log("before waiting ppid selector, ppid: ", ppid);
        await page.waitForSelector("#MainContent_lblPPID");
        console.log("after selector for ppid");

        console.log("before check");
        const standardCredentialsExists =
          (await page.$("#MainContent_gvStdCr")) !== null;

        console.log("standardCredentialsExists", standardCredentialsExists);
        let standardCredentials = [];

        if (standardCredentialsExists) {
          console.log("in standard");
          standardCredentials = await page.evaluate(() => {
            const rows = Array.from(
              document.querySelectorAll("#MainContent_gvStdCr > tbody > tr")
            );

            return rows.map((row) => {
              const cells = row.querySelectorAll("td");
              console.log("here2");
              return Array.from(cells).map((cell) => cell.innerText);
            });
          });
          //Remove first blank array which contained the headers
          standardCredentials.shift();
          console.log("standard credentials:", standardCredentials);
        }

        const emergencyCredentialsExists =
          (await page.$("#MainContent_gvEmgCr")) !== null;

        let emergencyCredentials = [];

        if (emergencyCredentialsExists) {
          console.log("found emergency cred");
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
          console.log("emergency credentials: ", emergencyCredentials);
        }

        const applicationsExists =
          (await page.$("#MainContent_gvApplInfo")) !== null;

        let applications = [];

        if (applicationsExists) {
          console.log("found applications");
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
          console.log("applications credentials: ", applications);
        }

        return {
          ppid,
          standardCredentials,
          emergencyCredentials,
          applications,
        };
      })
    );
  };

  const allTeacherInfo = await asyncMap(ppidArray);

  console.log("about to close browser");
  browser.close();

  console.log(allTeacherInfo);
  // await page.screenshot({ path: screenshot });

  return allTeacherInfo; //Expected output: Array of Objects.
};

// getCertInfo(["3482578", "2940231", "1019256"]);

// getCertInfo(["1019256"]);

//has an emergency permit: 2940231
//Credential, issue date, expiration date, credential status

//has an application: 1019256
module.exports = getCertInfo;
