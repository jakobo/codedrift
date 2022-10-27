import { Layout } from "components/Layout";
import { PostDirectory, groupPostsByYear } from "components/Directory";
import React from "react";
import { discussionToBlog } from "lib/github/discussionToPost";
import { useRouter } from "next/router";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "gql";
import { demoji } from "lib/demoji";
import { GetStaticPaths, GetStaticProps } from "next";
import { SECTION_HEADLINE } from "data/constants";
import { NextSeo } from "next-seo";
import { selectedPostsWithSearch } from "gql/posts";
import { useQuery } from "urql";
import { selectLabelDetails } from "gql/labels";
import { Post } from "types/Post";

const labelToSearch = (label: string) =>
  `label:"${label}" category:"Thunked" repo:jakobo/codedrift`;

const ThunkedPostsByTag: React.FC<{ posts?: Post[] }> = ({ posts }) => {
  const router = useRouter();
  const tag = Array.isArray(router.query.name)
    ? router.query.name[0]
    : router.query.name;
  const [{ data: labelData }] = useQuery({
    query: selectLabelDetails,
    variables: {
      label: tag,
    },
    pause: !tag,
  });

  const byYear = groupPostsByYear(posts ?? []);
  const categoryDetails = labelData?.repository?.label || {
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
      <Layout>
        <h1 className={SECTION_HEADLINE}>{displayName}</h1>
        <p>{categoryDetails.description || ""}</p>
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
export const getStaticProps: GetStaticProps<{}> = async (ctx) => {
  const tag = Array.isArray(ctx.params.name)
    ? ctx.params.name[0]
    : ctx.params.name;

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
    search.status === "fulfilled" ? search.value.data.search.nodes ?? [] : []
  ).map((d) => discussionToBlog(d));

  return {
    props: {
      urqlState: cache.extractData(),
      posts,
    },
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
