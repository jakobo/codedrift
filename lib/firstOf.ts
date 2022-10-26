export const firstOf = (s?: string | string[]): string | undefined => {
  if (typeof s === "undefined" || typeof s === "string") {
    return s;
  }

  return s[0];
};
