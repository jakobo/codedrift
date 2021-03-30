import { Entry } from "src/components/Timeline";
import Link from "next/link";
import React from "react";

export default function ArtDecoFoundations() {
  return (
    <Entry
      year="2014"
      title="Engineering Manager, LinkedIn"
      product="Art Deco Foundations"
      href="https://engineering.linkedin.com/blog/2016/05/speaking-the-same-language"
      categories={["Engineering", "Design"]}
    >
      <p>
        The natural evolution of LinkedIn&rsquo;s Design System, Art Deco took
        the learnings from Katy / DaVinci and released a UI Library. As part of
        our journey to 1.0, we released{" "}
        <Link href="http://eyeglass.rocks/" passHref>
          <a>Eyeglass</a>
        </Link>{" "}
        and made contributions to{" "}
        <Link href="https://www.npmjs.com/package/node-sass" passHref>
          <a>node-sass</a>
        </Link>{" "}
        and{" "}
        <Link href="https://sass-lang.com/libsass" passHref>
          <a>LibSass</a>
        </Link>
        .
      </p>
    </Entry>
  );
}
