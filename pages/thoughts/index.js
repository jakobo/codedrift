import { Heading, Link, Paragraph, Text } from "~/components/Typography";
import { formatDistance } from "date-fns";
import Box from "~/components/Box";
import Layout from "~/components/Layout";
import NextLink from "next/link";
import React from "react";
import ReadingEstimate, { rawEstimate } from "~/components/ReadingEstimate";
import posts from "~/data/blog";

/**
 * TODO list
 * - search bar?
 * - calendar view / search by date
 */

const WritingHome = () => {
  return (
    <Layout title="Thoughts, Musings, Blogging">
      <Heading as="h1">Some Thoughts</Heading>
      {posts.map(p => {
        console.log(p);
        return (
          <Box key={p.path}>
            <NextLink
              href="/thoughts/[slug]"
              as={`/thoughts/${p.slug}`}
              passHref
            >
              <Heading as={Link} size="md">
                {p.meta.title}
              </Heading>
            </NextLink>
            <Box>
              <Text size="sm">Estimated Read</Text>&nbsp;
              <ReadingEstimate size="sm" words={p.meta.wc} />
              &nbsp;
              <Text size="sm">{rawEstimate(p.meta.wc)} minutes</Text>
            </Box>
            <Paragraph>
              {p.meta.description}
              <Text color="darkGray">
                &nbsp;({formatDistance(new Date(p.meta.date), new Date())} ago)
              </Text>
            </Paragraph>
          </Box>
        );
      })}
    </Layout>
  );
};

export default WritingHome;
