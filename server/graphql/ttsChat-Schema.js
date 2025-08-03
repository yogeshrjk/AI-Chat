const ttsChatTypeDefs = `
  scalar Upload

  type Chat {
    _id: ID!
    userID: ID!
    message: String!
    ttsFile: String!
    createdAt: String
  }

  type Query {
    getTtsChats(userID: ID!): [Chat]
  }

  type Mutation {
     addChat(message: String!, userID: ID!): Chat

    deleteChatById(_id: ID!): Boolean
    deleteChatsByUser(userID: ID!): Boolean
  }
`;

module.exports = ttsChatTypeDefs;
