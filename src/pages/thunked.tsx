import { Layout } from "src/components/Layout";
import { PostDirectory, groupPostsByYear } from "src/components/Directory";
import React from "react";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import {
  Discussion,
  SelectRecentlyCreatedPostsDocument,
  SelectRecentlyCreatedPostsQuery,
  SelectRecentlyCreatedPostsQueryVariables,
  useSelectRecentlyCreatedPostsQuery,
} from "__generated__/graphql";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "src/graphql";
import { GetStaticProps } from "next";
import { SECTION_HEADLINE } from "src/constants";
import { NextSeo } from "next-seo";

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
            Thoughts thought through. Esasys on products, leadership,
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
    .query<
      SelectRecentlyCreatedPostsQuery,
      SelectRecentlyCreatedPostsQueryVariables
    >(SelectRecentlyCreatedPostsDocument, {
      first: 100,
    })
    .toPromise();

  return {
    props: {
      urqlState: cache.extractData(),
    },
    revalidate: 300,
  };
};
