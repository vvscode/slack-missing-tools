const puppeteer = require("puppeteer");

const { SlackPageObject } = require("./SlackPageObject");

module.exports = async options => {
  console.log("Get slack interface for next options");
  console.log(JSON.stringify(options, null, 2));

  const browser = await puppeteer.launch({ headless: false });

  const ui = new SlackPageObject({ browser });
  return ui;
};
