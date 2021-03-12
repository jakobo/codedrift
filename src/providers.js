import { Provider as ThemeProvider } from "src/theme";
import { Provider as UrqlProvider, createClient } from "urql";
import FoutProvider from "src/hooks/useFout";
import React from "react";

const GRAPHQL_ENDPOINT = "/api/v1/graphql";

export default function Providers({ children } = {}) {
  const client = createClient({
    url: GRAPHQL_ENDPOINT,
  });
  return (
    <UrqlProvider value={client}>
      <FoutProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </FoutProvider>
    </UrqlProvider>
  );
}
