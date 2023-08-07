// Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
// >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
// src: https://github.com/vercel/next.js/discussions/11209#discussioncomment-38480
export const deleteUndefined = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};
