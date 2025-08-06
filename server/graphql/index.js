module.exports = {
  typeDefs: [
    require("./ttsChat-Schema"),
    require("./user-schema"),
    require("./chat-schema"),
  ],
  resolvers: [
    require("./ttsChat-resolver"),
    require("./user-resolvers"),
    require("./chat-resolver"),
  ],
};
