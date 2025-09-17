const fs = global.nodemodule["fs-extra"];
const axios = require("axios");

module.exports.config = {
  name: "goibot",
  version: "4.2.0",
  hasPermssion: 0,
  credits: "⚡ Henry ⚡",
  description: "Funny + Human + Flirty Chat Bot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:mm:ss");
  const name = await Users.getNameUser(senderID);
  const userInfo = await Users.getData(senderID);
  const gender = userInfo.gender || "MALE"; // default MALE if not found
  const text = body.toLowerCase();

  // ------------------- NORMAL FUNNY REPLIES -------------------
  const randomReplies = [
    `😂 ${name}, Chal Thodi Masti Ho Jaye!`,
    `🔥 ${name}, Aaj Mood Mast Hai!`,
    `😏 ${name}, Tu Fir Se Aa Gya?`,
    `🤣 ${name}, Ab To Friend Ban Gaye Hum!`,
    `👑 ${name}, King Ki Entry Ho Gayi!`,
    `😈 ${name}, Dikkat Kya Hai Bata!`,
    `🥵 ${name}, Thoda Shaant Ho Ja Bhai!`,
    `⚡ ${name}, Mujhe Bulaya? Ab Maja Aayega!`
  ];

  // ------------------- BOT SPECIFIC REPLIES -------------------
  const botReplies = [
    `🤖 ${name}, Bot Hoon Main... But Dil Se Dost 😎`,
    `😂 ${name}, Bot Ko Bula Liya... Ab Masti Dekho!`,
    `🔥 ${name}, Hacker Mode Activated 💻`,
    `😈 ${name}, Ab Main Full Power Me Hoon!`,
    `😜 ${name}, Bot Bhi Thoda Attitude Wala Hai 😉`,
    `🤣 ${name}, Bot Bulane Ka Charge Lagega Ab!`,
    `👾 ${name}, Welcome To Dark Side Of Bot 🔥`,
    `🤭 ${name}, Bot + You = Full Comedy Show!`,
    `🧠 ${name}, Main Sirf Bot Nahi... Smart Bot Hoon 😏`,
    `⚡ ${name}, Arey Bhai... Bot Aagya Hai Maja Lo!`
  ];

  // ------------------- HUMAN STYLE REPLIES -------------------
  const humanReplies = [
    `😄 ${name}, Hello Ji! Kaise Ho?`,
    `👋 Arre ${name}, Bada Time Ho Gaya Dekhe!`,
    `😁 ${name}, Sab Mast? Bolo Kya Chal Raha Hai?`,
    `😎 Hello ${name}, Mast Mood Bana Diya Tumne!`,
    `🤗 ${name}, Mai Bilkul Thik! Tum Sunao?`,
    `🙌 ${name}, Sab Badiya? Party Kaha Hai?`,
    `💬 ${name}, Bolo Bolo Kya Scene Hai?`,
    `😂 ${name}, Kya Hua Bhai Itna Serious Kyun Ho?`
  ];

  // ------------------- FLIRTY REPLIES (ONLY FOR FEMALE USERS) -------------------
  const flirtyReplies = [
    `😉 ${name}, Tumhari Smile To Dil Chura Legi 😍`,
    `🔥 ${name}, Tum Online Ho To Mood Hi Change Ho Jata Hai 😏`,
    `😘 ${name}, Itni Cute Kyun Ho Yaar?`,
    `🥵 ${name}, Aaj To Dangerous Lag Rahi Ho 🔥`,
    `💘 ${name}, Tumhari DP Dekh Ke Dil Garden-Garden Ho Gaya 🌸`,
    `😜 ${name}, Tumse Milne Ka Fine Lagta Hai Mujhe 😅`,
    `💋 ${name}, Ek Baar Smile Kar Do Pure GC Me Light Aa Jayegi 😍`,
    `🤭 ${name}, Tum Online Ho Bas Din Ban Gaya!`
  ];

  let reply;

  // --- CONDITION CHECK ---
  if (text.includes("bot")) {
    reply = botReplies[Math.floor(Math.random() * botReplies.length)];
  } 
  else if (text.includes("suno")) {
    reply = `😏 Nahi suna, mera mann tera kya jaa raha hai?`;
  }
  else if (
    text.includes("hi") ||
    text.includes("hello") ||
    text.includes("hii") ||
    text.includes("kon ho") ||
    text.includes("kya hal") ||
    text.includes("kya hua") ||
    text.includes("kaise ho")
  ) {
    if (gender.toUpperCase() === "FEMALE") {
      reply = flirtyReplies[Math.floor(Math.random() * flirtyReplies.length)];
    } else {
      reply = humanReplies[Math.floor(Math.random() * humanReplies.length)];
    }
  } 
  else {
    if (gender.toUpperCase() === "FEMALE" && Math.random() < 0.3) {
      // 30% chance flirty reply even in normal messages
      reply = flirtyReplies[Math.floor(Math.random() * flirtyReplies.length)];
    } else {
      reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    }
  }

  const tag = `\n\n⚡ Created By Henry | ${time} ⚡`;

  // --- Typing Animation ---
  api.sendTypingIndicator(threadID, true);
  setTimeout(() => {
    api.sendMessage(reply + tag, threadID, messageID);
  }, 700);

  // --- Chance of Sending Sticker/GIF ---
  if (Math.random() < 0.2) {
    try {
      const imgURL = "https://i.ibb.co/3C9t1fr/funny-sticker.png"; // apna sticker ya gif ka link
      const stream = (await axios.get(imgURL, { responseType: "stream" })).data;
      api.sendMessage({ attachment: stream }, threadID);
    } catch (err) {
      console.log("Sticker send failed:", err.message);
    }
  }
};

module.exports.run = () => {};
