import { A, H1, H2, LI, P, UL } from "src/components/markup";
import { Box } from "@theme-ui/components";
import { createClient } from "src/lib/urql";
import { gql } from "@urql/core";
import Layout from "src/components/Layout";
import React from "react";

const BLOG = gql`
  query {
    postDirectory(orderBy: "published_at DESC") {
      id
      title
      slug
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
      <Box sx={{ width: "100vw", maxWidth: "reading", px: [1, null, 0] }}>
        <H1>Thunked</H1>
        <P>
          Thoughts thought through. Esasys on products, leadership, engineering,
          culture, and more.
        </P>
        <Box>
          {Object.getOwnPropertyNames(byYear)
            .sort()
            .reverse()
            .map((year) => (
              <Box key={year}>
                <H2>{year}</H2>
                <UL>
                  {byYear[year].map((post) => (
                    <LI key={post.id}>
                      <A href={`/thunked/${post.slug}`}>{post.title}</A>
                    </LI>
                  ))}
                </UL>
              </Box>
            ))}
        </Box>
      </Box>
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
