import React from "react";
import { type GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useQuery } from "urql";
import { isPresent } from "ts-is-present";
import { Layout } from "@/components/Layout.js";
import { PostDirectory, groupPostsByYear } from "@/components/Directory.js";
import { discussionToBlog } from "@/lib/github/discussionToBlog.js";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "@/gql/index.js";
import { SECTION_HEADLINE } from "@/data/constants.js";
import { recentPosts } from "@/gql/posts.js";
import { deleteUndefined } from "@/lib/deleteUndefined.js";

const POST_SHOW_COUNT = 100;

const Thunked: React.FC = () => {
  const [{ data }] = useQuery({
    query: recentPosts,
    variables: {
      first: POST_SHOW_COUNT,
    },
  });
  const posts = (data?.repository?.discussions?.nodes ?? [])
    .filter(isPresent)
    .map((item) => discussionToBlog(item));
  const byYear = groupPostsByYear(posts || []);

  return (
    <>
      <NextSeo
        title="Thunked. Essays on Everything"
        description="A collection of essays on a variety of topics"
        openGraph={{
          title: "Thunked. Essays on Everything",
          description: "A collection of essays on a variety of topics",
        }}
      />
      <Layout>
        <div className="w-full">
          <h1 className={SECTION_HEADLINE}>Thunked</h1>
          <p>
            Thoughts thought through. Essays on products, leadership,
            engineering, culture, and more.
          </p>
          <PostDirectory className="pt-5" postsByYear={byYear} />
        </div>
      </Layout>
    </>
  );
};

export default withDefaultUrqlClient({
  ssr: false,
  staleWhileRevalidate: true,
})(Thunked);

export const getStaticProps: GetStaticProps<
  Record<string, unknown>
> = async () => {
  const { client, cache } = initDefaultUrqlClient(false);
  await client
    .query(recentPosts, {
      first: POST_SHOW_COUNT,
    })
    .toPromise();

  return {
    props: deleteUndefined({
      urqlState: cache.extractData(),
    }),
    revalidate: 300,
  };
};
