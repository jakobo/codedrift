import matter from "gray-matter";
import { DateTime } from "luxon";
import { demoji } from "../demoji";
import { Post } from "types/Post";
import { createParser as createGitHubParser } from "../parser/github";
import { createParser as createTextParser } from "../parser/plaintext";
import { withHtmlString } from "../parser/withHtmlString";
import yaml from "js-yaml";
import sort from "sort-array";
import { type ResultOf } from "@graphql-typed-document-node/core";
import { postData } from "gql/posts";

export type PostFrontmatter = {
  slug: string;
  published?: string;
  description?: string;
  repost?: {
    url: string;
    text: string;
  };
  changelog?: {
    [date: string]: string;
  };
};

type gfmMatterResult = matter.GrayMatterFile<string> & {
  data: PostFrontmatter;
};

const gfmMatter = (str: string) => {
  const decoded = str.replace(
    /^(?:```(?:yaml)?[\r\n]+)?(---[\r\n]+[\s\S]+?[\r\n]+---)(?:[\r\n]+```)?/gim,
    // ^code  ^lang            ^actual frontmatter
    "$1"
  );
  return matter(decoded, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as any,
    },
  }) as gfmMatterResult;
};

const toHTML = withHtmlString(createGitHubParser());

const excerpt = (str: string, size = 3): string => {
  const { content } = gfmMatter(str);
  const parser = createTextParser();
  const result = parser.processSync(content).toString();
  return (
    (result.split(/[\r\n]/g)?.[0] || "")
      .split(".")
      .slice(0, size)
      .join(".")
      .trim() + "."
  );
};

type BlogPostFromGithub = ResultOf<
  typeof postData
>["repository"]["discussions"]["nodes"][0];

export const discussionToBlog = (item: BlogPostFromGithub): Post => {
  const isDraft = false;
  const { content, data: frontmatter } = gfmMatter(item.body);
  const canonicalUrl = `https://codedrift.com/thunked/${
    frontmatter.slug || ""
  }`;
  const category =
    (item.labels?.nodes ?? [])
      .filter((label) => label.name.indexOf("📚") === 0)
      .map((label) => ({
        name: label.name,
        display: demoji(label.name),
        description: label.description || null,
        id: label.id,
      }))?.[0] || null;
  const tags = (item.labels?.nodes ?? [])
    .filter((label) => !category?.id || label.id !== category.id)
    .filter((label) => label.name.toLowerCase().indexOf("thunked") === -1)
    .map((label) => ({
      name: label.name,
      display: demoji(label.name),
      description: label.description || null,
      id: label.id,
    }));

  // build changelog. Ensure we see a proper ISO date
  const changelog = Object.keys(frontmatter?.changelog ?? {}).map((dt) => {
    const evt = frontmatter.changelog[dt];
    const changeOn = DateTime.fromISO(dt);
    return {
      isoDate: changeOn.isValid ? changeOn.toISO() : null,
      change: {
        body: evt,
        html: toHTML.processSync(evt).toString(),
      },
    };
  });

  sort(changelog, {
    by: "isoDate",
    order: "desc",
  });

  return {
    id: "" + item.id,
    slug: frontmatter.slug,
    draft: isDraft,
    title: item.title || "A post on Thunked",
    description: frontmatter?.description || null,
    excerpt: frontmatter?.description || excerpt(content),
    changelog,
    body: content,
    html: toHTML.processSync(content).toString(),
    source: item.url,
    canonicalUrl,
    updatedAt: item.lastEditedAt || null,
    publishedAt: frontmatter.published
      ? DateTime.fromISO(frontmatter.published).toISO()
      : null,
    category,
    tags,
  };
};
