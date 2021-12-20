import {
  NewspaperIcon,
  TerminalIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import Logo from "src/components/Logo";
import React from "react";
import { Octokit } from "octokit";
import { GetStaticProps } from "next";
import {
  githubIssueToBlog,
  Post as PostItem,
} from "src/lib/github/issueToBlog";
import { DateTime } from "luxon";

type ThunkedBySlugImageProps = {
  post?: PostItem;
  error?: number;
};

const categoryIconFlourish = {
  DEFAULT: NewspaperIcon,
  code: TerminalIcon,
  general: NewspaperIcon,
  leadership: UserGroupIcon,
};

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

const ThunkedBySlugImage: React.FC<ThunkedBySlugImageProps> = ({ post }) => {
  const tagList = (post?.tags || []).map((t) => t.name);
  const catName = post?.category?.name;

  if (!post.id) return null;

  const Icon =
    categoryIconFlourish[`${catName}`.toLowerCase()] ||
    categoryIconFlourish.DEFAULT;

  const publishedAt = DateTime.fromISO(post.publishedAt).toLocaleString();
  const updatedAt = DateTime.fromISO(post.updatedAt).toLocaleString();
  const isUpd = post.publishedAt !== post.updatedAt;

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
};
export default ThunkedBySlugImage;

export const getStaticProps: GetStaticProps<ThunkedBySlugImageProps> = async (
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

  return {
    props: {
      post,
    },
    revalidate: 300,
  };
};

// we are abusing fallback here to avoid a huge query on ghost
// which would also impact build times. If we end up favoring build times
// we'll make a call to the post directory to get paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
