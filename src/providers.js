import { Provider as ThemeProvider } from "src/theme";
import { Provider as UrqlProvider } from "urql";
import { createClient } from "./lib/urql";
import FoutProvider from "src/hooks/useFout";
import React from "react";

export default function Providers({ children } = {}) {
  const client = createClient();
  return (
    <UrqlProvider value={client}>
      <FoutProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </FoutProvider>
    </UrqlProvider>
  );
}
