const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
