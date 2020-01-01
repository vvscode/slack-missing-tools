const fs = require("fs");

const getSlackUI = require("../../slack-inteface");
const log = require("../../utils/log").get("send-message");

module.exports = program => {
  program
    .command("send-message")
    .requiredOption("--target <target>", "Target for message (person/channel)")
    .requiredOption("--message <message>", "Message")
    .description("Send private/channel message")
    .action(async command => {
      const { target, message } = command;
      const { debug, team, username, password } = command.parent;
      log.info(`Send "${message}" to "${target}"`);
      try {
        const ui = await getSlackUI({ debug });

        await ui.login({
          teamName: team,
          userName: username,
          password,
        });

        await ui.jumpTo(target);
        await ui.sendMessage(message);

        await ui.die();
        log.notice("Done");
      } catch (e) {
        log.error("Something went wrong", e);
      }
    });
};
