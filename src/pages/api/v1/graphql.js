// Is GraphQL overkill? Yes
// Does it make it easier to do a timeline of events? Yep
// Does it make it easier to stitch other data sources together? Definitely

import { ApolloServer } from "apollo-server-micro";
import typeDefs from "src/graphql/typeDefs";
import resolvers from "src/graphql/resolvers";
import context from "src/graphql/context";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  uploads: false,
  subscriptions: false,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = apolloServer.createHandler({ path: "/api/v1/graphql" });

export default handler;
