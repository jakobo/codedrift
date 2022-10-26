import React, { useRef } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Layout } from "components/Layout";
import { Webmention as WebmentionItem } from "components/Webmention";
import { usePrism } from "hooks/usePrism";
import WebmentionClient, { Webmention } from "lib/webmentions/client";
import { discussionToBlog } from "lib/github/discussionToPost";
import { useRouter } from "next/router";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "gql";
import { PROSE, MINOR_LINK, SECTION_HEADLINE } from "data/constants";
import cx from "classnames";
import { NextSeo, ArticleJsonLd } from "next-seo";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { TwitterIcon } from "components/icons/Twitter";
import { demoji } from "lib/demoji";
import Link from "next/link";
import { DateTime } from "luxon";
import { Tag } from "types/Post";
import { useQuery } from "urql";
import { selectedPostsWithSearch } from "gql/posts";

export const slugToSearch = (slug: string) =>
  `"slug: ${slug}" in:body category:"Thunked" repo:jakobo/codedrift`;

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

// order for listing tags on blog posts
const tagSort = ["🏷", "⌛"];

type ThunkedBySlugProps = {
  webmentions?: Webmention[];
};

const ThunkedBySlug: React.FC<ThunkedBySlugProps> = ({ webmentions = [] }) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;
  const [{ data }] = useQuery({
    query: selectedPostsWithSearch,
    variables: {
      search: slugToSearch(slug),
      first: 1,
    },
    pause: !slug,
  });

  const result = data?.search?.nodes?.[0];

  const post = result ? discussionToBlog(result) : null;

  const content = useRef<HTMLDivElement>(null);
  usePrism(content);

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
  const hasMentions = webmentions.length > 0;
  // add a TS to ensure caching works as expected
  const tsWindow = Math.floor(
    (post?.updatedAt ? new Date(post.updatedAt).getTime() : 0) / 86400
  );

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
        <div className="flex-col w-full">
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
            <div className="text-gray-500 text-sm">
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
            <div
              className={cx(PROSE, "pt-4")}
              ref={content}
              dangerouslySetInnerHTML={{ __html: post.html || post.body }}
            />
            {post.changelog && post.changelog.length > 0 ? (
              <div
                id="changelog"
                className={cx(
                  "mt-4 border border-gray-400 dark:border-gray-700 rounded-md bg-gray-300 dark:bg-gray-800 p-2 prose prose-sm prose-stone dark:prose-invert prose-tr:border-0 prose-table:w-full prose-table:mt-0 max-w-none"
                )}
              >
                <h4 className="font-bold">Changelog</h4>
                <table className="border-0">
                  <tbody>
                    {post.changelog.map((evt, idx) => (
                      <tr key={idx}>
                        <td>
                          {DateTime.fromISO(evt.isoDate).toLocaleString(
                            DateTime.DATE_SHORT
                          )}
                        </td>
                        <td
                          className="heir-p:m-0"
                          dangerouslySetInnerHTML={{
                            __html: evt.change.html || evt.change.body,
                          }}
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {/* Mentions */}
          <div className="border-t border-t-gray-500 mt-4 pt-4 max-w-reading">
            <div className="flex flex-row pb-2">
              <div className="flex-grow font-sans-caps font-bold">
                Webmentions
              </div>
              <a
                className="font-sans-caps block no-underline"
                href="https://indieweb.org/Webmention"
              >
                <QuestionMarkCircleIcon className="inline-block h-3 w-3 -mt-1 mr-1" />
                What&rsquo;s this?
              </a>
            </div>
            <div className="pb-4">
              <p>
                <span className={cx(PROSE, "mr-2")}>
                  Tweets, mentions, and trackbacks
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    tweetSlug
                  )}&url=${encodeURIComponent(post.canonicalUrl)}&via=jakobo`}
                  style={{ color: "#1DA1F2" }}
                >
                  <TwitterIcon className="inline-block h-3 w-4 fill-current mr-1 mb-1" />
                  Share your thoughts
                </a>
              </p>
            </div>
            {hasMentions ? null : (
              <div className={PROSE}>
                <p>
                  As this gets discussed, comments will show up here. If the
                  post is new, it may take a bit for your thoughts to get from
                  one side of the internet to the other.
                </p>
              </div>
            )}
            <div>
              {webmentions.map((wm) => (
                <WebmentionItem key={wm.id} mention={wm} className="pb-8" />
              ))}
            </div>
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
  const wm = new WebmentionClient();

  const webmentions = await wm.get({
    target: post.canonicalUrl,
    page: 0,
    perPage: 20,
  });

  return {
    props: {
      urqlState: cache.extractData(),
      webmentions: webmentions.links || [],
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
