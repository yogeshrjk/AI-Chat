const ttsChatTypeDefs = `
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
     addTtsChat(message: String!, userID: ID!): Chat

    deleteTtsChatById(_id: ID!): Boolean
    deleteTtsChatsByUser(userID: ID!): [ID!]!
  }
`;

module.exports = ttsChatTypeDefs;
