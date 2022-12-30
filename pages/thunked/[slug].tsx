import React, { useCallback, useMemo } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import cx from "classnames";
import { NextSeo, ArticleJsonLd } from "next-seo";
import Link from "next/link";
import { DateTime } from "luxon";
import Markdoc, { RenderableTreeNodes } from "@markdoc/markdoc";
import Head from "next/head";
import { Layout } from "components/Layout";
import { discussionToBlog } from "lib/github/discussionToPost";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "gql";
import { PROSE, MINOR_LINK, SECTION_HEADLINE } from "data/constants";
import { TwitterIcon } from "components/icons/Twitter";
import { demoji } from "lib/demoji";
import { Post, Tag } from "types/Post";
import { selectedPostsWithSearch } from "gql/posts";
import { markdocComponents } from "lib/markdoc/schema";
import { GitHubIcon } from "components/icons/Github";
import { REPO_FQN } from "lib/constants";

export const slugToSearch = (slug: string) =>
  `"slug: ${slug}" in:body category:"Thunked" repo:${REPO_FQN}`;

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

// order for listing tags on blog posts
const tagSort = ["🏷", "⌛"];

type ThunkedBySlugProps = {
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

const ThunkedBySlug: React.FC<ThunkedBySlugProps> = ({ post }) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const md = useMarkdoc(post?.markdoc);

  const repost = useMarkdoc(post?.repost?.markdoc);
  const changelogs = useMarkdocs(
    post?.changelog,
    useCallback((item) => item.change.markdoc, [])
  );

  const tagsByEmoji = (post?.tags ?? []).reduce((all, curr) => {
    const none = demoji(curr.name);
    const icon = curr.name.replace(none, "").trim();
    if (!all[icon]) {
      all[icon] = [];
    }
    all[icon].push(curr);
    return all;
  }, {});

  const tweetSlug = post?.title ? `${post.title} on CodeDrift` : null;

  const ogImage = new URL(
    `${
      process.env.NODE_ENV === "production"
        ? "https://codedrift.com"
        : "http://localhost:3000"
    }/api/v3/thunked/og`
  );
  ogImage.searchParams.set("title", post?.title);
  ogImage.searchParams.set(
    "published",
    post?.publishedAt
      ? DateTime.fromISO(post.publishedAt).toSeconds().toString()
      : undefined
  );
  ogImage.searchParams.set(
    "updated",
    post?.updatedAt
      ? DateTime.fromISO(post.updatedAt).toSeconds().toString()
      : undefined
  );
  ogImage.searchParams.set("category", post?.category?.display);
  ogImage.searchParams.set(
    "tags",
    post?.tags?.map((t) => t.display).join(", ")
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
              ...(post.tags || []).map((t) => t.display),
            ].filter((t) => t),
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
        description={post.description}
      />
      <Layout>
        <div className="w-full flex-col">
          {/* Post */}
          <div className="w-full flex-shrink-0">
            <h1 className={cx(SECTION_HEADLINE)}>{widont(post.title)}</h1>
            <div>
              {!post.publishedAt ? (
                <Link href={`/thunked/${slug}`}>
                  <a className="text-sm text-gray-500"># permalink</a>
                </Link>
              ) : (
                <Link href={`/thunked/${slug}`}>
                  <a
                    className="text-sm text-gray-500"
                    title={DateTime.fromISO(post.publishedAt).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  >
                    written{" "}
                    {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
                  </a>
                </Link>
              )}
              {post.updatedAt && post.changelog && post.changelog.length > 0 ? (
                <Link href="#changelog">
                  <a className="ml-2 text-sm text-primary-500">
                    updated{" "}
                    {DateTime.fromISO(post.updatedAt).toRelativeCalendar()}
                  </a>
                </Link>
              ) : null}
            </div>
            <div className="text-sm text-gray-500">
              {post.category ? (
                <span>
                  in&nbsp;
                  <Link href={`/thunked/tag/${post.category.name}`}>
                    <a
                      className={cx(MINOR_LINK, "mr-1")}
                      title={post.category.description ?? ""}
                    >
                      {post.category.display ?? post.category?.name ?? null}
                    </a>
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
                        <Link href={`/thunked/tag/${tag.name}`}>
                          <a
                            className={cx(MINOR_LINK, "mr-1")}
                            title={tag.description ?? ""}
                          >
                            {tag.display ?? tag.name ?? null}
                          </a>
                        </Link>
                        {idx < all.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>

            {post.repost ? (
              <div className={cx(PROSE, "mx-8 pt-4 pb-1 text-sm italic")}>
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
                  "prose-sm prose prose-stone mt-4 max-w-none rounded-md border border-gray-400 bg-gray-300 p-2 prose-table:mt-0 prose-table:w-full prose-tr:border-0 dark:border-gray-700 dark:bg-gray-800 dark:prose-invert"
                )}
              >
                <h4 className="font-bold">Changelog</h4>
                <table className="border-0">
                  <tbody>
                    {(post?.changelog ?? []).map((evt, idx) => (
                      <tr key={idx}>
                        <td>
                          {DateTime.fromISO(evt.isoDate).toLocaleString(
                            DateTime.DATE_SHORT
                          )}
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
            <a
              className="cursor-pointer"
              href="https://twitter.com"
              onClick={(e) => {
                e.preventDefault();
                location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  tweetSlug
                )}&url=${encodeURIComponent(post.canonicalUrl)}&via=jakobo`;
              }}
              style={{ color: "#1DA1F2" }}
            >
              <TwitterIcon className="mr-1 mb-1 inline-block h-3 w-4 fill-current" />
              Share this via Twitter
            </a>
            &nbsp;or&nbsp;
            <a
              href={post.commentUrl}
              className="text-[#333333] dark:text-[#f5f5f5]"
            >
              <GitHubIcon className="mr-1 mb-1 inline-block h-3 w-4 fill-current" />
              Join the Discussion on GitHub
            </a>
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
  const slug = Array.isArray(ctx.params.slug)
    ? ctx.params.slug[0]
    : ctx.params.slug;

  const { client, cache } = initDefaultUrqlClient(false);
  const res = await client
    .query(selectedPostsWithSearch, {
      search: slugToSearch(slug),
      first: 1,
    })
    .toPromise();

  const count = res.data?.search?.discussionCount || 0;
  if (count === 0) {
    return {
      notFound: true,
    };
  }

  const post = discussionToBlog(res.data.search.nodes?.[0]);

  return {
    props: {
      urqlState: cache.extractData(),
      post,
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
