import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import "./index.css";
import App from "./App.jsx";

const client = new ApolloClient({
  link: createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_URI + "/graphql",
  }),
  cache: new InMemoryCache(),
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
