import React from "react";
import { useRouter } from "next/router.js";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useQuery } from "urql";
import { isPresent } from "ts-is-present";
import Head from "next/head.js";
import { Layout } from "@/components/Layout.js";
import { PostDirectory, groupPostsByYear } from "@/components/Directory.js";
import { discussionToBlog } from "@/lib/github/discussionToBlog.js";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "@/gql/index.js";
import { demoji } from "@/lib/demoji.js";
import { SECTION_HEADLINE } from "@/data/constants.js";
import { selectedPostsWithSearch } from "@/gql/posts.js";
import { selectLabelDetails } from "@/gql/labels.js";
import { type Post } from "@/types/Post.js";
import { REPO_FQN } from "@/lib/constants.js";
import { deleteUndefined } from "@/lib/deleteUndefined.js";

const labelToSearch = (label: string) =>
  `label:"${label}" category:"Thunked" repo:${REPO_FQN}`;

const ThunkedPostsByTag: React.FC<{ posts?: Post[] }> = ({ posts }) => {
  const router = useRouter();
  const tag = Array.isArray(router.query.name)
    ? router.query.name[0]
    : router.query.name;
  const [{ data: labelData }] = useQuery({
    query: selectLabelDetails,
    variables: {
      label: tag ?? "",
    },
    pause: !tag,
  });

  const byYear = groupPostsByYear(posts ?? []);
  const categoryDetails = labelData?.repository?.label ?? {
    name: "",
    description: "",
  };
  const displayName = demoji(categoryDetails.name);

  return (
    <>
      <NextSeo
        title={`Posts on ${displayName}`}
        description={`A collection of posts covering "${displayName}"`}
      />
      <Head>
        <title key="title">Posts on {displayName}</title>
      </Head>
      <Layout>
        <h1 className={SECTION_HEADLINE}>{displayName}</h1>
        <p>{categoryDetails.description ?? ""}</p>
        <PostDirectory postsByYear={byYear} className="pt-10" />
      </Layout>
    </>
  );
};

export default withDefaultUrqlClient({
  ssr: false,
  staleWhileRevalidate: true,
})(ThunkedPostsByTag);

// https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#using-getstaticprops-or-getserversideprops
// get data ahead of time for static rendering, but on withDefaultUrql
// enable SWR in case post was updated beind the scenes
export const getStaticProps: GetStaticProps<Record<string, unknown>> = async (
  ctx
) => {
  const tag =
    ctx.params && Array.isArray(ctx.params.name)
      ? ctx.params.name[0]
      : (ctx.params?.name as string);

  const { client, cache } = initDefaultUrqlClient(false);

  const [search] = await Promise.allSettled([
    client
      .query(selectedPostsWithSearch, {
        search: labelToSearch(tag),
        first: 100,
      })
      .toPromise(),
    client
      .query(selectLabelDetails, {
        label: tag,
      })
      .toPromise(),
  ]);

  const posts = (
    search.status === "fulfilled" ? search.value.data?.search.nodes ?? [] : []
  )
    .filter(isPresent)
    .map((d) => discussionToBlog(d));

  return {
    props: deleteUndefined({
      urqlState: cache.extractData(),
      posts,
    }),
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // to keep build times down, we don't pre-query for all matching issues
    // though if we wanted to, we definitely could
    paths: [],
    fallback: true,
  };
};
