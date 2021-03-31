import { createClient } from "src/lib/urql";
import { gql } from "@urql/core";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";
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

  return (
    <Layout>
      <div className="w-full max-w-reading">
        <h1 className="font-sans-lg font-bold text-3xl mb-3">
          Tag: {prettyTagCase(route.query.name)}
        </h1>
        <p>{data?.tag?.description || ""}</p>
        <PostDirectory postsByYear={byYear} className="pt-10" />
      </div>
    </Layout>
  );
}

// todo: take this to getstaticprops
export async function getServerSideProps(ctx) {
  const client = createClient();
  const { data } = await client
    .query(GET_TAG_PAGE, {
      tag: ctx.params.name,
      filterTag: `tag:${ctx.params.name}`,
    })
    .toPromise();

  return {
    props: {
      data,
    },
    // revalidate: 300,
  };
}
