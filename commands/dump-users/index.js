module.exports = program => {
  program
    .command("dump-users")
    .description("Dump user information")
    .action((...args) => {
      console.log("dump users command", args);
    });
};
