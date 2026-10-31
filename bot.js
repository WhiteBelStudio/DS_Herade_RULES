require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require('discord.js');

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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const RULES = {
  1: {
    title: 'РАЗДЕЛ I. ОБЩИЕ ПРАВИЛА',
    icon: '📜',
    desc: 'Основные правила поведения на сервере HERADE HOUSE 2.0. Незнание правил не освобождает от ответственности.',
    points: [
      { id: '1.1', rule: 'Запрещены прямые оскорбления, чрезмерная ненормативная лексика и унижение участников.', punish: 'Пред / Мут', duration: 'Предупреждение; до 2 часов; до 12 часов при повторении.' },
      { id: '1.2', rule: 'Запрещены расизм, нацизм, ксенофобия, разжигание ненависти, дискриминация и соответствующая пропаганда.', punish: 'Мут / Бан', duration: 'До 24 часов; до 7 дней; навсегда при тяжёлых или повторных нарушениях.' },
      { id: '1.3', rule: 'Запрещено размещать материалы сексуального характера, шок-контент, сцены жестокости и материалы, пропагандирующие насилие.', punish: 'Мут / Бан', duration: 'До 12 часов; до 7 дней; навсегда при особо тяжёлых нарушениях.' },
      { id: '1.4', rule: 'Запрещены оскорбительные ники, аватары, статусы и оформление, имитирующее администрацию.', punish: 'Пред / Смена ника / Мут', duration: 'Требование сменить оформление; до 2 часов при отказе.' },
      { id: '1.5', rule: 'Запрещено публиковать персональные данные, личные фотографии и переписки без согласия владельца.', punish: 'Бан', duration: 'От 7 дней до бессрочной блокировки в зависимости от тяжести нарушения.' },
      { id: '1.6', rule: 'Запрещены угрозы, запугивание, шантаж, угрозы деанонимизации и давление на участников.', punish: 'Бан', duration: 'От 7 дней до навсегда.' },
      { id: '1.7', rule: 'Запрещена реклама серверов, сообществ, проектов и услуг без разрешения администрации.', punish: 'Пред / Мут / Бан', duration: 'Предупреждение; до 6 часов; до 3 дней при повторении.' },
      { id: '1.8', rule: 'Запрещены скам, фишинг, мошеннические схемы и выдача себя за администрацию или другого участника.', punish: 'Мут / Бан', duration: 'До 24 часов; от 7 дней до навсегда в зависимости от ущерба.' },
      { id: '1.9', rule: 'Запрещено намеренно провоцировать ссоры, разжигать конфликты и преследовать участников.', punish: 'Пред / Мут', duration: 'Предупреждение; до 6 часов; до 24 часов при повторении.' },
      { id: '1.10', rule: 'Запрещено использовать дополнительные аккаунты для обхода блокировок и ограничений.', punish: 'Бан', duration: 'До 7 дней; навсегда при повторном или намеренном обходе.' },
      { id: '1.11', rule: 'Запрещены рейды, массовые рассылки, флуд и намеренное нарушение работы сервера.', punish: 'Бан', duration: 'От 7 дней до навсегда.' },
    ],
  },
  2: {
    title: 'РАЗДЕЛ II. ТЕКСТОВЫЕ И ГОЛОСОВЫЕ КАНАЛЫ',
    icon: '💬',
    desc: 'Правила общения в текстовых и голосовых каналах для комфортной атмосферы.',
    points: [
      { id: '2.1', rule: 'Запрещено отправлять большое количество однотипных сообщений, символов и бессмысленного контента.', punish: 'Пред / Мут', duration: 'Предупреждение; до 2 часов; до 6 часов при повторении.' },
      { id: '2.2', rule: 'Запрещено без причины массово упоминать пользователей, роли и администрацию.', punish: 'Пред / Мут', duration: 'Предупреждение; до 3 часов; до 12 часов при повторении.' },
      { id: '2.3', rule: 'Запрещено намеренно засорять чат сообщениями исключительно заглавными буквами, символами и чрезмерным форматированием.', punish: 'Пред / Мут', duration: 'Предупреждение; до 1 часа; до 3 часов при повторении.' },
      { id: '2.4', rule: 'Необходимо соблюдать назначение каждого текстового и голосового канала.', punish: 'Пред / Мут', duration: 'Предупреждение; до 2 часов; до 6 часов при повторении.' },
      { id: '2.5', rule: 'Запрещены намеренные крики, перебивание, постоянное создание эха и другие действия, мешающие общению.', punish: 'Пред / Мут', duration: 'Предупреждение; до 2 часов; до 6 часов при повторении.' },
      { id: '2.6', rule: 'Запрещено включать громкие звуки, музыку и Soundboard без согласия участников голосового канала.', punish: 'Пред / Мут', duration: 'Предупреждение; до 2 часов; до 6 часов при повторении.' },
      { id: '2.7', rule: 'Запрещено намеренно создавать постоянные звуковые помехи и мешать общению.', punish: 'Пред / Мут', duration: 'Предупреждение; до 3 часов; до 12 часов при повторении.' },
      { id: '2.8', rule: 'Запрещено превращать каналы сервера в площадку для личных разбирательств.', punish: 'Пред / Мут', duration: 'Предупреждение; до 3 часов; до 12 часов при повторении.' },
    ],
  },
  3: {
    title: 'РАЗДЕЛ III. ИГРЫ И СОВМЕСТНЫЙ ДОСУГ',
    icon: '🎮',
    desc: 'Правила поведения участников во время совместной игры и мероприятий.',
    points: [
      { id: '3.1', rule: 'Запрещено использование читов, запрещённых программ и нечестных способов получения преимущества в совместных игровых мероприятиях.', punish: 'Бан', duration: 'До 7 дней; навсегда при повторном нарушении.' },
      { id: '3.2', rule: 'Запрещено намеренно использовать игровые уязвимости для получения несправедливого преимущества.', punish: 'Пред / Бан', duration: 'Предупреждение; до 7 дней; до 30 дней при повторении.' },
      { id: '3.3', rule: 'Запрещены намеренная порча игры, срыв мероприятий и действия против собственной команды.', punish: 'Пред / Мут / Бан', duration: 'Предупреждение; до 6 часов; до 3 дней при повторении.' },
      { id: '3.4', rule: 'Запрещены унижение, травля и намеренные провокации во время совместных игровых сессий.', punish: 'Пред / Мут', duration: 'Предупреждение; до 3 часов; до 12 часов при повторении.' },
    ],
  },
  4: {
    title: 'РАЗДЕЛ IV. АДМИНИСТРАЦИЯ И МОДЕРАЦИЯ',
    icon: '🛡️',
    desc: 'Правила взаимодействия с администрацией, модерацией и службой поддержки.',
    points: [
      { id: '4.1', rule: 'Запрещены угрозы, травля и оскорбления администрации в связи с выполнением её обязанностей.', punish: 'Пред / Мут / Бан', duration: 'Предупреждение; до 12 часов; до 3 дней при повторении.' },
      { id: '4.2', rule: 'Запрещено намеренно препятствовать действиям модераторов по поддержанию порядка.', punish: 'Пред / Мут', duration: 'Предупреждение; до 6 часов; до 24 часов при повторении.' },
      { id: '4.3', rule: 'Запрещено намеренно предоставлять поддельные доказательства и заведомо ложную информацию.', punish: 'Пред / Мут', duration: 'Предупреждение; до 6 часов; до 24 часов при повторении.' },
      { id: '4.4', rule: 'Запрещено использовать обращения в поддержку для спама, провокаций и намеренного отвлечения персонала.', punish: 'Пред / Ограничение обращений', duration: 'Предупреждение; до 24 часов; до 7 дней при повторении.' },
      { id: '4.5', rule: 'Запрещено разглашать конфиденциальные сведения администрации и закрытые материалы без разрешения.', punish: 'Снятие доступа / Бан', duration: 'До 7 дней; навсегда в зависимости от тяжести нарушения.' },
    ],
  },
  5: {
    title: 'РАЗДЕЛ V. ОБЩАЯ СИСТЕМА НАКАЗАНИЙ',
    icon: '⚖️',
    desc: 'Администрация выбирает меру с учётом тяжести нарушения, обстоятельств, намерения и истории участника.',
    points: [
      { id: '5.1', rule: 'Предупреждение (Warn) — фиксация нарушения и уведомление участника.', punish: 'Предупреждение', duration: 'Без срока; учитывается при повторных нарушениях.' },
      { id: '5.2', rule: 'Мут (Timeout) — временное ограничение возможности писать и общаться в голосовых каналах.', punish: 'Мут', duration: 'От 1 часа до 24 часов; конкретный срок определяется пунктом правил.' },
      { id: '5.3', rule: 'Кик (Kick) — удаление участника с сервера без постоянной блокировки возможности вернуться.', punish: 'Кик', duration: 'Однократно; повторное вступление возможно, если нет бана.' },
      { id: '5.4', rule: 'Временный бан — ограничение доступа к серверу на установленный срок.', punish: 'Бан', duration: 'От 3 до 30 дней, если конкретный пункт не устанавливает другой срок.' },
      { id: '5.5', rule: 'Перманентный бан — бессрочное ограничение доступа к серверу за особо тяжёлые нарушения.', punish: 'Перманентный бан', duration: 'Навсегда.' },
      { id: '5.6', rule: 'При повторных нарушениях наказание может быть увеличено. За особо тяжёлые нарушения допускается немедленная строгая мера.', punish: 'На усмотрение администрации', duration: 'В пределах мер, указанных в правилах; с учётом обстоятельств и соразмерности.' },
      { id: '5.7', rule: 'Участник может обжаловать наказание через официальную поддержку сервера.', punish: 'Наказание за подачу жалобы не применяется', duration: 'Обращение рассматривается администрацией.' },
      { id: '5.8', rule: 'Один и тот же случай не должен автоматически наказываться несколько раз без дополнительных оснований.', punish: 'По решению администрации', duration: 'По обстоятельствам конкретного случая.' },
    ],
  },
};

