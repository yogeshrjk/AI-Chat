const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const http = require("http");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const reportRouter = require("./routes/report");
const connectDB = require("./config/dbConn");
const dotenv = require("dotenv");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { typeDefs, resolvers } = require("./graphql");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5008;
const httpServer = http.createServer(app);

const mergedTypeDefs = mergeTypeDefs(typeDefs);
const mergedResolvers = mergeResolvers(resolvers);

(async () => {
  try {
    const server = new ApolloServer({
      typeDefs: mergedTypeDefs,
      resolvers: mergedResolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(cors());
    app.use(
      "/graphql",
      express.json({ limit: "50mb" }),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const token = req.headers.authorization || "";
          let userId = null;

          if (token.startsWith("Bearer ")) {
            try {
              const jwt = require("jsonwebtoken");
              const decoded = jwt.verify(
                token.slice(7),
                process.env.JWT_SECRET
              );
              userId = decoded.userId;
            } catch (err) {
              console.error("Invalid token", err.message);
            }
          }

          return { userId };
        },
      })
    );
    app.use(express.static(__dirname));
    app.use("/api", reportRouter);

    connectDB();

    await new Promise((resolve) => httpServer.listen(PORT, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
})();
