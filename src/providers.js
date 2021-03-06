import React from "react";
import { Provider as ThemeProvider } from "src/theme";
import { createClient, Provider as UrqlProvider } from "urql";

const GRAPHQL_ENDPOINT = "/api/v1/graphql";

export default function Providers({ children } = {}) {
  const client = createClient({
    url: GRAPHQL_ENDPOINT,
  });
  return (
    <UrqlProvider value={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </UrqlProvider>
  );
}
