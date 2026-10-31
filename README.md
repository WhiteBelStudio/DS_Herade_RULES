# DS_Herade_RULES

Discord.js bot for viewing and publishing the HERADE HOUSE 2.0 rules.

## Commands

- `/rules view section:<1-5>` — privately view one rules section.
- `/rules publish-section section:<1-5> channel:#rules` — publish one selected section.
- `/rules publish-all channel:#rules` — publish all five sections in one command.

Publishing is restricted to members with Administrator, Manage Server, or a role listed in `ALLOWED_ROLE_IDS`. Viewing sections is available to everyone.

## Requirements

- Node.js 20.18.1 or newer (Node.js 22 recommended)
- Discord application token, application ID, server ID, and allowed role IDs

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, and optionally `ALLOWED_ROLE_IDS`.
3. Install dependencies with `npm ci`.
4. Register slash commands with `npm run deploy:commands`.
5. Start the bot with `npm start`.

The bot needs View Channel, Send Messages, and Embed Links in the destination channel. `HTTP_PROXY` is optional; leave it empty for a direct connection.

## Pterodactyl

Use a Node.js 22 egg. Keep `.env` in `/home/container`; it is not part of the Git repository. Startup command:

```bash
cd /home/container && curl -fsSL https://github.com/WhiteBelStudio/DS_Herade_RULES/archive/refs/heads/main.tar.gz -o /tmp/ds-herade-rules.tar.gz && tar -xzf /tmp/ds-herade-rules.tar.gz --strip-components=1 -C /home/container && rm /tmp/ds-herade-rules.tar.gz && npm ci && npm run deploy:commands && npm start
```

This downloads the latest `main` source on every start, preserves `.env`, installs locked dependencies, registers slash commands, and starts the bot. Ensure `.env` exists before starting. The command requires `curl` and `tar`.

## Checks

`npm test` runs Node.js syntax checks for `bot.js` and `deploy-commands.js`.
