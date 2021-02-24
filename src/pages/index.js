import React from "react";
import Layout from "src/components/layout";
import { getPosts } from "src/lib/posts";
import { Box, Flex, Text } from "theme-ui";
import { A, P } from "src/components/markup";
import { Post } from "src/components/post";
import { useResponsiveValue } from "@theme-ui/match-media";

// The power spectral density (PSD) of the signal describes the
// power present in the signal as a function of frequency, per
// unit frequency. Power spectral density is commonly expressed
// in watts per hertz (W/Hz).
export default function Home({ posts }) {
  const showAboutColumn = useResponsiveValue([false, null, true]);
  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: "column",
          flexShrink: 0,
          width: ["100%", null, "auto"],
        }}
      >
        {posts.map((p, i) => (
          <Post key={p.id} post={p} sx={{ pt: i === 0 ? 0 : 3 }} />
        ))}
      </Flex>
      {!showAboutColumn ? null : (
        <Flex sx={{ flexDirection: "column", flexGrow: 1, ml: 2, maxWidth: 4 }}>
          <Box>
            <Text variant="tag">About</Text>
            <P sx={{ fontSize: 0, lineHeight: 0 }}>
              I&rsquo;m Jakob. I build teams, products, and UI; I also{" "}
              <A href="/investing">angel-invest</A> in these passion areas.
              Currently, I&rsquo;m building{" "}
              <A href="https://aibex.com">Aibex</A> with an amazing co-founder.
            </P>
          </Box>
        </Flex>
      )}
    </Layout>
  );
}

export async function getStaticProps(context) {
  const posts = await getPosts({ orderBy: [["date", "desc"]], first: 3 });
  return {
    props: {
      posts,
    },
  };
}
