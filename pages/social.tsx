import React from "react";
import { NextSeo } from "next-seo";
import Link from "next/link.js";
import { Layout } from "@/components/Layout.js";
import { PROSE, SECTION_HEADLINE } from "@/data/constants.js";

const Colophon: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Jakob Heuser elsewhere on the web"
        description="Links to other socials, in case one website wasn't enough"
        openGraph={{
          title: "Jakob Heuser elsewhere on the web",
          description:
            "Links to other socials, in case one website wasn't enough",
        }}
      />
      <Layout>
        <h1 className={SECTION_HEADLINE}>Elsewhere on the Web</h1>
        <div className={PROSE}>
          <p>
            I'm on a few other websites, in case one website wasn't enough. I
            keep this updated when I remember, which isn't often enough. There's
            a lot of internet out there; looking forward to meeting you
            digitally.
            <br />
            <span className="text-xl">🫰🏻❤️</span>
          </p>
          <ul>
            <li>
              <p>
                Posting on Threads & the fediverse as{" "}
                <Link rel="me" href="https://www.threads.net/@codedrift.social">
                  @codedrift.social@threads.net
                </Link>
              </p>
            </li>
            <li>
              <p>
                Sharing photos on Instagram as{" "}
                <Link
                  rel="me"
                  href="https://www.instagram.com/codedrift.social"
                >
                  codedrift.social
                </Link>
              </p>
            </li>
            <li>
              <p>
                Shitposting on Bluesky with{" "}
                <Link href="https://bsky.app/profile/codedrift.com">
                  @codedrift.com
                </Link>
              </p>
            </li>
            <li>
              <p>
                Coding open source on GitHub under the username{" "}
                <Link rel="me" href="https://github.com/jakobo/">
                  jakobo
                </Link>
              </p>
            </li>
            <li>
              <p>
                Maintaining a professional profile on LinkedIn as{" "}
                <Link rel="me" href="https://www.linkedin.com/in/jakobheuser/">
                  Jakob Heuser
                </Link>
              </p>
            </li>
            <li>
              <p>
                Keeping a backup Fediverse account on a Mastodon server, just in
                case Meta never makes good on that ActivityPub promise:{" "}
                <Link rel="me" href="https://hachyderm.io/@jakobo">
                  @jakobo@hachyderm.io
                </Link>
              </p>
            </li>
            <li>
              <p>
                Squatting on my X/Twitter handle, @jakobo, with no intention to
                return
              </p>
            </li>
          </ul>
        </div>
      </Layout>
    </>
  );
};

export default Colophon;