function buildSectionEmbeds(sectionId) {
  const data = RULES[sectionId];
  if (!data) return [];

  const chunks = [];
  let current = [];
  let currentLength = data.title.length + data.desc.length + 150;

  for (const point of data.points) {
    const value = [
      point.rule,
      '',
      `**Наказание:** ${point.punish}`,
      `**Срок:** ${point.duration}`,
    ].join('\\n');
    const field = { name: `Пункт ${point.id}`, value: value.slice(0, 1024) };
    const fieldLength = field.name.length + field.value.length;
    if (current.length >= 20 || currentLength + fieldLength > 5600) {
      chunks.push(current);
      current = [];
      currentLength = 200;
    }
    current.push(field);
    currentLength += fieldLength;
  }
  if (current.length) chunks.push(current);

  return chunks.map((fields, index) => {
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(`${data.icon} ${data.title}`)
      .addFields(fields);
    if (index === 0) embed.setDescription(data.desc);
    else embed.setFooter({ text: 'Продолжение раздела' });
    if (index === chunks.length - 1) embed.setFooter({ text: 'HERADE HOUSE 2.0 • Соблюдайте правила сообщества' });
    return embed;
  });
}

function isPublisher(member) {
  const permissions = member.permissions;
  return permissions.has(PermissionsBitField.Flags.Administrator) ||
    permissions.has(PermissionsBitField.Flags.ManageGuild) ||
    allowedRoleIds.some(roleId => member.roles.cache.has(roleId));
}

