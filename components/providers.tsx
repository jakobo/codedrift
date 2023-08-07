import React, { type PropsWithChildren } from "react";
import ColorSchemeProvider from "@/hooks/useColorScheme.js";

type ProvidersProps = Record<string, unknown>;
export const Providers: React.FC<PropsWithChildren<ProvidersProps>> = ({
  children,
}) => {
  return <ColorSchemeProvider>{children}</ColorSchemeProvider>;
};
