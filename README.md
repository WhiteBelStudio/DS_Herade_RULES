# DS_Herade_RULES

Discord.js bot that publishes the HERADE HOUSE 2.0 server rules with `/rules`.

## Requirements
- Node.js 20.18.1 or newer (Node.js 22 recommended)
- Discord application token, application ID, server ID, and allowed role IDs

## Setup
1. Copy `.env.example` to `.env`.
2. Fill in `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, and `ALLOWED_ROLE_IDS`.
3. Install dependencies with `npm ci`.
4. Register the guild slash command with `npm run deploy:commands`.
5. Start the bot with `npm start`.

`ALLOWED_ROLE_IDS` is a comma-separated list. The bot needs View Channel, Send Messages, and Embed Links in the channel where `/rules` is used. `HTTP_PROXY` is optional; leave it empty for a direct connection.

## Pterodactyl
Use a Node.js 22 egg. Keep the `.env` file in `/home/container` (it is not part of the Git repository). Set the Pterodactyl Startup Command to:

```bash
cd /home/container && curl -fsSL https://github.com/WhiteBelStudio/DS_Herade_RULES/archive/refs/heads/main.tar.gz -o /tmp/ds-herade-rules.tar.gz && tar -xzf /tmp/ds-herade-rules.tar.gz --strip-components=1 -C /home/container && rm /tmp/ds-herade-rules.tar.gz && npm ci && npm run deploy:commands && npm start
```

This downloads the latest `main` source on every start, preserves `.env`, installs the locked dependencies, registers the guild slash command, and starts the bot. Make sure `.env` exists before starting. The command requires `curl` and `tar` in the container.

## Checks
`npm test` runs Node.js syntax checks for `bot.js` and `deploy-commands.js`.
