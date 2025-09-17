module.exports.config = {
    name: "fyt",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "Henry",
    description: "Interactive War Spam Command",
    commandCategory: "wargroup",
    usages: "fyt",
    cooldowns: 5
};

let session = {}; // har user ka data store hoga yaha
let running = false;
let spamInterval;

module.exports.run = async function ({ api, event }) {
    session[event.senderID] = { step: 1, data: {} };
    return api.sendMessage("🪪 Please enter the *TOKEN* of account to use:", event.threadID, event.messageID);
};

module.exports.handleReply = async function ({ api, event }) {
    const userSession = session[event.senderID];
    if (!userSession) return;

    switch (userSession.step) {
        case 1:
            userSession.data.token = event.body.trim();
            userSession.step++;
            return api.sendMessage("💬 Enter *Thread ID* where spam should run:", event.threadID);
        case 2:
            userSession.data.threadID = event.body.trim();
            userSession.step++;
            return api.sendMessage("⏳ Enter *delay* in seconds between messages:", event.threadID);
        case 3:
            userSession.data.delay = parseInt(event.body.trim());
            userSession.step++;
            return api.sendMessage("😈 Enter *Hater Name* to target:", event.threadID);
        case 4:
            userSession.data.haterName = event.body.trim();
            userSession.step++;
            return api.sendMessage(
                `✅ Setup Complete!\n\n🔑 Token: ${userSession.data.token}\n💬 Thread: ${userSession.data.threadID}\n⏳ Delay: ${userSession.data.delay}s\n🎯 Hater: ${userSession.data.haterName}\n\nType "start" to begin or "stop" to cancel.`,
                event.threadID
            );
        case 5:
            if (event.body.toLowerCase() === "start") {
                if (running) return api.sendMessage("⚠️ Spam already running!", event.threadID);
                running = true;

                let messages = [
                    `🔥 ${userSession.data.haterName} tere baap kaun hai 🤣`,
                    `😂 ${userSession.data.haterName} ka carrier khatam 🚮`,
                    `💀 ${userSession.data.haterName} ki maa ki 🤬`,
                    `💥 ${userSession.data.haterName} gir gaya re baba`
                ];

                let i = 0;
                spamInterval = setInterval(() => {
                    if (!running) return;
                    api.sendMessage(messages[i % messages.length], userSession.data.threadID);
                    i++;
                }, userSession.data.delay * 1000);

                return api.sendMessage("🚀 Spam started! Type 'stop' anytime to halt.", event.threadID);
            }

            if (event.body.toLowerCase() === "stop") {
                if (!running) return api.sendMessage("⚠️ No spam is running.", event.threadID);
                clearInterval(spamInterval);
                running = false;
                return api.sendMessage("🛑 Spam stopped successfully.", event.threadID);
            }

            return api.sendMessage("⚠️ Invalid response! Type 'start' or 'stop'.", event.threadID);
    }
};
