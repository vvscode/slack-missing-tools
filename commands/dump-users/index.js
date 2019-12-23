const fs = require("fs");

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

        const users = [];
        await ui.setResponseInterceptor({
          filter: interceptedResponse => interceptedResponse.url().includes("users/info"),
          action: async interceptedResponse => {
            console.log("action for url", interceptedResponse.url());
            try {
              let json = await interceptedResponse.json();
              users.push(...json.results);
              console.log(json);
            } catch (e) {
              console.log("Not a json");
            }
          },
        });

        await ui.login({
          teamName: team,
          userName: username,
          password,
        });

        await ui.scanAllExistingUsers();

        fs.writeFileSync(`${team}_users.json`, JSON.stringify(users, null, 2));

        await ui.die();
        console.log("Done");
      } catch (e) {
        console.error("Something went wrong", e);
      }
    });
};
