import "yet-another-react-lightbox/styles.css";

import React, { useState } from "react";
import Link from "next/link";
import cx from "classnames";
import { NextSeo } from "next-seo";
import Image, { StaticImageData } from "next/image";
import { default as Lightbox } from "yet-another-react-lightbox";

import i20010502 from "../public/images/legacy/20010502.png";
import i20020206 from "../public/images/legacy/20020206.png";
import i20020320 from "../public/images/legacy/20020320.png";
import i20020604 from "../public/images/legacy/20020604.png";
import i20030210 from "../public/images/legacy/20030210.png";
import i20031022 from "../public/images/legacy/20031022.png";
import i20040831 from "../public/images/legacy/20040831.png";
import i20050329 from "../public/images/legacy/20050329.png";
import i20060411 from "../public/images/legacy/20060411.png";
import i20061012 from "../public/images/legacy/20061012.png";
import i20100102 from "../public/images/legacy/20100102.png";
import i20140814 from "../public/images/legacy/20140814.png";
import i20161026 from "../public/images/legacy/20161026.png";
import i20200224 from "../public/images/legacy/20200224.png";
import i20220525 from "../public/images/legacy/20220525.png";

import { PROSE, SECTION_HEADLINE } from "data/constants";
import { Layout } from "components/Layout";

const previousDesigns = [
  i20010502,
  i20020206,
  i20020320,
  i20020604,
  i20030210,
  i20031022,
  i20040831,
  i20050329,
  i20060411,
  i20061012,
  i20100102,
  i20140814,
  i20161026,
  i20200224,
  i20220525,
].reverse();

const Colophon: React.FC<{}> = () => {
  const [index, setIndex] = useState(-1);

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
            Code for codedrift &amp; code samples posted to codedrift are
            licensed under the{" "}
            <Link href="https://github.com/jakobo/codedrift/blob/main/LICENSE-posts">
              <a>MIT license</a>
            </Link>
            . Non-code content unless otherwise noted is licensed under the{" "}
            <a href="http://creativecommons.org/licenses/by-nc/4.0/">
              Creative Commons Attribution-NonCommercial 4.0 International
            </a>
            .
          </p>

          <hr />

          <p>
            This is the second revision of the codedrift project, and the 15th
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
        <h2 className="text-2xl pt-8 pb-4">Previous Versions</h2>
        <section>
          <div className="flex flex-row flex-wrap gap-6">
            {previousDesigns.map((m, i) => (
              <div
                key={m.src}
                className="relative w-[100px] h-[100px] border-2 border-gray-400"
              >
                <Image
                  src={m}
                  layout="fill"
                  placeholder="blur"
                  objectFit="cover"
                  width="100"
                  height="100"
                  alt=""
                  onClick={() => setIndex(i)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
          <Lightbox
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            slides={previousDesigns}
            render={{
              slide: (image, offset, rect) => {
                return (
                  <div
                    style={{
                      position: "relative",
                      width: image.width,
                      height: image.height,
                      maxWidth: "80vw",
                    }}
                  >
                    <Image
                      src={image as StaticImageData}
                      layout="fill"
                      loading="eager"
                      placeholder="blur"
                      objectFit="contain"
                      alt={"alt" in image ? image.alt : ""}
                      sizes={
                        typeof window !== "undefined"
                          ? `${Math.ceil(
                              (image.width / window.innerWidth) * 100
                            )}vw`
                          : `${image.width}px`
                      }
                    />
                  </div>
                );
              },
            }}
          />
        </section>
      </Layout>
    </>
  );
};

export default Colophon;
