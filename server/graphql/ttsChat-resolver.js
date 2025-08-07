const chatMessage = require("../models/ttsModel");
const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const { saveWaveBuffer } = require("../utils/saveWaveFile");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ttsChatResolvers = {
  Query: {
    getTtsChats: async (_, { userID }) => {
      if (!userID) throw new Error("User ID required");

      const chats = await chatMessage.find({ userID }).sort({ createdAt: 1 });
      return chats;
    },
  },

  Mutation: {
    addTtsChat: async (_, { message, userID }) => {
      if (!userID) throw new Error("User ID is required");
      try {
        console.log("Calling Gemini TTS...");
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: message }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Alnilam" },
              },
            },
          },
        });

        const part = response?.candidates?.[0]?.content?.parts?.[0];
        const data = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;
        console.log("Gemini MIME type:", mimeType);

        if (!data) throw new Error("No audio data from Gemini");

        const rawPCM = Buffer.from(data, "base64");

        console.log("Converting PCM to WAV...");
        const wavBuffer = await saveWaveBuffer(rawPCM);

        const fileName = `tts_${Date.now()}.wav`;
        const [baseUrl, sasToken] = process.env.AZURE_SAS_URL.split("?");
        const sasUrl = `${baseUrl}/${fileName}?${sasToken}`;

        console.log("Uploading to Azure...");
        await axios.put(sasUrl, wavBuffer, {
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": "audio/wav",
            "Content-Length": wavBuffer.length,
          },
        });

        const ttsFileUrl = `${baseUrl}/${fileName}`;
        console.log("Azure Upload Complete:", ttsFileUrl);

        console.log("Saving to MongoDB...");
        const newChat = await chatMessage.create({
          userID,
          message,
          ttsFile: ttsFileUrl,
        });

        console.log("Saved Chat:", newChat._id);
        return newChat;
      } catch (err) {
        console.error("addTtsChat internal error:", err.message);
        throw new Error("Failed to generate and store TTS chat.");
      }
    },

    deleteTtsChatById: async (_, { _id }) => {
      const deleted = await chatMessage.findByIdAndDelete(_id);
      return !!deleted;
    },
    deleteTtsChatsByUser: async (_, { userID }) => {
      const deletedChats = await chatMessage.find({ userID });
      const deletedIds = deletedChats.map((c) => c._id);
      await chatMessage.deleteMany({ userID });
      return deletedIds;
    },
  },
};

module.exports = ttsChatResolvers;
