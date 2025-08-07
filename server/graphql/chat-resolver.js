const chat = require("../models/chatModel");
const Conversation = require("../models/conversationModel");
const chatResolvers = {
  Query: {
    getChats: async (_, { userID, conversationID }) => {
      if (!userID || typeof userID !== "string") {
        throw new Error("Invalid or missing userID");
      }

      console.log("Fetching chats for userID:", userID);

      const chats = await chat
        .find({ userID, conversationID })
        .sort({ createdAt: 1 });
      return chats;
    },
    getConversations: async (_, { userID }) => {
      return await Conversation.find({ userID }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    addChat: async (_, { userMessage, aiResponse, userID, conversationID }) => {
      if (!userID) throw new Error("User ID is required");
      try {
        const newChat = await chat.create({
          userID,
          conversationID,
          userMessage,
          aiResponse,
        });

        console.log("Saved Chat:", newChat._id);
        return newChat;
      } catch (err) {
        console.error("addChat internal error:", err);
        throw new Error("Failed to save chat.");
      }
    },
    createConversation: async (_, { userID, title }) => {
      if (!userID) throw new Error("User ID is required");

      try {
        const newConversation = await Conversation.create({
          userID,
          title: title,
        });

        console.log("New Conversation Created:", newConversation._id);
        return newConversation;
      } catch (err) {
        console.error("createConversation error:", err);
        throw new Error("Failed to create conversation.");
      }
    },

    deleteChatById: async (_, { _id }) => {
      const deleted = await chat.findByIdAndDelete(_id);
      return !!deleted;
    },
    deleteChatsByUser: async (_, { userID }) => {
      const deletedChats = await chat.find({ userID });
      const deletedIds = deletedChats.map((c) => c._id);
      await chat.deleteMany({ userID });
      return deletedIds;
    },
  },
};

module.exports = chatResolvers;
