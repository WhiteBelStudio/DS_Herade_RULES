require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { ProxyAgent } = require('undici');

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const token = requiredEnv('DISCORD_TOKEN');
const clientId = requiredEnv('CLIENT_ID');
const guildId = requiredEnv('GUILD_ID');
const proxyUrl = process.env.HTTP_PROXY?.trim();
const commands = [new SlashCommandBuilder().setName('rules').setDescription('Показать правила HERADE HOUSE 2.0').addIntegerOption(option => option.setName('глава').setDescription('Номер раздела (1, 2 или 3)').setRequired(true).addChoices({name:'Раздел 1 - Общие правила',value:1},{name:'Раздел 2 - Чат и голос',value:2},{name:'Раздел 3 - Игры',value:3})).toJSON()];
const restOptions = { version: '10' };
if (proxyUrl) restOptions.agent = new ProxyAgent(proxyUrl);
const rest = new REST(restOptions).setToken(token);
(async () => {
  try {
    console.log('Регистрирую slash-команды...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Команда /rules зарегистрирована.');
  } catch (error) {
    console.error('Ошибка регистрации команд:', error);
    process.exitCode = 1;
  } finally {
    if (proxyUrl) await restOptions.agent?.close?.().catch(() => {});
  }
})();
