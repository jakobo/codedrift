import Link from "next/link";
import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useQuery } from "urql";
import { demoji } from "lib/demoji";
import { initDefaultUrqlClient, withDefaultUrqlClient } from "gql";
import { discussionToBlog } from "lib/github/discussionToBlog";
import { Layout } from "components/Layout";
import { recentPosts } from "gql/posts";

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

const POSTS_TO_SHOW = 3;

const Home: React.FC<{}> = () => {
  const [{ data }] = useQuery({
    query: recentPosts,
    variables: {
      first: POSTS_TO_SHOW,
    },
  });
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
        <div className="w-full flex-shrink-0 flex-col lg:w-auto">
          <div className="max-w-reading mx-2 lg:mx-0">
            <h1 className="mb-3 font-title text-6xl">
              Hey 👋🏼, I&rsquo;m Jakob
            </h1>
            <p className="font-sans">
              I&lsquo;m a co-founder of{" "}
              <a href="https://taskless.io" className={linkClasses}>
                Taskless
              </a>
              , a robust job queueing system for serverless and edge computing.
            </p>
            <p className="mt-3 font-sans">
              The messy part of building things is my happy place. Ocassionally,
              I write about{" "}
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
              . I also give back to the industry that&apos;s given me so much,{" "}
              <Link href="/support">
                <a className={linkClasses}>helping others</a>
              </Link>{" "}
              on their journey.
            </p>
          </div>

          <div className="max-w-reading mx-2 mt-4 flex flex-col space-y-8 pt-6 lg:mx-0">
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
                <div className="prose prose-stone max-w-none dark:prose-invert">
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
  await client.query(recentPosts, { first: POSTS_TO_SHOW }).toPromise();

  return {
    props: {
      urqlState: cache.extractData(),
    },
    revalidate: 300,
  };
};
