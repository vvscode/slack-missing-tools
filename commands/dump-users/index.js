const fs = require("fs");

const getSlackUI = require("../../slack-inteface");
const log = require("../../utils/log").get("dump-users");

module.exports = program => {
  program
    .command("dump-users")
    .description("Dump users information")
    .action(async command => {
      const { debug, team, username, password } = command.parent;
      log.info(`Dump users for ${team} team`);
      try {
        const ui = await getSlackUI({ debug });

        const users = [];
        await ui.setResponseInterceptor({
          filter: interceptedResponse => interceptedResponse.url().includes("users/info"),
          action: async interceptedResponse => {
            try {
              let json = await interceptedResponse.json();
              users.push(...json.results);
            } catch (e) {
              log.error(`${interceptedResponse.url()} is not a json`);
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
        log.notice("Done");
      } catch (e) {
        log.error("Something went wrong", e);
      }
    });
};
