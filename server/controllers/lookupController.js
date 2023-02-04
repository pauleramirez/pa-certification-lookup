//Need to require in the scraper

const getCertInfo = require("../utils/getCertInfo.js");

const lookupController = {};

lookupController.lookup = async (req, res, next) => {
  const { ppidArray } = req.body;

  console.log("ppid to be scraped", ppidArray);
  //web scrape the google URL
  const teacherArray = await getCertInfo(ppidArray); // expected output, array of objects

  console.log("Here's the cert info after scraping ", teacherArray);

  res.locals.teacherArray = teacherArray;

  return next();
};

module.exports = lookupController;
