const fs = require("fs");

module.exports.config = {
  name: "help",
  version: "2.0.0",
  hasPermission: 0,
  credits: "HENRY",
  description: "Stylish help menu with command list & auto-unsend option",
  commandCategory: "system",
  usages: "[commandName | pageNumber]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "🌌 ─── 𝗛𝗘𝗡𝗥𝗬 𝗕𝗢𝗧 ─── 🌌\n\n📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗: %1\n💡 𝗗𝗘𝗦𝗖: %2\n⚡ 𝗨𝗦𝗔𝗚𝗘: %3\n📂 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: %4\n⏳ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡: %5 sec\n👑 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: %6\n\n🔖 𝗖𝗥𝗘𝗗𝗜𝗧𝗦: HENRY",
    "helpList": "📚 Total Commands: %1\n💡 Tip: Type \"%2help <commandName>\" to know more about any command!",
    "user": "User",
    "adminGroup": "Admin Group",
    "adminBot": "Admin Bot"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  const { autoUnsend, delayUnsend } = module.exports.config.envConfig;

  if (!body || typeof body === "cmd" || !body.startsWith("help")) return;

  const splitBody = body.trim().split(/\s+/);

  if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  const message = {
    body: getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      (command.config.hasPermission === 0) ? getText("user") : (command.config.hasPermission === 1) ? getText("adminGroup") : getText("adminBot")
    ),
    attachment: fs.existsSync("help.gif") ? fs.createReadStream("help.gif") : null
  };

  return api.sendMessage(message, threadID, (error, info) => {
    if (autoUnsend) {
      setTimeout(() => {
        api.unsendMessage(info.messageID);
      }, delayUnsend * 1000);
    }
  });
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = module.exports.config.envConfig;
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    let i = 0;
    let msg = `🌌 ─── 𝗛𝗘𝗡𝗥𝗬 𝗕𝗢𝗧 ─── 🌌\n\n📚 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:\n━━━━━━━━━━━━━━━\n`;

    for (const [name] of commands) {
      arrayInfo.push(name);
    }

    arrayInfo.sort();
    const startSlice = numberOfOnePage * page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (const item of returnArray) msg += `🔹 ${++i}. ${item}\n`;

    msg += `\n📄 Page (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n💡 Type: ${prefix}help <command>\n📌 Total Commands: ${arrayInfo.length}`;

    return api.sendMessage(msg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise((resolve) => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  }

  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      (command.config.hasPermission === 0) ? getText("user") : (command.config.hasPermission === 1) ? getText("adminGroup") : getText("adminBot")
    ),
    threadID,
    messageID
  );
};
