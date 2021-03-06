import React from "react";
import Layout from "src/components/Layout";
import { Box, Flex, Text } from "theme-ui";
import { A, P } from "src/components/markup";
import { useResponsiveValue } from "@theme-ui/match-media";
import Timeline from "src/components/Timeline";

// The power spectral density (PSD) of the signal describes the
// power present in the signal as a function of frequency, per
// unit frequency. Power spectral density is commonly expressed
// in watts per hertz (W/Hz).
export default function Home() {
  const showAboutColumn = useResponsiveValue([false, null, true]);
  const posts = [];
  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: "column",
          flexShrink: 0,
          width: ["100%", null, "auto"],
        }}
      >
        <Timeline limit="5" />
      </Flex>
      {!showAboutColumn ? null : (
        <Flex sx={{ flexDirection: "column", flexGrow: 1, ml: 2, maxWidth: 4 }}>
          <Box>
            <Text as="aside" variant="aside">
              About
            </Text>
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
