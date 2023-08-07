import process from "node:process";
import React, { useCallback, useMemo } from "react";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { useRouter } from "next/router.js";
import cx from "classnames";
import { NextSeo, ArticleJsonLd } from "next-seo";
import { DateTime } from "luxon";
import Markdoc, { type RenderableTreeNodes } from "@markdoc/markdoc";
import Giscus from "@giscus/react";
import { isPresent } from "ts-is-present";
import Head from "next/head.js";
import Link from "next/link.js";
import { Layout } from "@/components/Layout.js";
import { discussionToBlog } from "@/lib/github/discussionToBlog.js";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "@/gql/index.js";
import { PROSE, MINOR_LINK, SECTION_HEADLINE } from "@/data/constants.js";
import { demoji } from "@/lib/demoji.js";
import { type Post, type Tag } from "@/types/Post.js";
import { selectedPostsWithSearch } from "@/gql/posts.js";
import { markdocComponents } from "@/lib/markdoc/schema.js";
import { REPO_FQN } from "@/lib/constants.js";

export const slugToSearch = (slug: string) =>
  `"slug: ${slug}" in:body category:"Thunked" repo:${REPO_FQN}`;

const widont = (text: string) => text.replace(/(\S)\s+(\S+)\s*$/, "$1\u00A0$2");

// order for listing tags on blog posts
const tagSort = ["🏷", "⌛"];

type ThunkedBySlugProps = {
  ghDiscussionTitle?: string;
  post?: Post;
};

const useMarkdoc = (content?: RenderableTreeNodes) => {
  const md = useMemo(
    () =>
      content
        ? Markdoc.renderers.react(content, React, {
            components: markdocComponents,
          })
        : null,
    [content]
  );
  return md;
};

const useMarkdocs = <T,>(
  content: T[],
  selectorCallback: (item: T) => RenderableTreeNodes
) => {
  const mds = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (const item of content ?? []) {
      const text = selectorCallback(item);
      if (!text) {
        out.push(null);
        continue;
      }

      const doc = Markdoc.renderers.react(text, React, {
        components: markdocComponents,
      });
      out.push(doc);
    }

    return out;
  }, [content, selectorCallback]);
  return mds;
};

