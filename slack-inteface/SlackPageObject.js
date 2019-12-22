class SlackPageObject {
  constructor({ browser }) {
    this.browser = browser;
    this.name = "SlackPageObject";
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
    console.log("Login", { teamName, userName, password });

    const url = `https://${teamName}.slack.com`;
    const sEmail = "#email";
    const sPassword = "#password";
    const sSignInBtn = "#signin_btn";

    const page = await this.getPage();
    await page.goto(url);

    await this._waitForAllElements([sEmail, sPassword, sSignInBtn]);

    await page.type(sEmail, userName);
    await page.type(sPassword, password);
    await page.click(sSignInBtn);

    try {
      await page.waitForNavigation({ timeout: 10, waitUntil: "networkidle2" });
    } catch (e) {
      const errorMesage = (await page.$eval(".alert_error", el => el.innerText)) || "Some login error";
      throw errorMesage;
    }
  }
}

module.exports = {
  SlackPageObject,
};
