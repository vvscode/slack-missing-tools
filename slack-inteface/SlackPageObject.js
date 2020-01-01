const sleep = require("../utils/sleep");
const log = require("../utils/log").get("slack-page-object");

class SlackPageObject {
  constructor({ browser }) {
    this.browser = browser;
    this.name = "SlackPageObject";
  }

  die() {
    this.browser.close();
  }

  _waitForAllElements(selectors, visible = true) {
    return Promise.all(selectors.map(selector => this.page.waitForSelector(selector, { visible })));
  }

  async getPage() {
    if (this.page) {
      return this.page;
    }
    const page = await this.browser.newPage();
    this.page = page;
    return page;
  }

  async login({ teamName, userName, password }) {
    log.info("Login...");

    const url = `https://${teamName}.slack.com`;
    const sEmail = "#email";
    const sPassword = "#password";
    const sSignInBtn = "#signin_btn";

    const page = await this.getPage();
    await page.goto(url);

    await this._waitForAllElements([sEmail, sPassword, sSignInBtn]);

    await page.click(sEmail);
    await sleep(100);
    await page.type(sEmail, userName, { delay: 100 });
    await sleep(100);
    await page.click(sPassword);
    await sleep(100);
    await page.type(sPassword, password, { delay: 100 });
    await sleep(100);

    await page.click(sSignInBtn);
    const errorMessage = await page
      .waitFor(_ => (document.querySelector(".alert_error") || {}).innerText, {
        timeout: 10 * 1000,
      })
      .catch(() => null);

    if (errorMessage) {
      throw errorMessage;
    }
  }

  async setResponseInterceptor({ filter, action }) {
    log.info("setResponseInterceptor...");

    const page = await this.getPage();
    page.on("response", interceptedResponse => {
      if (filter(interceptedResponse)) {
        action(interceptedResponse);
      }
    });
  }

  async scanAllExistingUsers() {
    log.info("scanAllExistingUsers...");

    const sList = ".ReactVirtualized__Grid.ReactVirtualized__List";
    const page = await this.getPage();
    await page.click('[aria-label="Open a direct message"]');
    await this._waitForAllElements([sList]);
    for (let i = 0; i < 100; i++) {
      await page.$eval(sList, el => (el.scrollTop += 999));
      await sleep(100);
    }
  }

  async jumpTo(target) {
    log.info(`jump to ${target}`);

    const sAutocomplete = '[aria-owns="c-search_autocomplete__suggestion_list"]';
    const sJumper = ".p-channel_sidebar__jumper";
    const sFistItem = ".c-search_autocomplete__suggestion_list li span";
    const page = await this.getPage();

    await page.click(sJumper);
    await this._waitForAllElements([sAutocomplete]);
    await page.type(sAutocomplete, target, { delay: 100 });
    await this._waitForAllElements([sFistItem]);
    await page.click(sFistItem);
    await sleep(200);
  }

  async sendMessage(message) {
    log.info(`send "${message}"`);

    const page = await this.getPage();

    const sTextarea = ".ql-editor";
    await this._waitForAllElements([sTextarea]);
    await page.type(sTextarea, message, { delay: 100 });

    // For unknown reason just `Enter` on next line doesn't work
    // https://stackoverflow.com/questions/46442253/pressing-enter-button-in-puppeteer
    await (await page.$(sTextarea)).press("NumpadEnter");
  }
}

module.exports = {
  SlackPageObject,
};