const ThunkedBySlug: React.FC<ThunkedBySlugProps> = ({
  post,
  ghDiscussionTitle,
}) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const md = useMarkdoc(post?.markdoc);

  const repost = useMarkdoc(post?.repost?.markdoc);
  const changelogs = post?.changelog
    ? useMarkdocs(
        post.changelog,
        useCallback((item) => item.change.markdoc ?? null, [])
      )
    : undefined;

  const tagsByEmoji: Record<string, Tag[]> = {};
  for (const tag of post?.tags ?? []) {
    const none = demoji(tag.name);
    const icon = tag.name.replace(none, "").trim();
    if (!tagsByEmoji[icon]) {
      tagsByEmoji[icon] = [];
    }

    tagsByEmoji[icon].push(tag);
  }

  const ogImage = new URL(
    `${
      process.env.NODE_ENV === "production"
        ? "https://codedrift.com"
        : "http://localhost:3000"
    }/api/v3/thunked/og`
  );
  ogImage.searchParams.set("title", post?.title ?? "");
  ogImage.searchParams.set(
    "published",
    post?.publishedAt
      ? DateTime.fromISO(post.publishedAt).toSeconds().toString()
      : DateTime.now().toSeconds().toString()
  );
  ogImage.searchParams.set(
    "updated",
    post?.updatedAt
      ? DateTime.fromISO(post.updatedAt).toSeconds().toString()
      : DateTime.now().toSeconds().toString()
  );
  ogImage.searchParams.set("category", post?.category?.display ?? "general");
  ogImage.searchParams.set(
    "tags",
    (post?.tags ?? [])
      .map((t) => t.display)
      .filter(isPresent)
      .join(", ")
  );

  // abort after all hooks and no post
  if (!post) {
    return null;
  }

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.description}
        canonical={post.canonicalUrl}
        openGraph={{
          url: post.canonicalUrl,
          type: "article",
          article: {
            authors: ["https://codedrift.com"],
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            tags: [
              post.category?.display ?? "",
              ...(post.tags ?? []).map((t) => t.display),
            ].filter(isPresent),
          },
          images: [
            {
              url: ogImage.toString(),
              width: 1200,
              height: 600,
              alt: post.title,
            },
          ],
        }}
      />
      <Head>
        <title key="title">{post.title ?? "Codedrift"}</title>
      </Head>
      <ArticleJsonLd
        url={post.canonicalUrl}
        title={post.title}
        images={[ogImage.toString()]}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={["Jakob Heuser"]}
        description={post.description ?? ""}
      />
      <Layout>
        <div className="w-full flex-col">
          {/* Post */}
          <div className="w-full flex-shrink-0">
            <h1 className={cx(SECTION_HEADLINE)}>{widont(post.title)}</h1>
            <div>
              {post.publishedAt ? (
                <Link
                  href={`/thunked/${slug}`}
                  className="text-sm text-gray-500"
                  title={DateTime.fromISO(post.publishedAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                >
                  written{" "}
                  {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
                </Link>
              ) : (
                <Link
                  href={`/thunked/${slug}`}
                  className="text-sm text-gray-500"
                >
                  # permalink
                </Link>
              )}
              {post.updatedAt && post.changelog && post.changelog.length > 0 ? (
                <Link
                  href="#changelog"
                  className="ml-2 text-sm text-primary-500"
                >
                  updated{" "}
                  {DateTime.fromISO(post.updatedAt).toRelativeCalendar()}
                </Link>
              ) : null}
            </div>
            <div className="text-sm text-gray-500">
              {post.category ? (
                <span>
                  in&nbsp;
                  <Link
                    href={`/thunked/tag/${post.category.name}`}
                    className={cx(MINOR_LINK, "mr-1")}
                    title={post.category.description ?? ""}
                  >
                    {post.category.display ?? post.category?.name ?? null}
                  </Link>
                </span>
              ) : null}
              {tagSort.map((name, typeIdx) => {
                const list = tagsByEmoji[name] || [];
                if (list.length === 0) return null;
                return (
                  <div key={name} className={`inline-block space-x-1`}>
                    <span>+</span>
                    {list.map((tag: Tag, idx: number, all: any[]) => (
                      <span key={tag.id} className="text-gray-500">
                        <Link
                          href={`/thunked/tag/${tag.name}`}
                          className={cx(MINOR_LINK, "mr-1")}
                          title={tag.description ?? ""}
                        >
                          {tag.display ?? tag.name ?? null}
                        </Link>
                        {idx < all.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>

            {post.repost ? (
              <div className={cx(PROSE, "mx-8 pb-1 pt-4 text-sm italic")}>
                {repost ?? post.repost.text}
              </div>
            ) : null}

            <div className={cx(PROSE, post.repost ? undefined : "pt-4")}>
              {md}
            </div>

            {post.changelog && post.changelog.length > 0 ? (
              <div
                id="changelog"
                className={cx(
                  "prose prose-sm prose-stone mt-4 max-w-none rounded-md border border-gray-400 bg-gray-300 p-2 dark:prose-invert prose-table:mt-0 prose-table:w-full prose-tr:border-0 dark:border-gray-700 dark:bg-gray-800"
                )}
              >
                <h4 className="font-bold">Changelog</h4>
                <table className="border-0">
                  <tbody>
                    {(post?.changelog ?? []).map((evt, idx) => (
                      <tr key={idx}>
                        <td>
                          {evt.isoDate
                            ? DateTime.fromISO(evt.isoDate).toLocaleString(
                                DateTime.DATE_SHORT
                              )
                            : "???"}
                        </td>
                        <td className="heir-p:m-0">
                          {changelogs?.[idx] ?? evt.change.body}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {/* Discuss */}
          <div className="max-w-reading mt-4 border-t border-t-gray-500 pt-4">
            {ghDiscussionTitle ? (
              <Giscus
                id="giscus"
                repo="jakobo/codedrift"
                repoId="MDEwOlJlcG9zaXRvcnkzMzg2ODIwODI="
                category="Thunked"
                categoryId="DIC_kwDOFC_g4s4CAYqP"
                mapping="specific"
                term={ghDiscussionTitle}
                reactionsEnabled="0"
                strict="1"
                inputPosition="bottom"
                theme={
                  (process.env.NODE_ENV === "development"
                    ? "http://localhost:3000"
                    : "https://codedrift.com") + "/api/giscus.css"
                }
                lang="en"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withDefaultUrqlClient({
  ssr: false,
  staleWhileRevalidate: true,
})(ThunkedBySlug);

// https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#using-getstaticprops-or-getserversideprops
// get data ahead of time for static rendering, but on withDefaultUrql
// enable SWR in case post was updated beind the scenes
export const getStaticProps: GetStaticProps<ThunkedBySlugProps> = async (
  ctx
) => {
  const slug = Array.isArray(ctx.params?.slug)
    ? ctx.params?.slug[0]
    : ctx.params?.slug;

  const { client, cache } = initDefaultUrqlClient(false);
  const result = await client
    .query(selectedPostsWithSearch, {
      search: slugToSearch(slug ?? ""),
      first: 1,
    })
    .toPromise();

  const count = result.data?.search?.discussionCount ?? 0;
  if (count === 0) {
    return {
      notFound: true,
    };
  }

  const postData = result.data?.search.nodes?.[0];
  const post = postData ? discussionToBlog(postData) : null;

  return {
    props: {
      urqlState: cache.extractData(),
      ghDiscussionTitle: result.data?.search?.nodes?.[0]?.title,
      post: post ?? undefined,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // to keep build times down, we don't pre-query for all matching issues
    // though if we wanted to, we definitely could
    paths: [],
    fallback: true,
  };
};