function canSendEmbeds(channel, guild) {
  const me = guild.members.me;
  if (!me) return false;
  const permissions = channel.permissionsFor(me);
  return Boolean(permissions?.has([
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.EmbedLinks,
  ]));
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

    const action = interaction.options.getSubcommand();
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (action === 'view') {
      const sectionId = interaction.options.getInteger('section');
      const embeds = buildSectionEmbeds(sectionId);
      if (!embeds.length) {
        await interaction.reply({ content: 'Раздел не найден.', ephemeral: true });
        return;
      }
      await interaction.reply({ embeds, ephemeral: true });
      return;
    }

    if (!isPublisher(member)) {
      await interaction.reply({
        content: '⛔ Публиковать правила могут только участники с правом «Управление сервером», администраторы или разрешённой ролью.',
        ephemeral: true,
      });
      return;
    }

    const target = interaction.options.getChannel('channel');
    if (!target || target.type !== ChannelType.GuildText || !canSendEmbeds(target, interaction.guild)) {
      await interaction.reply({
        content: '❌ Выбранный канал недоступен или у бота нет прав «Просмотр канала», «Отправка сообщений» и «Встраивание ссылок».',
        ephemeral: true,
      });
      return;
    }

    const sectionIds = action === 'publish-all'
      ? Object.keys(RULES).map(Number)
      : [interaction.options.getInteger('section')];

    if (sectionIds.some(id => !RULES[id])) {
      await interaction.reply({ content: '❌ Указан неизвестный раздел.', ephemeral: true });
      return;
    }

    const allEmbeds = sectionIds.flatMap(buildSectionEmbeds);
    await interaction.deferReply({ ephemeral: true });

    let sent = 0;
    for (const embed of allEmbeds) {
      await target.send({ embeds: [embed] });
      sent += 1;
    }

    await interaction.editReply({
      content: `✅ Опубликовано: ${sectionIds.length} раздел(а/ов), ${sent} сообщени(я/й) в канале <#${target.id}>.`,
    });
  } catch (error) {
    console.error('Ошибка обработки /rules:', error);
    const message = '❌ Не удалось обработать команду. Проверьте права бота и логи.';
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
