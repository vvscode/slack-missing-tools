const { SlackPageObject } = require("./SlackPageObject");

module.exports = options => {
  console.log("Get slack interface for next options");
  console.log(JSON.stringify(options, null, 2));

  const ui = new SlackPageObject();
  return ui;
};
