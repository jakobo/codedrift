import React, { FC, useRef } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "src/components/Post";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { micromark } from "micromark";
import Head from "next/head";
import Icon, { InlineIcon } from "src/components/Icon";
import Layout, { createTitle } from "src/components/Layout";
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

const selectMetaAttribute = (n: string) => {
  if (n.indexOf("og:") === 0) {
    return "property";
  }

  return "name";
};

export const slugToSearch = (slug: string) =>
  `"slug: ${slug}" in:body category:"Thunked" repo:jakobo/codedrift`;

type ThunkedBySlugProps = {
  webmentions?: Webmention[];
};

const ThunkedBySlug: FC<ThunkedBySlugProps> = ({ webmentions = [] }) => {
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

  const body = micromark(post.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });

  // add a TS to ensure caching works as expected
  const tsWindow = Math.floor(
    (post?.updatedAt ? new Date(post.updatedAt).getTime() : 0) / 86400
  );
  const mediaImage = `https://codedrift.com/api/v1/og/image/thunked/${
    post.slug || ""
  }?ts=${tsWindow}`;
  const tagList = post.tags.map((t) => t.name.replace(/,/g, "")).join(",");

  const meta = {
    description: post.description,
    "og:type": "article",
    "og:title": post.title,
    "og:description": post.description,
    "og:url": post.canonicalUrl,
    "og:image": mediaImage,
    "og:image:width": 1200,
    "og:image:height": 600,

    "article:published_time": post.publishedAt || null,
    "article:modified_time": post.updatedAt || null,
    "article:tag": tagList,

    "twitter:card": "summary_large_image",
    "twitter:title": post.title,
    "twitter:description": post.description,
    "twitter:url": post.canonicalUrl,
    "twitter:image": mediaImage,
    "twitter:label1": "Written by",
    "twitter:data1": "Jakob Heuser",
    "twitter:label2": "As part of",
    "twitter:data2": tagList,
    "twitter:site": "@jakobo",
  };

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    publisher: {
      "@type": "Person",
      name: "Jakob Heuser",
      url: "https://codedrift.com",
    },
    author: {
      "@type": "Person",
      name: "Jakob Heuser",
      url: "https://codedrift.com",
      sameAs: [],
    },
    headline: post.title,
    url: post.canonicalUrl,
    image: mediaImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: tagList,
    description: post.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://codedrift.com",
    },
  };

  const tweetSlug = `${post.title} on CodeDrift`;
  const hasMentions = webmentions.length > 0;

  return (
    <>
      <Head>
        <title>{createTitle(post?.title)}</title>
        <link rel="canonical" href={post.canonicalUrl} />
        {Object.getOwnPropertyNames(meta).map((name) => {
          const value = Array.isArray(meta[name]) ? meta[name] : [meta[name]];
          return value.map((val: string, idx: number) => {
            if (val === null) {
              return null;
            }
            const bag = {
              [selectMetaAttribute(name)]: name,
              content: val,
            };
            return <meta key={`${name}-${idx}`} {...bag} />;
          });
        })}
        <script type="application/ld+json">
          {JSON.stringify(ldJson, null, 0)}
        </script>
      </Head>
      <Layout>
        <div className="flex-col w-full">
          <Post
            post={post}
            titleTag={({ children, ...props }) => (
              <h1
                {...props}
                className={`${
                  props.className || ""
                } font-sans font-bold text-4xl`}
              >
                {children}
              </h1>
            )}
          >
            <div ref={content} dangerouslySetInnerHTML={{ __html: body }} />
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
                <Icon
                  icon="question"
                  className="inline-block h-3 w-3 -mt-1 mr-1"
                />
                What&rsquo;s this?
              </a>
            </div>
            <div className="pb-4">
              <p>
                <span className="prose dark:prose-dark mr-2">
                  Tweets, mentions, and trackbacks
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    tweetSlug
                  )}&url=${encodeURIComponent(post.canonicalUrl)}&via=jakobo`}
                  style={{ color: "#1DA1F2" }}
                >
                  <InlineIcon
                    icon="twitter"
                    className="inline-block h-3 w-4 fill-current mr-1 mb-1"
                  />
                  Share your thoughts
                </a>
              </p>
            </div>
            {hasMentions ? null : (
              <div className="prose dark:prose-dark">
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
