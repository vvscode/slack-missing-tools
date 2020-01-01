# Missing slack tools

[![NPM](https://nodei.co/npm/slack-missing-tools.png)](https://nodei.co/npm/slack-missing-tools/)

## How to start:

```bash
npx slack-missing-tools dump-users --team TEAM_NAME --username YOUR_USER_NAME --password YOUR_USER_PASSWORD
```

will create `${TEAM_NAME}_users.json` file with information about users (list of fields depends on your user and team settings).

## Motivation

Slack is a great tool, I'm using across many projects. But unfortunately their API is limited, plus to be able to use it you have to have permissions for adding bots, and that's not always possible. There is [slacktee](https://github.com/coursehero/slacktee) and some other tools which allow you to use slack in easier way. But they still work with API and need tokens.

This project is just a wrapper around SlackUI (via puppeteer), so I'm going to implement command I(or you) need from the user perspective. It means that commands require username / password (not tokens).

## Plan

 - [x] Dump users info (to grab emails, check avatars and so on)
 - [x] Send messages
 - [ ] ...

 ## Options (command line arguments)

Tools has commands and options. There are some global options, requeried by tool itself. And some depends on the command.

Global options are next:

- `--help` - to see available commands
- `--team` - required, team name to deal with (like `react` / `emberjs`)
- `--username` - required, your username to use
- `--password` - required, your password to use
- `--debug` - optional, allows you to disable headless mode for browser and see what happens with your slack (please, do not touch window and controls inside) 