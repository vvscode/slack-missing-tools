#!/usr/bin/env node

const commander = require("commander");
const glob = require("glob");

const pkg = require("./package.json");

const program = new commander.Command();
program
  .version(pkg.version)
  .option("--debug", "output extra debugging, disable headless mode")
  .requiredOption("--team <team>", "slack team name")
  .requiredOption("--username <username>", "username to login in slack")
  .requiredOption("--password <password>", "password to login in slack");

glob.sync(`${__dirname}/commands/*`).forEach(commandPath => {
  require(commandPath)(program);
});

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
