import React, {
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ValidMode = "light" | "dark";
type ColorSchemeContext = {
  setColorScheme: (setTo: ValidMode) => void;
  mode: ValidMode;
};

const Context = React.createContext<ColorSchemeContext>({
  setColorScheme() {
    // empty
  },
  mode: "dark",
});

const modes = new Set(["dark", "light"]);

const ColorSchemeProvider: React.FC<
  PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
  const [mode, setMode] = useState<ValidMode>("dark");
  const isBrowser = typeof window !== "undefined";

  const handleMediaChange = useCallback((evt: MediaQueryListEvent) => {
    if (evt.matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    mm.addEventListener("change", handleMediaChange);
    return () => {
      mm.removeEventListener("change", handleMediaChange);
    };
  }, [handleMediaChange, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("colorScheme");
    if ((saved && saved === "light") ?? saved === "dark") {
      setMode(saved);
    } else if (mm.matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    document.body.parentElement?.classList.remove("light");
    document.body.parentElement?.classList.remove("dark");
    document.body.parentElement?.classList.add(mode);
    localStorage.setItem("colorScheme", mode);
  }, [isBrowser, mode]);

  const setColorScheme = useCallback((setTo: ValidMode) => {
    if (modes.has(setTo)) {
      setMode(setTo);
    }
  }, []);

  const payload = useMemo(
    () => ({
      setColorScheme,
      mode,
    }),
    [mode, setColorScheme]
  );

  return <Context.Provider value={payload}>{children}</Context.Provider>;
};

export default ColorSchemeProvider;

export const useColorScheme = () => {
  const c = useContext(Context);
  return c;
};
