import {
  cacheExchange,
  createClient as createUrqlClient,
  dedupExchange,
  fetchExchange,
} from "urql";

export const createClient = () => {
  return createUrqlClient({
    url: generateEndpoint(),
    exchanges: generateExchanges(),
  });
};

const generateEndpoint = () => {
  const isServer = typeof window === "undefined";
  const base = !isServer
    ? ""
    : process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://codedrift.com";
  const url = `${base}/api/v1/graphql`;
  return url;
};

const generateExchanges = (ssr) =>
  [dedupExchange, cacheExchange, ssr, fetchExchange].filter((ex) => ex);
