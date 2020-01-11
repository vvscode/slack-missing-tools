const fs = require("fs");
const uniqBy = require("lodash.uniqby");

const getSlackUI = require("../../slack-inteface");
const log = require("../../utils/log").get("dump-users");

module.exports = program => {
  program
    .command("dump-channel-users")
    .option("--channel <value>", "Channel name to dump users from (#general is default)", "general")
    .description("Dump users information from specific channel")
    .action(async command => {
      const { channel } = command;
      const { debug, team, username, password } = command.parent;
      try {
        const ui = await getSlackUI({ debug });

        await ui.login({
          teamName: team,
          userName: username,
          password,
        });

        await ui.jumpTo(`#${channel}`);

        let users = [];
        await ui.setResponseInterceptor({
          filter: interceptedResponse => interceptedResponse.url().includes("users/list"),
          action: async interceptedResponse => {
            try {
              let json = await interceptedResponse.json();
              users.push(...json.results);
            } catch (e) {
              log.debug(`${interceptedResponse.url()} is not a json`, e);
            }
          },
        });

        await ui.refreshPage();
        await ui.scanAllGroupUsers();
        await ui.die();
        users = uniqBy(users, "id");

        fs.writeFileSync(`${team}_${channel}_users.json`, JSON.stringify(users, null, 2));

        log.notice(`${users.length} collected`);
      } catch (e) {
        log.error("Something went wrong", e);
      }
    });
};
