import { Flex } from "theme-ui";
import { H2, H3, H4, H5, H6 } from "src/components/markup";
import { Post } from "src/components/Post";
import { createClient } from "src/lib/urql";
import { gql } from "@urql/core";
import { html2React } from "src/components/markup/rehype";
import Layout from "src/components/Layout";
import React from "react";

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
    }
  }
`;

export default function ThunkedBySlug({ data }) {
  const post = data?.post || {};
  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: "column",
          flexShrink: 0,
          width: ["100%", null, "auto"],
        }}
      >
        <Post
          title={post?.title}
          slug={post?.slug}
          description={post?.excerpt}
          category={post?.category?.name}
          tags={post?.tags}
        >
          {html2React(post.html, {
            headings: [H2, H3, H4, H5, H6, H6],
          })}
        </Post>
      </Flex>
    </Layout>
  );
}

// todo: return to getstaticprops
export async function getServerSideProps(ctx) {
  const client = createClient();
  const { data } = await client
    .query(GET_POST, { slug: ctx.params.slug })
    .toPromise();

  return {
    props: {
      data,
    },
    // revalidate: 300,
  };
}

// TODO: call graphql locally
// we are abusing fallback here to avoid a huge query on ghost
// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: true,
//   };
// }
