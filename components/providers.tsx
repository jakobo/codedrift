import React, { PropsWithChildren } from "react";
import ColorSchemeProvider from "hooks/useColorScheme";

interface ProvidersProps {}
export const Providers: React.FC<PropsWithChildren<ProvidersProps>> = ({
  children,
}) => {
  return <ColorSchemeProvider>{children}</ColorSchemeProvider>;
};
