import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const Context = React.createContext();

const modes = ["dark", "light"];
export default function CSProvider({ children }) {
  const [mode, setMode] = useState(null);
  const isBrowser = typeof window !== "undefined";

  const handleMediaChange = useCallback((evt) => {
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
  }, [isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("colorScheme");
    if (saved) {
      setMode(saved);
    } else if (mm.matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    document.body.parentNode.classList.remove("light");
    document.body.parentNode.classList.remove("dark");
    document.body.parentNode.classList.add(mode);
    localStorage.setItem("colorScheme", mode);
  }, [isBrowser, mode]);

  const setColorScheme = useCallback((setTo) => {
    if (modes.includes(setTo)) {
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
}

export const useColorScheme = () => {
  const c = useContext(Context);
  return c;
};
