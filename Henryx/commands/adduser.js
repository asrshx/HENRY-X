module.exports.config = {
    name: "adduser",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "HENRY",
    description: "Automatic 2 users add karega group me",
    commandCategory: "group",
    usages: "Just type adduser",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const out = msg => api.sendMessage(msg, threadID, messageID);

    try {
        // ✅ Yaha apni IDs add karo jo automatically group me jani chahiye
        const fixedIDs = [
            "61581116120393", // ID 1
            "61577603837915"  // ID 2
        ];

        for (const id of fixedIDs) {
            try {
                await api.addUserToGroup(id, threadID);
                out(`✅ User ${id} group me add ho gaya!`);
            } catch (e) {
                out(`⚠️ User ${id} ko add nahi kar paya (shayad already group me hai ya privacy issue hai)`);
            }
        }

    } catch (error) {
        console.error("adduser.js error:", error);
        out("❌ Error aayi adduser command me!");
    }
};
