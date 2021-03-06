import GhostContentAPI from "@tryghost/content-api";
import caseKeys from "camelcase-keys";

const endpoint = process.env.GHOST_ENDPOINT;
const apiKey = process.env.GHOST_CONTENT_KEY;

export const getClient = () => {
  const api = new GhostContentAPI({
    version: "v3",
    key: apiKey,
    url: endpoint,
  });
  return api;
};

// convert offset/limit to ghost's page/limit syntax
export const pager = (offset, limit) => {
  let range;
  let leftShift;
  for (range = limit; range <= offset + limit; range++) {
    for (leftShift = 0; leftShift <= range - limit; leftShift++) {
      if ((offset - leftShift) % range === 0) {
        const page = (offset - leftShift) / range;
        return {
          limit: range,
          page,
          waste: {
            head: leftShift,
            tail: (page + 1) * range - (offset + limit),
          },
        };
      }
    }
  }
};
