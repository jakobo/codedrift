import Head from "next/head";
import Layout from "src/components/Layout";
import { PostDirectory, groupPostsByYear } from "src/components/Post/Directory";
import React from "react";
import { Octokit } from "octokit";
import { githubIssueToBlog, Post } from "src/lib/github/issueToBlog";
import { GetStaticProps } from "next";

interface ThunkedProps {
  posts: Post[];
}

const Thunked: React.FC<ThunkedProps> = ({ posts }) => {
  const byYear = groupPostsByYear(posts || []);

  return (
    <>
      <Head>
        <title>Thunked. Essays by Jakob Heuser</title>
      </Head>
      <Layout>
        <div className="w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">Thunked</h1>
          <p>
            Thoughts thought through. Esasys on products, leadership,
            engineering, culture, and more.
          </p>
          <PostDirectory className="pt-5" postsByYear={byYear} />
        </div>
      </Layout>
    </>
  );
};
export default Thunked;

export const getStaticProps: GetStaticProps<ThunkedProps> = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const postResult = await octokit.rest.search.issuesAndPullRequests({
    q: `type:issue label:"✒ Thunked" author:jakobo repo:jakobo/codedrift`,
    sort: "created",
    order: "desc",
    per_page: 100,
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
    },
    revalidate: 300,
  };
};
