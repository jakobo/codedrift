import caseKeys from "camelcase-keys";
import filterObj from "filter-obj";
import { PostFields, TagFields } from "./typeDefs";
import yaml from "js-yaml";
import { readingTime } from "@tryghost/helpers";

export const encodeCursor = (o) =>
  Buffer.from(JSON.stringify(o)).toString("base64");

export const decodeCursor = (s) =>
  JSON.parse(Buffer.from(s, "base64").toString());

export const ghostTags = (tags = []) =>
  (tags || []).map((tag) => {
    return filterObj(tag, TagFields);
  });

export const ghost2Post = (post) => {
  const clean = filterObj(caseKeys(post, { deep: true }), PostFields);
  clean.tags = ghostTags(clean.tags);

  clean.changelog = post.codeinjection_foot
    ? yaml.load(post.codeinjection_foot)
    : null;
  clean.readingTime = parseInt(
    readingTime(post, {
      minute: "1",
      minutes: "%",
    }),
    10
  );
  return clean;
};
