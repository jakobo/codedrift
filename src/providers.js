import { Provider as UrqlProvider } from "urql";
import { createClient } from "./lib/urql";
import ColorSchemeProvider from "src/hooks/useColorScheme";
import React from "react";

export default function Providers({ children } = {}) {
  const client = createClient();
  return (
    <UrqlProvider value={client}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </UrqlProvider>
  );
}
