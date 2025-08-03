const mongoose = require("mongoose");

const TTSChatSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  message: { type: String, required: true },
  ttsFile: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ttschat", TTSChatSchema);
