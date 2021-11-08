import Aibex from "../components/Timeline/events/2018/Aibex";
import ApplyWithLinkedIn from "../components/Timeline/events/2011/ApplyWithLinkedIn";
import ArtDecoFoundations from "../components/Timeline/events/2014/ArtDecoFoundations";
import ConnectSDK from "../components/Timeline/events/2010/ConnectSDK";
import FacetedSearch from "../components/Timeline/events/2009/FacetedSearch";
import GaiaRedesign from "../components/Timeline/events/2007/GaiaRedesign";
import GaiaTradingSystem from "../components/Timeline/events/2006/GaiaTradingSystem";
import HSDL from "../components/Timeline/events/2004/HSDL";
import Head from "next/head";
import KatyDavinci from "../components/Timeline/events/2012/KatyDavinci";
import Layout, { createTitle } from "src/components/Layout";
import LinkedInMobileWeb from "../components/Timeline/events/2011/LinkedInMobileWeb";
import ProjectThanks from "src/components/Timeline/events/2020/ProjectThanks";
import React from "react";
import ReactAtPinterest from "../components/Timeline/events/2016/React";
import ReactReady from "../components/Timeline/events/2017/ReactReady";
import Texture from "../components/Timeline/events/2017/Texture";
import Timeline, { useTimeline } from "src/components/Timeline";

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
    <div className="flex flex-col lg:flex-row pb-5">
      <label className="inline-flex flex-row items-center">
        <input
          type="checkbox"
          checked={all}
          onChange={() => toggleFilter("All")}
          className="mr-2 form-checkbox h-5 w-5 text-brand-500"
        />
        All ({facetCounts.all})
      </label>
      <label className="inline-flex flex-row items-center border-l border-l-solid border-gray-400 ml-2 pl-2">
        <input
          type="checkbox"
          checked={filters.Featured || false}
          onChange={() => toggleFilter("Featured")}
          className="mr-2 form-checkbox h-5 w-5 text-brand-500"
        />
        Featured ({facetCounts.Featured || 0})
      </label>
      {categories.map((c) => (
        <label
          key={c}
          className="inline-flex flex-row items-center border-l border-l-solid border-gray-400 ml-2 pl-2"
        >
          <input
            type="checkbox"
            checked={filters[c] || false}
            onChange={() => toggleFilter(c)}
            className="mr-2  form-checkbox h-5 w-5 text-brand-500"
          />
          {c} ({facetCounts[c]})
        </label>
      ))}
    </div>
  );
};

export default function About() {
  return (
    <>
      <Head>
        <title>{createTitle("Learn more about Jakob Heuser")}</title>
      </Head>
      <Layout>
        <div className="flex-col w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">About</h1>
          <div className="prose dark:prose-dark max-w-none pb-3">
            <p>
              Over the last 15 years, I&rsquo;ve had the joy of creating
              meaningful software in the world. I&rsquo;m never done learning.
            </p>
            <p>
              Code Drift is the place where I share my work, my experiences, and
              my thoughts on code, management, and the vastness of software with
              the world. Building is messy work. It&rsquo;s my hope that others
              can learn from these experiences just as I have from so many
              others.
            </p>

            <h2>How We Got Here. Right Here. (Right Now)</h2>
          </div>
          <Timeline initialFilters={{ Featured: true }}>
            <TimelineFilters />
            <ProjectThanks />
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
        </div>
      </Layout>
    </>
  );
}
