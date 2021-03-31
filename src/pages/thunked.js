import { createClient } from "src/lib/urql";
import { gql } from "@urql/core";
import Layout from "src/components/Layout";
import Link from "next/link";
import React from "react";

const BLOG = gql`
  query {
    postDirectory(orderBy: "published_at DESC") {
      id
      title
      slug
      excerpt
      updatedAt
      publishedAt
      changelog {
        on
        change
      }
    }
  }
`;

export default function Thunked({ data }) {
  // blog posts
  const posts = data?.postDirectory || [];
  const byYear = posts.reduce((collection, post) => {
    const year = new Date(post.publishedAt).getFullYear();
    if (!collection[year]) {
      collection[year] = [];
    }
    collection[year].push(post);
    return collection;
  }, {});

  return (
    <Layout>
      <div className="w-full max-w-reading">
        <h1 className="font-sans-lg font-bold text-7xl mb-3">Thunked</h1>
        <p>
          Thoughts thought through. Esasys on products, leadership, engineering,
          culture, and more.
        </p>
        <div className="pt-5">
          {Object.getOwnPropertyNames(byYear)
            .sort()
            .reverse()
            .map((year) => (
              <div key={year}>
                <h2 className="w-full lg:-ml-36 lg:w-36 font-sans-lg font-bold text-lg text-left lg:text-right pr-5 text-gray-300">
                  {year}
                </h2>
                <ul className="-mt-6 flex flex-row flex-wrap">
                  {byYear[year].map((post) => (
                    <li
                      key={post.id}
                      className="mb-10 w-1/2 even:pl-4 odd:pr-4"
                    >
                      <h2>
                        <Link href={`/thunked/${post.slug}`} passHref>
                          <a
                            className={`
                            border-b
                            border-dotted 

                            font-sans
                            font-bold

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
                            {post.title}
                          </a>
                        </Link>
                      </h2>
                      <div className="max-w-none prose">
                        <p>{post.excerpt}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

// todo: return to getStaticProps with build time query
export async function getServerSideProps() {
  const client = createClient();
  const { data } = await client.query(BLOG).toPromise();

  return {
    props: {
      data,
    },
    // revalidate: 300,
  };
}
