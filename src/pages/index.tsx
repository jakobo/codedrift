import Head from "next/head";
import Layout from "src/components/Layout";
import Link from "next/link";
import React, { useMemo } from "react";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import { DateTime } from "luxon";
import {
  SelectRecentlyCreatedPostsDocument,
  SelectRecentlyCreatedPostsQuery,
  SelectRecentlyCreatedPostsQueryVariables,
  useSelectRecentlyCreatedPostsQuery,
} from "__generated__/graphql";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "src/graphql";
import { GetStaticProps } from "next";

const linkClasses = `
no-underline

text-brand-500
hover:text-brand-700

dark:text-brand-invert-500
dark:hover:text-brand-invert-700
`;

const dullLinkClasses = `
no-underline

text-gray-300
dark:text-gray-500
`;

const Home: React.FC<{}> = () => {
  const [{ data }] = useSelectRecentlyCreatedPostsQuery();
  const posts = useMemo(
    () =>
      (data?.repository?.discussions?.nodes || []).map((post) => {
        return discussionToBlog(post);
      }),
    [data?.repository?.discussions?.nodes]
  );

  return (
    <>
      <Head>
        <title>CodeDrift - Jakob Heuser</title>
      </Head>
      <Layout>
        <div className="flex-col flex-shrink-0 w-full lg:w-auto">
          <div className="max-w-reading mx-2 lg:mx-0">
            <h1 className="font-sans-lg font-bold text-7xl mb-3">
              Hey 👋🏼, I&rsquo;m Jakob
            </h1>
            <p className="font-sans font-light leading-normal">
              I&lsquo;m into the messy part of building things. Sometimes, when
              there is clarity in the mess, it ends up{" "}
              <Link href="/thunked" passHref>
                <a href="/thunked" className={linkClasses}>
                  formalized here in <em>Thunked</em>
                </a>
              </Link>
              . Many other ideas floating in my head, very unpolished, are
              available in my{" "}
              <a
                href="https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5/Home_suijF#_lu2BJ"
                className={linkClasses}
              >
                public notes
              </a>
              .
            </p>
          </div>

          <div className="max-w-reading mt-4 mx-2 lg:mx-0 flex flex-col space-y-8 pt-6">
            {(posts || []).map((post) => (
              <div key={post.id}>
                <h3 className="font-sans font-bold text-2xl">
                  <Link href={`/thunked/${post.slug}`} passHref>
                    <a
                      href={`/thunked/${post.slug}`}
                      className={`text-brand-500 dark:text-brand-invert-500`}
                    >
                      {post.title}
                    </a>
                  </Link>
                </h3>
                <div className="font-sans-caps text-sm">
                  <span
                    className="text-xs"
                    title={DateTime.fromISO(post.publishedAt).toLocaleString()}
                  >
                    {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
                  </span>
                  &nbsp;in&nbsp;
                  <Link href={`/thunked/tag/${post.category.name}`} passHref>
                    <a
                      href={`/thunked/tag/${post.category.name}`}
                      className={linkClasses}
                    >
                      {post.category.name}
                    </a>
                  </Link>
                  {post.tags.length > 0 ? <>&nbsp;+&nbsp;</> : null}
                  {post.tags.map((tag, idx) => (
                    <span key={tag.id} className={dullLinkClasses}>
                      {idx !== 0 ? ", " : null}
                      <Link href={`/thunked/tag/${tag.name}`} passHref>
                        <a
                          href={`/thunked/tag/${tag.name}`}
                          className={dullLinkClasses}
                        >
                          {tag.name}
                        </a>
                      </Link>
                    </span>
                  ))}
                </div>
                <div className="prose dark:prose-dark max-w-none">
                  {post.excerpt || post.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};
export default withDefaultUrqlClient({
  ssr: false,
  staleWhileRevalidate: true,
})(Home);

export const getStaticProps: GetStaticProps<{}> = async () => {
  const { client, cache } = initDefaultUrqlClient(false);
  await client
    .query<
      SelectRecentlyCreatedPostsQuery,
      SelectRecentlyCreatedPostsQueryVariables
    >(SelectRecentlyCreatedPostsDocument)
    .toPromise();

  return {
    props: {
      urqlState: cache.extractData(),
    },
    revalidate: 300,
  };
};
