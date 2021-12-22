import { GraphQLClient } from "graphql-request";
import { getSdk } from "__generated__/graphql";

type Clients = "github";

const clients = {
  github: getSdk(
    new GraphQLClient(
      `${process.env.NEXT_PUBLIC_URL}/api/proxy/api.github.com/graphql`
    )
  ),
};

export const getClient = (service: Clients) => {
  if (clients[service]) return clients[service];
  throw new Error("No client found for " + service);
};
