import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import PostDirectory, { groupPostsByYear } from "src/components/Post/Directory";
import React from "react";
import { Octokit } from "octokit";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import { DateTime } from "luxon";
import strip from "strip-markdown";
import { remark } from "remark";
import { demoji } from "src/lib/demoji";

const engine = remark().use(strip);
const excerpt = (str: string, size = 3): string => {
  const { content } = matter(str);
  const result = engine.processSync(content);
  return (
    (result.toString().split(/[\r\n]/g)?.[0] || "")
      .split(".")
      .slice(0, size)
      .join(".")
      .trim() + "."
  );
};

type ThunkedOverviewPost = {
  id: string;
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
};

type ThunkedPostsByTagProps = {
  data?: {
    category: {
      name: string;
      description: string;
    };
    posts: ThunkedOverviewPost[];
  };
  error?: number;
};

const ThunkedPostsByTag: React.FC<ThunkedPostsByTagProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const byYear = groupPostsByYear(data.posts || []);

  return (
    <>
      <Head>
        <title>{createTitle(`Posts about ${data.category.name}`)}</title>
        <meta
          name="description"
          content={`Posts about ${data.category.name} on Code Drift`}
        />
      </Head>
      <Layout>
        <div className="w-screen max-w-reading">
          <h1 className="font-sans-lg font-bold text-3xl mb-3">
            {data.category.name}
          </h1>
          <p>{data?.category?.description || ""}</p>
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
    q: `type:issue label:"📚 ${cat}" author:jakobo repo:jakobo/codedrift`,
    sort: "updated",
    order: "desc",
  });

  const posts: ThunkedOverviewPost[] = postResult.data.items
    .filter(
      (post) => post.labels.map((label) => label.name).indexOf("draft") === -1
    )
    .map((post) => {
      const { data: fm } = matter(post.body);
      return {
        id: "" + post.id,
        title: fm.title,
        description: fm.description,
        excerpt: excerpt(post.body) || fm.description,
        slug: post.title,
        publishedAt: fm.date ? DateTime.fromJSDate(fm.date).toISO() : null,
        updatedAt: post.updated_at,
      };
    });

  return {
    props: {
      data: {
        category: {
          name: demoji(tagDetailsResult.data.name),
          description: tagDetailsResult.data.description,
        },
        posts,
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
