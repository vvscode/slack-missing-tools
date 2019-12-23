# Missing slack tools

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
 - [ ] Send messages
 - [ ] ...