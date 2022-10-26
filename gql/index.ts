import {
  initUrqlClient,
  withUrqlClient,
  WithUrqlClientOptions,
} from "next-urql";
import {
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";

export const withDefaultUrqlClient = (options?: WithUrqlClientOptions) =>
  withUrqlClient((ssrExchange) => {
    return {
      url: `${process.env.NEXT_PUBLIC_URL}/api/proxy/api.github.com/graphql`,
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        ssrExchange,
        fetchExchange,
      ],
    };
  }, options);

export type PropsWithUrqlState<T> = T & {
  urqlState: any;
};

export const initDefaultUrqlClient = (canEnableSuspense?: boolean) => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: `${process.env.NEXT_PUBLIC_URL}/api/proxy/api.github.com/graphql`,
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        ssrCache,
        fetchExchange,
      ],
    },
    canEnableSuspense
  );
  return { client, cache: ssrCache };
};
