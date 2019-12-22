const getSlackUI = require("../../slack-inteface");

module.exports = program => {
  program
    .command("dump-users")
    .description("Dump user information")
    .action(command => {
      console.log("dump users command", command);

      const debug = command.parent.args.debug;
      const ui = getSlackUI({ debug });
      ui.doSomething();
    });
};
