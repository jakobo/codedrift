import React from "react";
import { Provider as ThemeProvider } from "src/theme";

export default function Providers({ children } = {}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
