import { DateTime } from "luxon";
import yaml from "js-yaml";
import sort from "sort-array";
import { type ResultOf } from "@graphql-typed-document-node/core";
import Markdoc, { RenderableTreeNodes } from "@markdoc/markdoc";
import { demoji } from "../demoji";
import { postData } from "gql/posts";
import { Post } from "types/Post";
import { markdocSchema } from "lib/markdoc/schema";

export type PostFrontmatter = {
  slug: string;
  published?: Date;
  description?: string;
  repost?: {
    url: string;
    text: string;
  };
  changelog?: {
    on: Date;
    note: string;
  }[];
};

type BlogPostFromGithub = ResultOf<
  typeof postData
>["repository"]["discussions"]["nodes"][0];

export const discussionToBlog = (item: BlogPostFromGithub): Post => {
  const isDraft = false;

  // de-decorate frontmatter
  const demattered = item.body.replace(
    /^(?:```(?:yaml)?[\r\n]+)?(---[\r\n]+[\s\S]+?[\r\n]+---)(?:[\r\n]+```)?/gim,
    // ^fence ^lang            ^actual frontmatter                    ^ end fence
    "$1"
  );

  const ast = Markdoc.parse(demattered);
  const frontmatter =
    typeof ast.attributes.frontmatter === "undefined"
      ? undefined
      : (yaml.load(ast.attributes.frontmatter) as PostFrontmatter);

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
  );

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
  const changelog = (frontmatter?.changelog ?? []).map((dt) => {
    const changeOn = DateTime.fromJSDate(dt.on);
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
    );
    return {
      isoDate: changeOn.isValid ? changeOn.toISO() : null,
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

  if (frontmatter.repost) {
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
    );
    repost.markdoc = markdoc;
  }

  sort(changelog, {
    by: "isoDate",
    order: "desc",
  });

  return {
    id: "" + item.id,
    commentUrl: item.url,
    slug: frontmatter.slug,
    draft: isDraft,
    title: item.title || "A post on Thunked",
    description: frontmatter?.description || null,
    excerpt: frontmatter?.description ?? "",
    changelog,
    markdoc,
    body: item.body,
    source: item.url,
    canonicalUrl,
    updatedAt: item.lastEditedAt || null,
    publishedAt: frontmatter.published
      ? DateTime.fromJSDate(frontmatter.published).toISO()
      : null,
    category,
    tags,
    repost: frontmatter.repost ? repost : null,
  };
};
