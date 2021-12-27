import ColorSchemeProvider from "src/hooks/useColorScheme";
import React, { PropsWithChildren } from "react";

interface ProvidersProps {}
export const Providers: React.FC<PropsWithChildren<ProvidersProps>> = ({
  children,
}) => {
  return <ColorSchemeProvider>{children}</ColorSchemeProvider>;
};
