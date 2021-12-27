import Head from "next/head";
import Layout from "src/components/Layout";
import { PostDirectory, groupPostsByYear } from "src/components/Directory";
import React from "react";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import {
  Discussion,
  useSelectRecentlyCreatedPostsQuery,
} from "__generated__/graphql";
import { withDefaultUrqlClient } from "src/graphql";

const Thunked: React.FC<{}> = () => {
  const [{ data }] = useSelectRecentlyCreatedPostsQuery({
    variables: {
      first: 100,
    },
  });
  const posts = (data?.repository?.discussions?.nodes || []).map(
    (item: Discussion) => discussionToBlog(item)
  );
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
export default withDefaultUrqlClient()(Thunked);
