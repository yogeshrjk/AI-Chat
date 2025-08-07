const chatTypeDefs = `

  type Chat {
    _id: ID!
    userID: ID!
    conversationID: ID
    userMessage: String!
    aiResponse : String!
    createdAt: String
  }
  type Conversation {
    _id: ID!
    userID: ID!
    title: String
    createdAt: String
  }

  type Query {
    getChats(userID: ID!, conversationID: ID!): [Chat]
    getConversations(userID: ID!): [Conversation]
  }

  type Mutation {
    addChat(userMessage: String!, aiResponse: String!, userID: ID, conversationID: ID!): Chat
    createConversation(userID: ID!, title: String): Conversation
    deleteChatById(_id: ID!): Boolean
    deleteChatsByUser(userID: ID!): [ID!]!
  }
`;

module.exports = chatTypeDefs;
