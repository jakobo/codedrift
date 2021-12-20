import React, { FC, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Octokit } from "octokit";
import { Post } from "src/components/Post";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { micromark } from "micromark";
import Head from "next/head";
import Icon, { InlineIcon } from "src/components/Icon";
import Layout, { createTitle } from "src/components/Layout";
import { Webmention as WebmentionItem } from "src/components/Webmention";
import { usePrism } from "src/hooks/usePrism";
import Link from "next/link";
import WebmentionClient, { Webmention } from "src/lib/webmentions/client";
import {
  githubIssueToBlog,
  Post as PostItem,
} from "src/lib/github/issueToBlog";

const selectMetaAttribute = (n: string) => {
  if (n.indexOf("og:") === 0) {
    return "property";
  }

  return "name";
};

type IsDraftProps = {
  title: string;
  showButton: boolean;
  onClick: () => void;
};
const IsDraft: FC<IsDraftProps> = ({ title, showButton, onClick }) => {
  return (
    <div className="prose dark:prose-dark max-w-reading p-4 bg-gray-100 dark:bg-gray-800 mb-24">
      <p>
        ⚠ <strong>Do not share this article</strong>
      </p>
      <p>
        You&rsquo;re currently viewing a draft of content for Code Drift. It is
        not live, and this is not the final URL. If you have thoughts, reach out
        to me via your usual means. You can also{" "}
        <Link
          href={`https://twitter.com/messages/compose?recipient_id=855061&text=${encodeURIComponent(
            `I have feedback on ${title || "a post"}`
          )}`}
          passHref
        >
          <a href="overridden">DM me via Twitter @jakobo</a>
        </Link>
        , or email jakob [at] this domain.
      </p>
      {showButton ? (
        <button
          className="bg-brand-500 dark:bg-brand-invert-500 px-4 py-2 text-light dark:text-dark rounded"
          onClick={() => (onClick ? onClick() : null)}
        >
          Got it, show the post
        </button>
      ) : null}
    </div>
  );
};

type ThunkedBySlugProps = {
  post?: PostItem;
  webmentions?: Webmention[];
  error?: number;
};

const ThunkedBySlug: FC<ThunkedBySlugProps> = ({
  error = null,
  post = null,
  webmentions = [],
}) => {
  const [ack, setAck] = useState(!post?.draft);
  const content = useRef<HTMLDivElement>(null);
  usePrism(content);

  if (error) {
    return null;
  }

  if (!post || !post?.body) {
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

  const tweetSlug = `${post.title} on Code Drift`;
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
          {!ack ? (
            <IsDraft
              title={post?.title}
              showButton={!ack}
              onClick={() => setAck(true)}
            />
          ) : null}
          {ack ? (
            <Post
              title={post?.title}
              publishedAt={post?.publishedAt}
              slug={post?.slug}
              category={post.category?.name || ""}
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
          ) : null}
          {post.draft ? null : (
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
          )}
        </div>
      </Layout>
    </>
  );
};
export default ThunkedBySlug;

export const getStaticProps: GetStaticProps<ThunkedBySlugProps> = async (
  ctx
) => {
  const slug = Array.isArray(ctx.params.slug)
    ? ctx.params.slug[0]
    : ctx.params.slug;
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const result = await octokit.rest.search.issuesAndPullRequests({
    q: `"slug: ${slug}" in:body type:issue label:"✒ Thunked" author:jakobo repo:jakobo/codedrift`,
  });

  if (result.data.total_count === 0) {
    return {
      props: {
        error: 404,
      },
      revalidate: 300,
    };
  }

  const post = githubIssueToBlog(result.data.items?.[0]);

  const wm = new WebmentionClient();

  const webmentions = await wm.get({
    target: post.canonicalUrl,
    page: 0,
    perPage: 20,
  });

  return {
    props: {
      post,
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
