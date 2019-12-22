class SlackPageObject {
  constructor(browser) {
    this.name = "SlackPageObject";
  }

  doSomething() {
    console.log(`${this.name} should do something`);
  }
}

module.exports = {
  SlackPageObject,
};
