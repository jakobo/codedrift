export const firstOf = (s?: string | string[]): string | undefined => {
  if (s === undefined || typeof s === "string") {
    return s;
  }

  return s[0];
};
