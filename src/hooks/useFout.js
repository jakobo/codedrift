import React, { useCallback, useContext, useMemo, useState } from "react";

const Context = React.createContext();

export default function Provider(props = {}) {
  const [enabled, setEnabled] = useState(true);
  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
    }),
    [enabled, setEnabled]
  );
  return <Context.Provider value={value} {...props} />;
}

export const useFoutValue = () => {
  const ctx = useContext(Context);
  return ctx.enabled;
};

export const useFout = () => {
  const ctx = useContext(Context);
  const cb = useCallback(() => {
    ctx.setEnabled((last) => !last);
  }, [ctx]);
  return cb;
};
