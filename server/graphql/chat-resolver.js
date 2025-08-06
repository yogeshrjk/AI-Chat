const chat = require("../models/chatModel");

const chatResolvers = {
  Query: {
    getChats: async (_, { userID }) => {
      if (!userID || typeof userID !== "string") {
        throw new Error("Invalid or missing userID");
      }

      console.log("Fetching chats for userID:", userID);

      const chats = await chat.find({ userID }).sort({ createdAt: 1 });
      return chats;
    },
  },

  Mutation: {
    addChat: async (_, { userMessage, aiResponse, userID }) => {
      if (!userID) throw new Error("User ID is required");
      try {
        const newChat = await chat.create({
          userID,
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

    // deleteChatById: async (_, { _id }) => {
    //   const deleted = await chat.findByIdAndDelete(_id);
    //   return !!deleted;
    // },
    // deleteChatsByUser: async (_, { userID }) => {
    //   const deleted = await chat.deleteMany({ userID });
    //   return !!deleted.deletedCount;
    // },
  },
};

module.exports = chatResolvers;
