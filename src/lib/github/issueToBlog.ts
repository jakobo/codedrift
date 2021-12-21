import { Octokit } from "octokit";
import matter from "gray-matter";
import { DateTime } from "luxon";
import { demoji } from "../demoji";
import strip from "strip-markdown";
import { remark } from "remark";
import { Unwrap } from "types/Unwrap";

export type Tag = {
  name: string;
  description?: string;
  id: string | number;
};

export type Post = {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  slug: string;
  draft: boolean;
  canonicalUrl: string;
  body: string;
  source: string;
  publishedAt: string;
  updatedAt: string;
  category?: Tag | null;
  tags: Tag[];
};

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

const octokit = new Octokit();
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

export const githubIssueToBlog = (
  item: Unwrap<
    ReturnType<typeof octokit.rest.search.issuesAndPullRequests>
  >["data"]["items"][0]
): Post => {
  const isDraft = item.state === "open";
  const { content, data: frontmatter } = gfmMatter(item.body);
  const canonicalUrl = `https://codedrift.com/thunked/${
    frontmatter.slug || ""
  }`;

  const category =
    item.labels
      .filter((label) => label.name.indexOf("📚") === 0)
      .map((label) => ({
        name: demoji(label.name),
        description: label.description || null,
        id: label.id,
      }))?.[0] || null;

  const tags = item.labels
    .filter((label) => !category?.id || label.id !== category.id)
    .filter((label) => label.name.toLowerCase().indexOf("thunked") === -1)
    .map((label) => ({
      // https://stackoverflow.com/a/69661174
      name: demoji(label.name),
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
    source: item.html_url,
    canonicalUrl,
    updatedAt: item.updated_at || null,
    publishedAt: frontmatter.published
      ? DateTime.fromJSDate(frontmatter.published).toISO()
      : null,
    category,
    tags,
  };
};
