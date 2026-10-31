require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, ChannelType } = require('discord.js');
const { ProxyAgent } = require('undici');

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(\`Missing required environment variable: \${name}\`);
  return value;
}

const token = requiredEnv('DISCORD_TOKEN');
const clientId = requiredEnv('CLIENT_ID');
const guildId = requiredEnv('GUILD_ID');
const proxyUrl = process.env.HTTP_PROXY?.trim();

const sectionChoices = [
  { name: 'Раздел I — Общие правила', value: 1 },
  { name: 'Раздел II — Текстовые и голосовые каналы', value: 2 },
  { name: 'Раздел III — Игры и совместный досуг', value: 3 },
  { name: 'Раздел IV — Администрация и модерация', value: 4 },
  { name: 'Раздел V — Система наказаний', value: 5 },
];

const commands = [
  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Просмотр и публикация правил HERADE HOUSE 2.0')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('Посмотреть отдельный раздел правил')
        .addIntegerOption(option =>
          option.setName('section')
            .setDescription('Какой раздел показать')
            .setRequired(true)
            .addChoices(...sectionChoices)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('publish-section')
        .setDescription('Опубликовать один раздел в выбранный канал')
        .addIntegerOption(option =>
          option.setName('section')
            .setDescription('Какой раздел опубликовать')
            .setRequired(true)
            .addChoices(...sectionChoices))
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Канал для публикации')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('publish-all')
        .setDescription('Одной командой опубликовать все пять разделов')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Канал для публикации правил')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .toJSON(),
];

const restOptions = { version: '10' };
if (proxyUrl) restOptions.agent = new ProxyAgent(proxyUrl);
const rest = new REST(restOptions).setToken(token);

(async () => {
  try {
    console.log('Регистрирую slash-команды...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Команда /rules с подкомандами view, publish-section и publish-all зарегистрирована.');
  } catch (error) {
    console.error('Ошибка регистрации команд:', error);
    process.exitCode = 1;
  } finally {
    if (proxyUrl) await restOptions.agent?.close?.().catch(() => {});
  }
})();
