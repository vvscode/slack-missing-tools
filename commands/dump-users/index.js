const getSlackUI = require("../../slack-inteface");

module.exports = program => {
  program
    .command("dump-users")
    .description("Dump user information")
    .action(async command => {
      try {
        console.log("dump users command", command);

        const { debug, team, username, password } = command.parent;

        const ui = await getSlackUI({ debug });
        await ui.login({
          teamName: team,
          userName: username,
          password,
        });

        console.log("Done");
      } catch (e) {
        console.error("Something went wrong", e);
      }
    });
};
