import { PostFields, TagFields } from "./typeDefs";
import { readingTime } from "@tryghost/helpers";
import caseKeys from "camelcase-keys";
import filterObj from "filter-obj";
import yaml from "js-yaml";

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

  clean.changelog = post.codeinjection_foot
    ? yaml.load(post.codeinjection_foot)
    : null;

  // set category, remove from tags, drop #tags
  clean.category = ghostTags([post.primary_tag])[0];
  clean.tags = ghostTags(clean.tags)
    .filter((tag) => tag.id !== clean.category.id)
    .filter((tag) => tag.name.indexOf("#") !== 0);

  clean.readingTime = parseInt(
    readingTime(post, {
      minute: "1",
      minutes: "%",
    }),
    10
  );
  return clean;
};
