import { graphql, print } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import context from "./context";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const schema = makeExecutableSchema({ typeDefs, resolvers });

/**
 * For server side rendering, we want to use GraphQL
 * This creates a local graphql client that doesn't include any server
 * round trips, ideal for getStaticProps or getStaticPaths methods
 * @returns {object} An emulated GraphQL client with the query method
 */
export const createStaticClient = () => {
  const client = {
    query: (doc, vars) => {
      return graphql(schema, print(doc), null, context, vars);
    },
  };
  return client;
};
