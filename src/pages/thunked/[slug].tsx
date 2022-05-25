import React, { useRef } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "src/components/Post";
import { Layout } from "src/components/Layout";
import { Webmention as WebmentionItem } from "src/components/Webmention";
import { usePrism } from "src/hooks/usePrism";
import WebmentionClient, { Webmention } from "src/lib/webmentions/client";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import {
  Discussion,
  SelectPostsWithSearchDocument,
  SelectPostsWithSearchQuery,
  SelectPostsWithSearchQueryVariables,
  useSelectPostsWithSearchQuery,
} from "__generated__/graphql";
import { useRouter } from "next/router";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "src/graphql";
import { PROSE } from "src/constants";
import cx from "classnames";
import { NextSeo, ArticleJsonLd } from "next-seo";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { TwitterIcon } from "src/components/icons/Twitter";

export const slugToSearch = (slug: string) =>
  `"slug: ${slug}" in:body category:"Thunked" repo:jakobo/codedrift`;

type ThunkedBySlugProps = {
  webmentions?: Webmention[];
};

const ThunkedBySlug: React.FC<ThunkedBySlugProps> = ({ webmentions = [] }) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;
  const [{ data }] = useSelectPostsWithSearchQuery({
    variables: {
      search: slugToSearch(slug),
    },
    pause: !slug,
  });
  const result = data?.search?.nodes?.[0];

  const post = result ? discussionToBlog(result as Discussion) : null;

  const content = useRef<HTMLDivElement>(null);
  usePrism(content);

  // abort after all hooks and no post
  if (!post) {
    return null;
  }

  const tweetSlug = `${post.title} on CodeDrift`;
  const hasMentions = webmentions.length > 0;
  // add a TS to ensure caching works as expected
  const tsWindow = Math.floor(
    (post?.updatedAt ? new Date(post.updatedAt).getTime() : 0) / 86400
  );
  const mediaImage = `https://codedrift.com/api/v2/thunked/og-image/${
    post.slug ?? ""
  }?ts=${tsWindow}`;

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
              url: mediaImage,
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
        images={[mediaImage]}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={["Jakob Heuser"]}
        description={post.description}
      />
      <Layout>
        <div className="flex-col w-full">
          <Post
            post={post}
            titleTag={({ children, ...props }) => (
              <h1
                {...props}
                className={`${props.className || ""} font-title text-6xl`}
              >
                {children}
              </h1>
            )}
          >
            <div
              ref={content}
              dangerouslySetInnerHTML={{ __html: post.html || post.body }}
            />
          </Post>

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
    .query<SelectPostsWithSearchQuery, SelectPostsWithSearchQueryVariables>(
      SelectPostsWithSearchDocument,
      {
        search: slugToSearch(slug),
      }
    )
    .toPromise();
  const count = res.data?.search?.discussionCount || 0;
  if (count === 0) {
    return {
      notFound: true,
    };
  }

  const post = discussionToBlog(res.data.search.nodes?.[0] as Discussion);
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
