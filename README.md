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
Use a Node.js 22 egg and set the startup command to `npm start`. Keep `.env` safe during source updates. Download the GitHub `main` archive, restore `.env`, run `npm ci`, then register commands and start the bot.

## Checks
`npm test` runs Node.js syntax checks for `bot.js` and `deploy-commands.js`.
