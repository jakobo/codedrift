import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import { PostDirectory, groupPostsByYear } from "src/components/Directory";
import React from "react";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import { useRouter } from "next/router";
import {
  Discussion,
  SelectPostsWithSearchDocument,
  SelectPostsWithSearchQuery,
  SelectPostsWithSearchQueryVariables,
  useSelectLabelDetailsQuery,
  useSelectPostsWithSearchQuery,
} from "__generated__/graphql";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "src/graphql";
import { demoji } from "src/lib/demoji";
import { GetStaticPaths, GetStaticProps } from "next";

const labelToSearch = (label: string) =>
  `label:"${label}" category:"Thunked" repo:jakobo/codedrift`;

const ThunkedPostsByTag: React.FC<{}> = () => {
  const router = useRouter();
  const tag = Array.isArray(router.query.name)
    ? router.query.name[0]
    : router.query.name;
  const [{ data }] = useSelectPostsWithSearchQuery({
    variables: {
      search: labelToSearch(tag),
      first: 100,
    },
    pause: !tag,
  });
  const [{ data: labelData }] = useSelectLabelDetailsQuery({
    variables: {
      label: tag,
    },
    pause: !tag,
  });
  const posts = (data?.search?.nodes || []).map((discussion: Discussion) =>
    discussionToBlog(discussion)
  );
  const byYear = groupPostsByYear(posts);
  const categoryDetails = labelData?.repository?.label || {
    name: "",
    description: "",
  };
  const displayName = demoji(categoryDetails.name);

  return (
    <>
      <Head>
        <title>{createTitle(`Posts about ${displayName}`)}</title>
        <meta
          name="description"
          content={`Posts about ${displayName} on CodeDrift`}
        />
      </Head>
      <Layout>
        <div className="w-screen max-w-reading">
          <h1 className="font-sans-lg font-bold text-3xl mb-3">
            {displayName}
          </h1>
          <p>{categoryDetails.description || ""}</p>
          <PostDirectory postsByYear={byYear} className="pt-10" />
        </div>
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
  await client
    .query<SelectPostsWithSearchQuery, SelectPostsWithSearchQueryVariables>(
      SelectPostsWithSearchDocument,
      {
        search: labelToSearch(tag),
        first: 100,
      }
    )
    .toPromise();

  return {
    props: {
      urqlState: cache.extractData(),
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
