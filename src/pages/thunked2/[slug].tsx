import React, { FC, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Octokit } from "octokit";
import { Post } from "src/components/Post";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { micromark } from "micromark";
import Head from "next/head";
import Icon from "src/components/Icon";
import Layout, { createTitle } from "src/components/Layout";
import WebmentionItem from "src/components/Webmention";
import matter from "gray-matter";
import { usePrism } from "src/hooks/usePrism";
import { DateTime } from "luxon";
import { getWebmentions, Webmention } from "src/lib/webmentions/getWebmentions";
import { demoji } from "src/lib/demoji";
import Link from "next/link";

const selectMetaAttribute = (n) => {
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

type ThunkedTag = {
  name: string;
  description?: string;
  id: string | number;
};

type ThunkedBySlugProps = {
  data?: {
    id: string;
    title: string;
    description?: string;
    slug: string;
    draft: boolean;
    canonicalUrl: string;
    body: string;
    source: string;
    publishedAt: string;
    updatedAt: string;
    category?: ThunkedTag | null;
    tags: ThunkedTag[];
    webmentions: Webmention[];
  };
  error?: number;
};

const ThunkedBySlug: FC<ThunkedBySlugProps> = ({ error, data }) => {
  const [ack, setAck] = useState(!data?.draft);
  const content = useRef<HTMLDivElement>(null);
  usePrism(content);

  if (error) {
    return null;
  }

  if (!data || !data?.body) {
    return null;
  }

  const body = micromark(data.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });

  // add a TS to ensure caching works as expected
  const tsWindow = Math.floor(
    (data?.updatedAt ? new Date(data.updatedAt).getTime() : 0) / 86400
  );
  const mediaImage = `https://codedrift.com/api/v1/og/image/thunked/${
    data.slug || ""
  }?ts=${tsWindow}`;
  const tagList = data.tags.map((t) => t.name.replace(/,/g, "")).join(",");

  const meta = {
    description: data.description,
    "og:type": "article",
    "og:title": data.title,
    "og:description": data.description,
    "og:url": data.canonicalUrl,
    "og:image": mediaImage,
    "og:image:width": 1200,
    "og:image:height": 600,

    "article:published_time": data.publishedAt || null,
    "article:modified_time": data.updatedAt || null,
    "article:tag": tagList,

    "twitter:card": "summary_large_image",
    "twitter:title": data.title,
    "twitter:description": data.description,
    "twitter:url": data.canonicalUrl,
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
    headline: data.title,
    url: data.canonicalUrl,
    image: mediaImage,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    keywords: tagList,
    description: data.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://codedrift.com",
    },
  };

  const tweetSlug = `${data.title} on Code Drift`;
  const hasMentions = data.webmentions.length > 0;

  return (
    <>
      <Head>
        <title>{createTitle(data?.title)}</title>
        <link rel="canonical" href={data.canonicalUrl} />
        {Object.getOwnPropertyNames(meta).map((name) => {
          const value = Array.isArray(meta[name]) ? meta[name] : [meta[name]];
          return value.map((val, idx) => {
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
              title={data?.title}
              showButton={!ack}
              onClick={() => setAck(true)}
            />
          ) : null}
          {ack ? (
            <Post
              title={data?.title}
              date={data?.publishedAt}
              slug={data?.slug}
              category={data.category?.name || ""}
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
          {data.draft ? null : (
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
                    )}&url=${encodeURIComponent(data.canonicalUrl)}&via=jakobo`}
                    style={{ color: "#1DA1F2" }}
                  >
                    <Icon
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
                {data.webmentions.map((wm) => (
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
  const canonicalUrl = `https://codedrift.com/thunked/${slug || ""}`;
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  const result = await octokit.rest.search.issuesAndPullRequests({
    q: `${slug} in:title type:issue label:"✒ Thunked" author:jakobo repo:jakobo/codedrift`,
  });
  // console.log(result);

  if (result.data.total_count === 0) {
    return {
      props: {
        error: 404,
      },
      revalidate: 300,
    };
  }

  // get first 20 webmentions
  const webmentions = await getWebmentions(canonicalUrl, 0, 20);

  const post = result.data.items[0];
  const { content, data: frontmatter } = matter(post.body);

  const isDraft =
    post.labels.filter((label) => label.name.indexOf("draft") >= 0).length > 1;

  const category =
    post.labels
      .filter((label) => label.name.indexOf("📚") === 0)
      .map((label) => ({
        name: demoji(label.name),
        description: label.description || null,
        id: label.id,
      }))?.[0] || null;

  return {
    props: {
      data: {
        id: "" + post.id,
        slug,
        draft: isDraft,
        title: frontmatter?.title || "A post on Thunked",
        description: frontmatter?.description || null,
        body: content,
        source: post.html_url,
        canonicalUrl,
        updatedAt: post.updated_at || null,
        publishedAt: frontmatter.date
          ? DateTime.fromJSDate(frontmatter.date).toISO()
          : null,
        category,
        tags: post.labels
          .filter((label) => !category?.id || label.id !== category.id)
          .map((label) => ({
            // https://stackoverflow.com/a/69661174
            name: demoji(label.name),
            description: label.description || null,
            id: label.id,
          })),
        webmentions,
      },
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
