import React from "react";
import { NextSeo } from "next-seo";
import Link from "next/link.js";
import {
  ArrowCircleRightIcon,
  CloudIcon,
} from "@heroicons/react/solid/index.js";
import { GitHubIcon } from "@/components/icons/Github.js";
import { MastodonIcon } from "@/components/icons/Mastodon.js";
import { InstagramIcon } from "@/components/icons/Instagram.js";
import { LinkedInIcon } from "@/components/icons/LinkedIn.js";
import { ThreadsIcon } from "@/components/icons/Threads.js";
import { PROSE, SECTION_HEADLINE } from "@/data/constants.js";
import { Layout } from "@/components/Layout.js";

const ICON_STYLE = "inline-block h-4 w-4 fill-primary-400 mr-2 -mt-1";

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
            I'm on a few other websites, in case one website wasn't enough. There's
            a lot of internet out there; looking forward to meeting you
            digitally.
            <br />
            <span className="text-xl">🫰🏻❤️</span>
          </p>
          <ul className="list-none">
            <li>
              <p>
                <ThreadsIcon className={ICON_STYLE} />
                Posting on Threads & the fediverse as{" "}
                <Link rel="me" href="https://www.threads.net/@codedrift.social">
                  @codedrift.social@threads.net
                </Link>
              </p>
            </li>
            <li>
              <p>
                <InstagramIcon className={ICON_STYLE} />
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
                <CloudIcon className={ICON_STYLE} />
                Shitposting on Bluesky with{" "}
                <Link href="https://bsky.app/profile/codedrift.com">
                  @codedrift.com
                </Link>
              </p>
            </li>
            <li>
              <p>
                <GitHubIcon className={ICON_STYLE} />
                Coding open source on GitHub under the username{" "}
                <Link rel="me" href="https://github.com/jakobo/">
                  jakobo
                </Link>
              </p>
            </li>
            <li>
              <p>
                <LinkedInIcon className={ICON_STYLE} />
                Maintaining a professional profile on LinkedIn as{" "}
                <Link rel="me" href="https://www.linkedin.com/in/jakobheuser/">
                  Jakob Heuser
                </Link>
              </p>
            </li>
            <li>
              <p>
                <MastodonIcon className={ICON_STYLE} />
                Keeping a backup Fediverse account on a Mastodon server, just in
                case Meta never makes good on that ActivityPub promise:{" "}
                <Link rel="me" href="https://hachyderm.io/@jakobo">
                  @jakobo@hachyderm.io
                </Link>
              </p>
            </li>
            <li>
              <p>
                <ArrowCircleRightIcon className={ICON_STYLE} />
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
