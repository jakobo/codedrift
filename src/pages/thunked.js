import { createStaticClient } from "src/graphql/local";
import { gql } from "@urql/core";
import Layout from "src/components/Layout";
import PostDirectory, { groupPostsByYear } from "src/components/Post/Directory";
import React from "react";

const BLOG = gql`
  query {
    postDirectory(orderBy: "published_at DESC") {
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

export default function Thunked({ data }) {
  const byYear = groupPostsByYear(data?.postDirectory || []);

  return (
    <Layout>
      <div className="w-full max-w-reading">
        <h1 className="font-sans-lg font-bold text-7xl mb-3">Thunked</h1>
        <p>
          Thoughts thought through. Esasys on products, leadership, engineering,
          culture, and more.
        </p>
        <PostDirectory className="pt-5" postsByYear={byYear} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = createStaticClient();
  const { data } = await client.query(BLOG);

  return {
    props: {
      data,
    },
    revalidate: 300,
  };
}
