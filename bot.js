require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const token = requiredEnv('DISCORD_TOKEN');
const allowedRoleIds = (process.env.ALLOWED_ROLE_IDS || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const RULES = {
  1: {
    title: 'РАЗДЕЛ 1 — ОБЩИЕ ПРАВИЛА',
    icon: '📜',
    desc: 'Основные правила поведения на сервере HERADE HOUSE 2.0. Незнание правил не освобождает от ответственности.',
    points: [
      { name: 'Пункт 1.1', rule: 'Запрещено использование ненормативной лексики в чрезмерном или оскорбительном виде для других пользователей.', punish: 'Пред/Мут.', duration: 'до 2 часов | 3 дней.' },
      { name: 'Пункт 1.2', rule: 'Запрещён расизм, нацизм, дискриминация, унижение людей по национальности, цвету кожи, вероисповеданию.\nЗапрещены нацистские лозунги, символика, ники, аватарки, шутки и любые упоминания связанные с 1488, свастикой, Hitler, Nazi, ZOV, СВО.', punish: 'Мут/Бан.', duration: 'до 10 часов | 2 недели | Смена ника | Бан 3 дня.' },
      { name: 'Пункт 1.3', rule: 'Запрещена публикация материалов насильственного характера, жестокости, суицида, шок-контента.\nЗапрещён 18+ контент, NSFW-аватарки, баннеры и ссылки на подобные материалы.', punish: 'Мут/Бан.', duration: 'до 5 часов | 1 недели | Бан навсегда.' },
      { name: 'Пункт 1.4', rule: 'Запрещены ники, которые могут оскорбить других пользователей.\nЗапрещается использование в никах адресов сайтов, ссылок, рекламы.\nЗапрещено копирование профиля администрации.', punish: 'Мут/Бан.', duration: 'до 3 часов | 1 недели | Смена ника | Бан 7 дней.' },
      { name: 'Пункт 1.5', rule: 'Запрещено распространение личной информации пользователей без их разрешения.\nЗапрещены угрозы сватом, минированием, деаноном, родителями и иными методами давления.', punish: 'Бан.', duration: 'Навсегда.' },
      { name: 'Пункт 1.6', rule: 'Запрещена реклама сторонних Discord-серверов, проектов и сообществ.\nЗапрещена скрытая реклама через статус, ник, ссылки, демонстрацию экрана.', punish: 'Мут/Бан.', duration: 'до 5 часов | 1 недели | Бан навсегда.' },
      { name: 'Пункт 1.7', rule: 'Запрещён скам, обман, мошенничество и любые махинации.\nЗапрещено выдавать себя за другого человека, администрацию или медийную личность.', punish: 'Мут/Бан.', duration: 'до 2 недели | Бан навсегда' },
      { name: 'Пункт 1.8', rule: 'Запрещено намеренное создание конфликтов между участниками сервера.', punish: 'Пред/Мут.', duration: 'до 6 часов | 5 дней.' },
      { name: 'Пункт 1.9', rule: 'Запрещён обход правил и поиск лазеек в правилах сервера.', punish: 'На усмотрение администрации.', duration: '—' },
      { name: 'Пункт 1.10', rule: 'Запрещены рейды сервера, массовый флуд и действия направленные на нарушение работы сервера.', punish: 'Бан.', duration: 'Навсегда.' },
      { name: 'Пункт 1.11', rule: 'Запрещено использование твинк-аккаунтов (фейков) для обхода бана или мута.', punish: 'Бан.', duration: 'Навсегда (основной и твинк).' }
    ]
  },
  2: {
    title: 'РАЗДЕЛ 2 — ЧАТ И ГОЛОСОВЫЕ КАНАЛЫ',
    icon: '💬',
    desc: 'Правила общения в текстовых и голосовых каналах для комфортной атмосферы.',
    points: [
      { name: 'Пункт 2.1', rule: 'Запрещено включать музыку, шумы, звуки и соундпад без согласия участников канала.\nЗапрещены слишком громкие, резкие или мешающие общению звуки.', punish: 'Пред/Мут.', duration: 'до 2 часов.' },
      { name: 'Пункт 2.2', rule: 'Запрещено мешать общению в голосовом канале: крики, перебивание, эхо, намеренное ухудшение качества общения.', punish: 'Пред/Мут.', duration: 'до 4 часов.' },
      { name: 'Пункт 2.3', rule: 'Запрещено использование программ изменения голоса в целях обмана или помех общению.', punish: 'Пред/Мут.', duration: 'до 4 часов.' },
      { name: 'Пункт 2.4', rule: 'Запрещено использование багов или уязвимостей Discord, а также распространение способов их использования.', punish: 'Пред/Бан.', duration: 'до 7 дней.' }
    ]
  },
  3: {
    title: 'РАЗДЕЛ 3 — ПОВЕДЕНИЕ В ИГРАХ',
    icon: '🎮',
    desc: 'Данный раздел устанавливает правила поведения участников во время совместной игры. Они направлены на поддержание честной игры и комфортной атмосферы.',
    points: [
      { name: 'Пункт 3.1', rule: 'Запрещено использование / распространение | читов, макросов, скриптов и других запрещённых программ.', punish: 'Бан.', duration: 'до 7 дней | Навсегда.' },
      { name: 'Пункт 3.2', rule: 'Запрещено использование игровых багов для получения преимущества над другими игроками.', punish: 'Пред/Бан.', duration: 'до 7 дней.' }
    ]
  }
};

function buildEmbeds(sectionId) {
  const data = RULES[sectionId];
  if (!data) return [];

  const embeds = [];
  let currentEmbed = createEmbed(data, false);
  let fieldCount = 0;
  let textLength = (data.title.length + data.desc.length + 100);

  for (const point of data.points) {
    const fields = [
      { name: `\u200b\n🔹 **${point.name}**`, value: `\`\`\`\n${point.rule}\n\`\`\`` },
      { name: 'Наказание:', value: `> **${point.punish}**`, inline: true },
      { name: 'Длительность:', value: `> **${point.duration}**`, inline: true },
      { name: '\u200b', value: '\u200b', inline: true }
    ];
    const addedLength = fields.reduce((sum, field) => sum + field.name.length + field.value.length, 0);
    if (fieldCount + fields.length > 25 || textLength + addedLength > 5800) {
      embeds.push(currentEmbed);
      currentEmbed = createEmbed(data, true);
      fieldCount = 0;
      textLength = data.title.length + 100;
    }
    currentEmbed.addFields(fields);
    fieldCount += fields.length;
    textLength += addedLength;
  }
  embeds.push(currentEmbed);
  return embeds;
}

function createEmbed(data, continuation) {
  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setAuthor({ name: 'Правила | HERADE HOUSE 2.0', iconURL: client.user?.displayAvatarURL() })
    .setTitle(`${data.icon} ${data.title}`);
  if (!continuation) embed.setDescription(`**${data.desc}**`);
  else embed.setFooter({ text: 'Продолжение раздела' });
  return embed;
}

client.once('clientReady', () => {
  console.log(`✅ Бот ${client.user.tag} запущен`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'rules') return;

  try {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: 'Команда доступна только на сервере.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    // An empty ALLOWED_ROLE_IDS means the command is available to everyone.
    const hasRole = allowedRoleIds.length === 0 || member.roles.cache.some(role => allowedRoleIds.includes(role.id));
    if (!hasRole) {
      await interaction.reply({ content: '⛔ У вас нет прав для использования этой команды.', ephemeral: true });
      return;
    }

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased() || !channel.send) {
      await interaction.reply({ content: '❌ Не удалось определить текстовый канал для публикации.', ephemeral: true });
      return;
    }

    const botMember = interaction.guild.members.me;
    if (!botMember || !channel.permissionsFor(botMember)?.has(PermissionsBitField.Flags.SendMessages) ||
        !channel.permissionsFor(botMember)?.has(PermissionsBitField.Flags.EmbedLinks)) {
      await interaction.reply({ content: '❌ У бота нет прав отправлять сообщения и Embed в этом канале.', ephemeral: true });
      return;
    }

    const section = interaction.options.getInteger('глава');
    const embeds = buildEmbeds(section);
    if (!embeds.length) {
      await interaction.reply({ content: '❌ Раздел не найден.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    for (const embed of embeds) await channel.send({ embeds: [embed] });
    await interaction.deleteReply().catch(() => {});
  } catch (error) {
    console.error('Ошибка обработки /rules:', error);
    const message = '❌ Не удалось опубликовать правила. Проверьте права бота и логи.';
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: message, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
    }
  }
});

client.login(token).catch(error => {
  console.error('Не удалось подключить бота к Discord:', error);
  process.exitCode = 1;
});
