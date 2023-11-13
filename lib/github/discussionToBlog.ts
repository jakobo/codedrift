import { DateTime } from "luxon";
import yaml from "js-yaml";
import sort from "sort-array";
import { type ResultOf } from "@graphql-typed-document-node/core";
import Markdoc, { type RenderableTreeNodes } from "@markdoc/markdoc";
import { type Get } from "type-fest";
import { isPresent } from "ts-is-present";
import { demoji } from "../demoji.js";
import { type postData } from "@/gql/posts.js";
import { type Post } from "@/types/Post.js";
import { markdocSchema } from "@/lib/markdoc/schema.js";

export type PostFrontmatter = {
  slug: string;
  published?: Date;
  description?: string;
  repost?: {
    url: string;
    text: string;
  };
  changelog?: Array<{
    on: Date;
    note: string;
  }>;
};

type BlogPostFromGithub = NonNullable<
  Get<ResultOf<typeof postData>, "repository.discussions.nodes[0]">
>;

export const discussionToBlog = (item: BlogPostFromGithub): Post => {
  const isDraft = false;

  // de-decorate frontmatter
  const demattered = (item.body ?? "").replaceAll(
    /^(?:```(?:yaml)?[\r\n]+)?(---[\r\n]+[\s\S]+?[\r\n]+---)(?:[\r\n]+```)?/gim,
    // ^fence ^lang            ^actual frontmatter                    ^ end fence
    "$1"
  );

  const ast = Markdoc.parse(demattered);
  const frontmatter =
    ast.attributes.frontmatter === undefined
      ? undefined
      : (yaml.load(ast.attributes.frontmatter as string) as PostFrontmatter);

  const markdoc = JSON.parse(
    JSON.stringify(
      Markdoc.transform(ast, {
        ...markdocSchema,
        variables: {
          ...markdocSchema.variables,
          frontmatter: frontmatter ?? {},
        },
      })
    )
  ) as RenderableTreeNodes;

  const canonicalUrl = `https://codedrift.com/thunked/${
    frontmatter?.slug ?? ""
  }`;

  const category = (item?.labels?.nodes ?? [])
    .filter((label) => label?.name.startsWith("📚"))
    .filter(isPresent)
    .map((label) => ({
      name: label.name,
      display: demoji(label.name),
      description: label.description ?? undefined,
      id: label.id,
    }))?.[0];

  const tags = (item.labels?.nodes ?? [])
    .filter((label) => !category?.id || label?.id !== category.id)
    .filter((label) => !label?.name.toLowerCase().includes("thunked"))
    .filter(isPresent)
    .map((label) => ({
      name: label.name,
      display: demoji(label.name),
      description: label.description ?? undefined,
      id: label.id,
    }));

  // build changelog. Ensure we see a proper ISO date
  const changelog = (frontmatter?.changelog ?? []).map((dt) => {
    const changeOn = DateTime.fromJSDate(dt.on as unknown as Date);
    const ast = Markdoc.parse(dt.note);
    const markdoc = JSON.parse(
      JSON.stringify(
        Markdoc.transform(ast, {
          ...markdocSchema,
          variables: {
            ...markdocSchema.variables,
          },
        })
      )
    ) as RenderableTreeNodes;
    return {
      isoDate: changeOn.toISO() ?? DateTime.now().toISO()!,
      change: {
        body: dt.note,
        markdoc,
      },
    };
  });

  // repost info
  const repost: { url: string; text: string; markdoc?: RenderableTreeNodes } = {
    url: "",
    text: "",
    markdoc: undefined,
  };

  if (frontmatter?.repost) {
    repost.url = frontmatter.repost.url;
    repost.text = frontmatter.repost.text;
    const ast = Markdoc.parse(frontmatter.repost.text);
    const markdoc = JSON.parse(
      JSON.stringify(
        Markdoc.transform(ast, {
          ...markdocSchema,
          variables: {
            ...markdocSchema.variables,
          },
        })
      )
    ) as RenderableTreeNodes;
    repost.markdoc = markdoc;
  }

  sort(changelog, {
    by: "isoDate",
    order: "desc",
  });

  // drop posts with no slug or publish data
  if (!frontmatter?.slug || !frontmatter.published) {
    throw new Error(`No slug found on ${item.url}. Found ${JSON.stringify(frontmatter)}`);
  }

  return {
    id: String(item.id),
    commentUrl: item.url,
    slug: frontmatter?.slug,
    draft: isDraft,
    title: item.title || "A post on Thunked",
    description: frontmatter?.description,
    excerpt: frontmatter?.description,
    changelog,
    markdoc,
    body: item.body,
    source: item.url,
    canonicalUrl,
    updatedAt: item.lastEditedAt,
    publishedAt: DateTime.fromJSDate(frontmatter.published).toISO()!,
    category,
    tags,
    repost: frontmatter.repost ? repost : undefined,
  };
};
