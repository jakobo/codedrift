import { A, H1, H2, H3, H4, H5, H6, P } from "src/components/markup";
import { Box, Flex } from "theme-ui";
import { Brief } from "src/components/Post";
import { gql } from "@urql/core";
import { html2React } from "src/components/markup/rehype";
import { useQuery } from "urql";
import Layout from "src/components/Layout";
import React from "react";

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

export default function Home() {
  const [{ data }] = useQuery({
    query: HOMEPAGE,
  });

  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: "column",
          flexShrink: 0,
          width: ["100%", null, "auto"],
        }}
      >
        <Box
          sx={{
            maxWidth: "reading",
            ml: [1, null, 0],
            mr: [1, null, 0],
          }}
        >
          <H1 sx={{ py: "half" }}>Hey, I&rsquo;m Jakob</H1>
          <P>
            I build <A href="/thunk/tag/leadership">teams</A>,{" "}
            <A href="/thunk/tag/product">products</A>, and{" "}
            <A href="/thunk/tag/code">code</A>; writing about all three.
            Currently I&rsquo;m exploring the tools that help us all be better
            mentors at a startup I co-founded.
          </P>
        </Box>
        {(data?.posts?.edges || []).map((ed) => (
          <Brief
            key={ed.node.id}
            title={ed.node.title}
            description={ed.node.excerpt}
            category={ed.node.category?.name || ""}
            titleTag={H2}
            tags={ed.node.tags}
            sx={{ mb: 2 }}
          >
            {html2React(ed.node.html, {
              paragraphs: 1,
              headings: [H2, H3, H4, H5, H6, H6],
            })}
          </Brief>
        ))}
      </Flex>
    </Layout>
  );
}
