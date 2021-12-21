import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import { PostDirectory, groupPostsByYear } from "src/components/Directory";
import React from "react";
import { Octokit } from "octokit";
import { GetStaticProps } from "next";
import { demoji } from "src/lib/demoji";
import { githubIssueToBlog, Post } from "src/lib/github/issueToBlog";

type ThunkedPostsByTagProps = {
  category?: {
    name: string;
    description: string;
  };
  posts?: Omit<Post, "body">[];
  error?: number;
};

const ThunkedPostsByTag: React.FC<ThunkedPostsByTagProps> = ({
  category,
  posts,
}) => {
  if (!posts || !posts.length) {
    return null;
  }

  const byYear = groupPostsByYear(posts || []);

  return (
    <>
      <Head>
        <title>{createTitle(`Posts about ${category.name}`)}</title>
        <meta
          name="description"
          content={`Posts about ${category.name} on Code Drift`}
        />
      </Head>
      <Layout>
        <div className="w-screen max-w-reading">
          <h1 className="font-sans-lg font-bold text-3xl mb-3">
            {category.name}
          </h1>
          <p>{category.description || ""}</p>
          <PostDirectory postsByYear={byYear} className="pt-10" />
        </div>
      </Layout>
    </>
  );
};
export default ThunkedPostsByTag;

export const getStaticProps: GetStaticProps<ThunkedPostsByTagProps> = async (
  ctx
) => {
  const cat = Array.isArray(ctx.params.name)
    ? ctx.params.name[0]
    : ctx.params.name;

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  const tagDetailsResult = await octokit.rest.issues.getLabel({
    repo: "codedrift",
    owner: "jakobo",
    name: `📚 ${cat}`,
  });

  const postResult = await octokit.rest.search.issuesAndPullRequests({
    q: `type:issue is:closed label:"📚 ${cat}" author:jakobo repo:jakobo/codedrift`,
    sort: "updated",
    order: "desc",
  });

  const posts = postResult.data.items
    .map((item) => githubIssueToBlog(item))
    .map((item) => {
      delete item["body"];
      return item;
    });

  return {
    props: {
      posts,
      category: {
        name: demoji(tagDetailsResult.data.name),
        description: tagDetailsResult.data.description,
      },
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
