const puppeteer = require("puppeteer");

const { SlackPageObject } = require("./SlackPageObject");

module.exports = async options => {
  const browser = await puppeteer.launch({ headless: !options.debug });

  const ui = new SlackPageObject({ browser });
  return ui;
};
