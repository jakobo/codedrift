import { Box, Checkbox, Flex, Text } from "@theme-ui/components";
import { H1, H2, P } from "src/components/markup";
import Aibex from "./events/2018/Aibex";
import ApplyWithLinkedIn from "./events/2011/ApplyWithLinkedIn";
import ArtDecoFoundations from "./events/2014/ArtDecoFoundations";
import ConnectSDK from "./events/2010/ConnectSDK";
import FacetedSearch from "./events/2009/FacetedSearch";
import GaiaRedesign from "./events/2007/GaiaRedesign";
import GaiaTradingSystem from "./events/2006/GaiaTradingSystem";
import HSDL from "./events/2004/HSDL";
import KatyDavinci from "./events/2012/KatyDavinci";
import Layout from "src/components/Layout";
import LinkedInMobileWeb from "./events/2011/LinkedInMobileWeb";
import React from "react";
import ReactAtPinterest from "./events/2016/React";
import ReactReady from "./events/2017/ReactReady";
import Texture from "./events/2017/Texture";
import Timeline, { useTimeline } from "src/components/Timeline";

const catSx = {
  ml: "half",
  pl: "half",
  borderLeftWidth: "1px",
  borderStyle: "solid",
  borderColor: "gray.300",
};
export const TimelineFilters = () => {
  const ctx = useTimeline();
  const { filters, toggleFilter, facetCounts } = ctx;
  const all = !Object.getOwnPropertyNames(filters).reduce((prev, cat) => {
    const enabled = filters[cat];
    return prev || enabled;
  }, false);
  const categories = Object.getOwnPropertyNames(facetCounts).filter(
    (f) => f !== "all" && f !== "Featured"
  );

  return (
    <Flex sx={{ flexDirection: ["column", null, "row"] }}>
      <Flex as="label" sx={{ flexDirection: "row" }}>
        <Checkbox
          id="All"
          checked={all}
          onChange={() => toggleFilter("All")}
          sx={{ mr: "quarter" }}
        />
        <Text variant="typography.IdealSans.small">
          All ({facetCounts.all})
        </Text>
      </Flex>
      <Flex as="label" sx={{ ...catSx, flexDirection: "row" }}>
        <Checkbox
          id="Featured"
          defaultChecked={true}
          checked={filters.Featured || false}
          onChange={() => toggleFilter("Featured")}
          sx={{ mr: "quarter" }}
        />
        <Text variant="typography.IdealSans.small">
          Featured ({facetCounts.Featured || 0})
        </Text>
      </Flex>
      {categories.map((c) => (
        <Flex key={c} as="label" sx={{ ...catSx, flexDirection: "row" }}>
          <Checkbox
            id={c}
            checked={filters[c] || false}
            onChange={() => toggleFilter(c)}
            sx={{ mr: "quarter" }}
          />
          <Text variant="typography.IdealSans.small">
            {c} ({facetCounts[c]})
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default function About() {
  return (
    <Layout>
      <Box sx={{ width: "100vw", maxWidth: "reading", px: [1, null, 0] }}>
        <H1>About Jakob</H1>
        <P>
          Over the last 15 years, I&rsquo;ve had the joy of creating meaningful
          software in the world. I&rsquo;m never done learning.
        </P>
        <P>
          Code Drift is the place where I share my work, my experiences, and my
          thoughts on code, management, and the vastness of software with the
          world. Building engineering teams is messy work; so are software
          projects. It&rsquo;s my hope that others can learn from these
          experiences as I have from others.
        </P>

        <H2>How We Got Here</H2>
        <P>Always a work in progress...</P>

        <Timeline initialFilters={{ Featured: true }}>
          <TimelineFilters />
          <Aibex />
          <ReactReady />
          <Texture />
          <ReactAtPinterest />
          <ArtDecoFoundations />
          <KatyDavinci />
          <LinkedInMobileWeb />
          <ApplyWithLinkedIn />
          <ConnectSDK />
          <FacetedSearch />
          <GaiaRedesign />
          <GaiaTradingSystem />
          <HSDL />
        </Timeline>
      </Box>
    </Layout>
  );
}
