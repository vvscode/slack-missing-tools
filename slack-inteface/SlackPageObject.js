const sleep = require("../utils/sleep");

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
    console.info("Login...");

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
    console.info("setResponseInterceptor...");

    const page = await this.getPage();
    page.on("response", interceptedResponse => {
      if (filter(interceptedResponse)) {
        action(interceptedResponse);
      }
    });
  }

  async scanAllExistingUsers() {
    console.info("scanAllExistingUsers...");

    const sList = ".ReactVirtualized__Grid.ReactVirtualized__List";
    const page = await this.getPage();
    await page.click('[aria-label="Open a direct message"]');
    await this._waitForAllElements([sList]);
    for (let i = 0; i < 100; i++) {
      await page.$eval(sList, el => (el.scrollTop += 999));
      await sleep(100);
    }
  }
}

module.exports = {
  SlackPageObject,
};
