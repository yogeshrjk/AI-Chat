module.exports = {
  typeDefs: [require("./ttsChat-Schema"), require("./user-schema")],
  resolvers: [require("./ttsChat-resolver"), require("./user-resolvers")],
};
