import { createStaticClient } from "src/graphql/local";
import { gql } from "@urql/core";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import PostDirectory, { groupPostsByYear } from "src/components/Post/Directory";
import React from "react";

const GET_TAG_PAGE = gql`
  query TagPage($tag: String!, $filterTag: String!) {
    tag(name: $tag) {
      id
      description
    }
    postDirectory(orderBy: "published_at DESC", filter: $filterTag) {
      id
      title
      slug
      excerpt
      updatedAt
      publishedAt
      changelog {
        on
        change
      }
    }
  }
`;

const prettyTagCase = (tag) =>
  `${tag}`
    .split(" ")
    .map((t) => `${t.charAt(0).toUpperCase()}${t.slice(1)}`)
    .join(" ");

export default function ThunkedByTagName({ data }) {
  const route = useRouter();
  const byYear = groupPostsByYear(data?.postDirectory || []);
  const tagName = `${route?.query?.name}`;
  const niceTagName = prettyTagCase(tagName);

  return (
    <>
      <Head>
        <title>{createTitle(`Posts about ${niceTagName}`)}</title>
        <meta
          name="description"
          content={`Posts about ${prettyTagCase(tagName)} on Code Drift`}
        />
      </Head>
      <Layout>
        <div className="w-screen max-w-reading">
          <h1 className="font-sans-lg font-bold text-3xl mb-3">
            Tag: {prettyTagCase(tagName)}
          </h1>
          <p>{data?.tag?.description || ""}</p>
          <PostDirectory postsByYear={byYear} className="pt-10" />
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps(ctx) {
  const client = createStaticClient();
  const { data } = await client.query(GET_TAG_PAGE, {
    tag: ctx.params.name,
    filterTag: `tag:${ctx.params.name}`,
  });

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
