const chatTypeDefs = `

  type Chat {
    _id: ID!
    userID: ID!
    userMessage: String!
    aiResponse : String!
    createdAt: String
  }

  type Query {
    getChats(userID: ID!): [Chat]
  }

  type Mutation {
     addChat(userMessage: String!, aiResponse: String!, userID: ID!): Chat

    deleteChatById(_id: ID!): Boolean
    deleteChatsByUser(userID: ID!): Boolean
  }
`;

module.exports = chatTypeDefs;
