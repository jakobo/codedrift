import process from "process"; // eslint-disable-line unicorn/prefer-node-protocol
import {
  initUrqlClient,
  withUrqlClient,
  type WithUrqlClientOptions,
} from "next-urql";
import { cacheExchange, fetchExchange, ssrExchange } from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";

export const withDefaultUrqlClient = (options?: WithUrqlClientOptions) =>
  withUrqlClient((ssrExchange) => {
    return {
      url: `${process.env.NEXT_PUBLIC_URL}/api/proxy/api.github.com/graphql`,
      exchanges: [devtoolsExchange, cacheExchange, ssrExchange, fetchExchange],
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
      exchanges: [devtoolsExchange, cacheExchange, ssrCache, fetchExchange],
    },
    canEnableSuspense ?? false
  );
  return { client, cache: ssrCache };
};
