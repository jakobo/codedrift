import {
  NewspaperIcon,
  TerminalIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { createStaticClient } from "src/graphql/local";
import { format } from "date-fns";
import { gql } from "@urql/core";
import Logo from "src/components/Logo";
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
      publishedAt
      updatedAt
      metaDescription
    }
  }
`;

const categoryIconFlourish = {
  DEFAULT: NewspaperIcon,
  code: TerminalIcon,
  general: NewspaperIcon,
  leadership: UserGroupIcon,
};

const widont = (text) => text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

export default function ThunkedBySlug({ data }) {
  const post = data?.post || {};
  const tagList = (post?.tags || []).map((t) => t.name);
  const catName = post?.category?.name;

  if (!post.id) return null;

  const Icon =
    categoryIconFlourish[`${catName}`.toLowerCase()] ||
    categoryIconFlourish.DEFAULT;

  const publishedAt = format(new Date(post.publishedAt), "MMMM io, yyyy");

  const updatedAt = format(new Date(post.publishedAt), "MMMM io, yyyy");

  const isUpd = post.publishedAt === post.updatedAt;

  return (
    <div
      className="absolute overflow-hidden bg-white"
      style={{
        width: "1200px",
        height: "600px",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <div className="relative w-full h-full prose-2xl">
        <Icon className="absolute left-1/4 top-1/4 w-full h-full text-gray-100" />
        <div className="absolute left-8 top-8">
          <h3 className="italic">Thunked: Short essays on code and humans</h3>
          <h1 className="font-bold text-4xl">{widont(post.title)}</h1>
        </div>
        <div className="absolute bottom-0 p-8 w-full flex flex-row items-center">
          <Icon className="w-10 h-10 text-gray-300 self-start mt-2 mr-2" />
          <div className="flex-grow">
            <div className="text-md text-gray-500">
              <span className="text-brand-500">{catName}</span>
              {tagList.length === 0 ? null : (
                <>
                  <span>&nbsp;+&nbsp;</span>
                  {tagList.map((t, idx) => (
                    <span key={t}>{idx === 0 ? t : `, ${t}`}</span>
                  ))}
                </>
              )}
            </div>
            <div className="text-gray-500">
              {!isUpd ? (
                <span>published {publishedAt}</span>
              ) : (
                <span>
                  <span className="text-brand-500">updated</span> {updatedAt}
                </span>
              )}
            </div>
          </div>
          <Logo
            left="text-gray-800"
            right="text-brand-500"
            text={["text-gray-800", "text-brand-500"]}
            style={{
              width: "360px",
            }}
          />
        </div>
      </div>
    </div>
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
