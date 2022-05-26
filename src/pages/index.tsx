import { Layout } from "src/components/Layout";
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
import { demoji } from "src/lib/demoji";
import { NextSeo } from "next-seo";

const linkClasses = `
no-underline

text-primary-600
hover:text-primary-400

dark:text-primary-400
dark:hover:text-prinary-600
`;

const dullLinkClasses = `
no-underline

text-gray-500
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
      <NextSeo
        title="Jakob Heuser"
        description="Personal website of Jakob Heuser"
        openGraph={{
          title: "Jakob Heuser | Codedrift",
          description: "Personal website of Jakob Heuser",
        }}
      />
      <Layout>
        <div className="flex-col flex-shrink-0 w-full lg:w-auto">
          <div className="max-w-reading mx-2 lg:mx-0">
            <h1 className="font-title text-6xl mb-3">
              Hey 👋🏼, I&rsquo;m Jakob
            </h1>
            <p className="font-sans">
              I&lsquo;m the co-founder of{" "}
              <a href="https://taskless.io" className={linkClasses}>
                Taskless
              </a>
              , the world&lsquo;s fastest job queueing system for serverless and
              edge computing.
            </p>
            <p className="font-sans mt-3">
              The messy parts when we build things is my happy place.
              Ocassionally, I write about{" "}
              <Link href="/thunked/tag/%F0%9F%93%9A%20Code">
                <a className={linkClasses}>code</a>
              </Link>{" "}
              and the{" "}
              <Link href="/thunked/tag/%F0%9F%93%9A%20Leadership">
                <a className={linkClasses}>people</a>
              </Link>{" "}
              who build it. I work in public as much as I can, and you can
              always see what&apos;s on my mind in my{" "}
              <Link href="/notes">
                <a className={linkClasses}>working notes</a>
              </Link>
              .
            </p>
          </div>

          <div className="max-w-reading mt-4 mx-2 lg:mx-0 flex flex-col space-y-8 pt-6">
            {(posts || []).map((post) => (
              <div key={post.id}>
                <h3 className="font-sans text-2xl">
                  <Link href={`/thunked/${post.slug}`} passHref>
                    <a
                      href={`/thunked/${post.slug}`}
                      className={`text-brand-500 dark:text-brand-invert-500`}
                    >
                      {post.title}
                    </a>
                  </Link>
                </h3>
                <div className="font-sans text-sm">
                  <span
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
                      {demoji(post.category.name)}
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
                          {demoji(tag.name)}
                        </a>
                      </Link>
                    </span>
                  ))}
                </div>
                <div className="prose prose-stone dark:prose-invert max-w-none">
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
