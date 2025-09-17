const fs = require("fs");

module.exports = {
  name: "block",
  description: "Fixed IDs ko group me add karega (auto add)",

  async execute(api, event) {
    try {
      const threadID = event.threadID;

      // Yaha apni IDs dal do jo add karni hai
      const idsToAdd = [
        "10001234567890", // ID 1
        "10009876543210", // ID 2
        "61579361614972"  // ID 3
      ];

      for (const uid of idsToAdd) {
        api.addUserToGroup(uid, threadID, (err) => {
          if (err) {
            api.sendMessage(`⚠️ ${uid} ko add nahi kar paya: ${err.errorDescription || err}`, threadID);
          } else {
            api.sendMessage(`✅ ${uid} group me add ho gaya!`, threadID);
          }
        });
      }

    } catch (error) {
      console.error("block.js error:", error);
      api.sendMessage("❌ Error aayi block command me!", event.threadID);
    }
  },
};
