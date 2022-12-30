import React from "react";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useQuery } from "urql";
import { Layout } from "components/Layout";
import { PostDirectory, groupPostsByYear } from "components/Directory";
import { discussionToBlog } from "lib/github/discussionToPost";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "gql";
import { SECTION_HEADLINE } from "data/constants";
import { recentPosts } from "gql/posts";

const POST_SHOW_COUNT = 100;

const Thunked: React.FC<{}> = () => {
  const [{ data }] = useQuery({
    query: recentPosts,
    variables: {
      first: POST_SHOW_COUNT,
    },
  });
  const posts = (data?.repository?.discussions?.nodes || []).map((item) =>
    discussionToBlog(item)
  );
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

export const getStaticProps: GetStaticProps<{}> = async () => {
  const { client, cache } = initDefaultUrqlClient(false);
  await client
    .query(recentPosts, {
      first: POST_SHOW_COUNT,
    })
    .toPromise();

  return {
    props: {
      urqlState: cache.extractData(),
    },
    revalidate: 300,
  };
};
