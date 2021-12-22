import Head from "next/head";
import Layout from "src/components/Layout";
import Link from "next/link";
import React from "react";
import { GetStaticProps } from "next";
import { Octokit } from "octokit";
import { githubIssueToBlog, Post } from "src/lib/github/issueToBlog";
import { DateTime } from "luxon";

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

type HomeProps = {
  posts: Post[];
  error?: number;
};

const Home: React.FC<HomeProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Code Drift - Jakob Heuser</title>
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
                <h3 className="font-sans font-bold text-2xl">{post.title}</h3>
                <div className="font-sans-caps text-sm">
                  <span
                    className="text-xs"
                    title={DateTime.fromISO(post.publishedAt).toLocaleString()}
                  >
                    {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
                  </span>
                  &nbsp;in&nbsp;
                  <Link
                    href={`/thunked/category/${post.category.name.toLowerCase()}`}
                    passHref
                  >
                    <a
                      href={`/thunked/category/${post.category.name.toLowerCase()}`}
                      className={linkClasses}
                    >
                      {post.category.name}
                    </a>
                  </Link>
                  {post.tags.length > 0 ? <>&nbsp;+&nbsp;</> : null}
                  {post.tags.map((tag, idx) => (
                    <span key={tag.id} className={dullLinkClasses}>
                      {idx !== 0 ? ", " : null}
                      <Link
                        href={`/thunked/category/${tag.name.toLowerCase()}`}
                        passHref
                      >
                        <a
                          href={`/thunked/category/${tag.name.toLowerCase()}`}
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
                <div className="mt-3">
                  📖{" "}
                  <Link href={`/thunked/${post.slug}`} passHref>
                    <a
                      href={`/thunked/${post.slug}`}
                      className={`
                    border-b
                    border-dotted 

                    text-brand-500
                    hover:text-brand-700
                    border-brand-500
                    hover:border-brand-700

                    dark:text-brand-invert-500
                    dark:hover:text-brand-invert-700
                    dark:border-brand-invert-500
                    dark:hover:border-invert-brand-700
                  `}
                    >
                      Read in <span className="italic">Thunked</span>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const postResult = await octokit.rest.search.issuesAndPullRequests({
    q: `type:issue is:closed label:"✒ Thunked" author:jakobo repo:jakobo/codedrift`,
    sort: "created",
    order: "desc",
    per_page: 3,
  });

  const posts = postResult.data.items.map((item) => githubIssueToBlog(item));

  return {
    props: {
      posts,
    },
    revalidate: 300,
  };
};
