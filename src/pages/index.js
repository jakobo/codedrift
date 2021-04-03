import { createStaticClient } from "src/graphql/local";
import { gql } from "@urql/core";
import { html2React } from "src/components/markup/rehype";
import Layout from "src/components/Layout";
import Link from "next/link";
import React from "react";
import format from "date-fns/format";

const HOMEPAGE = gql`
  query Homepage {
    posts(first: 3) {
      edges {
        node {
          id
          title
          excerpt
          category {
            id
            name
          }
          tags {
            id
            name
          }
          html
          slug
          publishedAt
        }
      }
    }
  }
`;

const excerpt = (text) => {
  const children = html2React(text);
  const frag = React.Children.toArray(children)[0];
  const first = frag?.props?.children
    ? React.Children.toArray(frag.props.children)?.[0] || null
    : null;
  return first;
};

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

export default function Home({ data }) {
  return (
    <Layout>
      <div className="flex-col flex-shrink-0 w-full lg:w-auto">
        <div className="max-w-reading mx-2 lg:mx-0">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">
            Hey, I&rsquo;m Jakob
          </h1>
          <p className="font-sans font-light leading-normal">
            I build <Link href="/thunk/tag/leadership">teams</Link>,{" "}
            <Link href="/thunk/tag/product">products</Link>, and{" "}
            <Link href="/thunk/tag/code">code</Link>; writing about all three.
            Currently I&rsquo;m exploring how we collaborate towards common
            goals.
          </p>
        </div>
        <div className="max-w-reading mt-4 mx-2 lg:mx-0 flex flex-col space-y-8">
          {(data?.posts?.edges || []).map((ed) => (
            <div key={ed.node.id}>
              <h2 className="font-sans font-bold text-3xl">{ed.node.title}</h2>
              <div className="font-sans-caps text-sm">
                <span className="text-xs">
                  {format(new Date(ed.node.publishedAt), "P")}
                </span>
                &nbsp;in&nbsp;
                <Link
                  href={`/thunked/tag/${ed.node.category.name.toLowerCase()}`}
                  passHref
                >
                  <a className={linkClasses}>{ed.node.category.name}</a>
                </Link>
                {ed.node.tags.length > 0 ? <>&nbsp;+&nbsp;</> : null}
                {ed.node.tags.map((tag, idx) => (
                  <span key={tag.id} className={dullLinkClasses}>
                    {idx !== 0 ? ", " : null}
                    <Link
                      href={`/thunked/tag/${tag.name.toLowerCase()}`}
                      passHref
                    >
                      <a className={dullLinkClasses}>{tag.name}</a>
                    </Link>
                  </span>
                ))}
              </div>
              <div className="prose dark:prose-dark max-w-none">
                {excerpt(ed.node.html)}
              </div>
              <div className="mt-3">
                📖{" "}
                <Link href={`/thunked/${ed.node.slug}`} passHref>
                  <a
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
  );
}

export async function getStaticProps() {
  const client = createStaticClient();
  const { data } = await client.query(HOMEPAGE);

  return {
    props: {
      data,
    },
    revalidate: 300,
  };
}
