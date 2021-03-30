import { PostFields, TagFields } from "./typeDefs";
import { readingTime } from "@tryghost/helpers";
import caseKeys from "camelcase-keys";
import filterObj from "filter-obj";
import yaml from "js-yaml";

export const encodeCursor = (o) =>
  Buffer.from(JSON.stringify(o)).toString("base64");

export const decodeCursor = (s) =>
  JSON.parse(Buffer.from(s, "base64").toString());

// a wrapper for converting a ghost post object to graphql
export const ghost2Post = (post) => {
  return ghost2Graph(post, PostFields, {
    changelog: createChangelog,
    category: extractGhostCategory,
    tags: extractGhostTags,
    readingTime: extractReadingTime,
  });
};

export const ghost2Graph = (o, filter, additionalFilters) => {
  if (!o) {
    return null;
  }

  const clean = caseKeys(o, { deep: true });
  if (additionalFilters) {
    Object.getOwnPropertyNames(additionalFilters).forEach((f) => {
      clean[f] = additionalFilters[f](clean);
    });
  }

  return filterObj(clean, filter);
};

export const extractGhostCategory = (p) => {
  const primary = p.primaryTag;
  const firstTag = p.tags?.[0];
  return primary || firstTag
    ? ghost2Graph(primary || firstTag, TagFields)
    : null;
};

export const extractGhostTags = (p) =>
  !p.tags
    ? []
    : p.tags
        .map((tag) => ghost2Graph(tag, TagFields))
        .filter((tag) => tag.id !== p.category.id)
        .filter((tag) => tag.name.indexOf("#") !== 0);

export const extractReadingTime = (p) =>
  p.html || p.text
    ? parseInt(
        readingTime(p, {
          minute: "1",
          minutes: "%",
        }),
        10
      )
    : null;

export const createChangelog = (p) => {
  try {
    return p.codeinjectionFoot
      ? yaml.load(p.codeinjectionFoot)?.changelog || null
      : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
