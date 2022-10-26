import { Layout } from "components/Layout";
import React from "react";
import { PROSE, SECTION_HEADLINE } from "data/constants";
import Link from "next/link";
import cx from "classnames";
import { NextSeo } from "next-seo";

const Colophon: React.FC<{}> = () => {
  return (
    <>
      <NextSeo
        title="License and Colophon"
        description="About this site"
        openGraph={{
          title: "License and Colophon",
          description: "About this site",
        }}
      />
      <Layout>
        <h1 className={cx(SECTION_HEADLINE, "text-center")}>
          &lt;colophon/&gt;
        </h1>
        <div className={PROSE}>
          <p>Copyright (c) 2021 Rudolph Jakob Heuser and the contributors.</p>
          <p>
            Code for codedrift &amp; code in posts to codedrift are licensed
            under the{" "}
            <Link href="https://github.com/jakobo/codedrift/blob/main/LICENSE-posts">
              <a>MIT license</a>
            </Link>
            . Post content unless otherwise noted is licensed under the{" "}
            <a href="http://creativecommons.org/licenses/by-nc/4.0/">
              Creative Commons Attribution-NonCommercial 4.0 International
            </a>
            .
          </p>

          <hr />

          <p>
            This is the second revision of the codedrift project, and the 11th
            revision of Jakob&lsquo;s personal site. In the last iteration, I
            wanted to play with a chunky interface while simultaneously learning
            tailwind. In this revision, I sought to take elements of codedrift I
            felt mattered in the design aesthetic and strip as much as I could
            away.
          </p>
          <p>
            The guiding star for this design was a leather notebook where I take
            physical notes. As a lover of mechanical keyboards, digital
            notetaking would result in a horrible cacophony of clicks and
            clacks.
          </p>
          <p>Plus, I like pens.</p>
          <p>
            Most copy is set in{" "}
            <a href="https://fonts.google.com/specimen/Open+Sans">
              Open Sans Regular, SemiBold, and ExtraBold
            </a>{" "}
            with{" "}
            <a href="https://fonts.google.com/specimen/Roboto+Mono">
              Roboto Mono Light
            </a>{" "}
            for monospaced fonts. Titles are set in{" "}
            <a href="https://fonts.google.com/specimen/Work+Sans">
              Work Sans Light
            </a>
            . The <a href="https://tailwindcss.com/">Tailwind CSS</a> stone
            pallete drives the primary color scheme, with Emerald and Amber
            providing primary and secondary colors respectively.
          </p>
          <p>
            This site currently runs on Vercel + Next.js, with{" "}
            <a href="https://codedrift.com/thunked/use-github-as-a-cms">
              GitHub as a CMS
            </a>
            .
          </p>
          <p>We are only limited by the limits we place.</p>
        </div>
      </Layout>
    </>
  );
};

export default Colophon;
