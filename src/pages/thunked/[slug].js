import { Post } from "src/components/Post";
import { createStaticClient } from "src/graphql/local";
import { gql } from "@urql/core";
import { html2React } from "src/components/markup/rehype";
import Head from "next/head";
import Layout, { Title } from "src/components/Layout";
import React from "react";

const defaults = {
  metaDescription:
    "A post on Code Drift about technology, leadership, and life",
  title: "Code Drift",
};

const GET_POST = gql`
  query GetPostBySlug($slug: String!) {
    post(slug: $slug) {
      id
      title
      excerpt
      category {
        id
        name
      }
      tags {
        id
        name
      }
      html
      slug
      publishedAt
      updatedAt
      metaDescription
    }
  }
`;

const selectMetaAttribute = (n) => {
  if (n.indexOf("og:") === 0) {
    return "property";
  }

  return "name";
};

export default function ThunkedBySlug({ data }) {
  const post = data?.post || {};
  if (!post.id) return null;

  const tagList = [
    post?.category.name,
    ...(post?.tags || []).map((t) => t.name),
  ];
  const canonicalUrl = `https://codedrift.com/thunked/${post?.slug || ""}`;

  const meta = {
    description: post?.metaDescription || defaults.metaDescription,
    "og:type": "article",
    "og:title":
      post?.ogTitle || post?.twitterTittle || post?.title || defaults.title,
    "og:description":
      post?.ogDescription ||
      post?.twitterDescription ||
      post?.metaDescription ||
      post?.excerpt ||
      defaults.metaDescription,
    "og:url": canonicalUrl,
    "og:image": post?.ogImage || post?.twitterImage || null,
    "og:image:width": post?.ogImage || post?.twitterImage ? 1000 : null,
    "og:image:height": post?.ogImage || post?.twitterImage ? 500 : null,

    "article:published_time": post?.publishedAt || null,
    "article:modified_time": post?.updatedAt || null,
    "article:tag": tagList,

    "twitter:card":
      post?.ogImage || post?.twitterImage ? "summary_large_image" : "summary",
    "twitter:title":
      post?.twitterTitle || post?.ogTitle || post?.title || defaults.title,
    "twitter:description":
      post?.twitterDescription ||
      post?.ogDescription ||
      post?.metaDescription ||
      post?.excerpt ||
      defaults.metaDescription,
    "twitter:url": canonicalUrl,
    "twitter:image": post?.twitterImage || post?.ogImage || null,
    "twitter:label1": "Written by",
    "twitter:data1": "Jakob Heuser",
    "twitter:label2": "As part of",
    "twitter:data2": tagList.join(", "),
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
    headline: post?.title || defaults.title,
    url: canonicalUrl,
    datePublished: post?.publishedAt,
    dateModified: post?.updatedAt,
    keywords: tagList,
    description:
      post?.metaDescription || post?.excerpt || defaults.metaDescription,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://codedrift.com",
    },
  };

  return (
    <>
      <Head>
        <Title>{post?.title || defaults.title}</Title>
        <link rel="canonical" href={canonicalUrl} />
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
          <Post
            title={post?.title}
            date={post?.publishedAt}
            slug={post?.slug}
            description={post?.excerpt}
            category={post?.category?.name}
            tags={post?.tags}
            titleTag={(props) => (
              <h1
                {...props}
                className={`${
                  props.className || ""
                } font-sans font-bold text-4xl`}
              />
            )}
          >
            {html2React(post.html)}
          </Post>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps(ctx) {
  const client = createStaticClient();
  const { data } = await client.query(GET_POST, { slug: ctx.params.slug });

  return {
    props: {
      data,
    },
    revalidate: 300,
  };
}

// we are abusing fallback here to avoid a huge query on ghost
// which would also impact build times. If we end up favoring build times
// we'll make a call to the post directory to get paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
