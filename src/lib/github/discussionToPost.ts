import matter from "gray-matter";
import { DateTime } from "luxon";
import { demoji } from "../demoji";
import strip from "strip-markdown";
import { remark } from "remark";
import { PostDetailsFragment } from "__generated__/graphql";
import { Post } from "types/Post";

export type PostFrontmatter = {
  slug: string;
  published?: Date;
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

const engine = remark().use(strip);
const gfmMatter = (str: string) => {
  const decoded = str.replace(
    /^(?:```(?:yaml)?[\r\n]+)?(---[\r\n]+[\s\S]+?[\r\n]+---)(?:[\r\n]+```)?/gim,
    // ^code  ^lang            ^actual frontmatter
    "$1"
  );
  return matter(decoded) as gfmMatterResult;
};
const excerpt = (str: string, size = 3): string => {
  const { content } = gfmMatter(str);
  const result = engine.processSync(content);
  return (
    (result.toString().split(/[\r\n]/g)?.[0] || "")
      .split(".")
      .slice(0, size)
      .join(".")
      .trim() + "."
  );
};

export const discussionToBlog = (item: PostDetailsFragment): Post => {
  const isDraft = false;
  const { content, data: frontmatter } = gfmMatter(item.body);
  const canonicalUrl = `https://codedrift.com/thunked/${
    frontmatter.slug || ""
  }`;
  const category =
    (item.labels?.nodes || [])
      .filter((label) => label.name.indexOf("📚") === 0)
      .map((label) => ({
        name: label.name,
        description: label.description || null,
        id: label.id,
      }))?.[0] || null;
  const tags = (item.labels?.nodes || [])
    .filter((label) => !category?.id || label.id !== category.id)
    .filter((label) => label.name.toLowerCase().indexOf("thunked") === -1)
    .map((label) => ({
      name: label.name,
      display: demoji(label.name),
      description: label.description || null,
      id: label.id,
    }));

  return {
    id: "" + item.id,
    slug: frontmatter.slug,
    draft: isDraft,
    title: item.title || "A post on Thunked",
    description: frontmatter?.description || null,
    excerpt: frontmatter?.description || excerpt(content),
    body: content,
    source: item.url,
    canonicalUrl,
    updatedAt: item.lastEditedAt || null,
    publishedAt: frontmatter.published
      ? DateTime.fromJSDate(frontmatter.published).toISO()
      : null,
    category,
    tags,
  };
};
