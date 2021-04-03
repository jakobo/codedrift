import { Post } from "src/components/Post";
import { createStaticClient } from "src/graphql/local";
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
  if (!post.id) return null;
  return (
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
  );
}

export async function getStaticProps(ctx) {
  const client = createStaticClient();
  const { data } = await client.query(GET_POST, { slug: ctx.params.slug });

  return {
    props: {
      data,
    },
    revalidate: 1,
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
