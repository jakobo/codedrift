import { A, P } from "src/components/markup";
import { Entry } from "src/components/Timeline";
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
      <P>
        The natural evolution of LinkedIn&rsquo;s Design System, Art Deco took
        the learnings from Katy / DaVinci and released a UI Library. As part of
        our journey to 1.0, we released{" "}
        <A href="http://eyeglass.rocks/">Eyeglass</A> and made contributions to{" "}
        <A href="https://www.npmjs.com/package/node-sass">node-sass</A> and{" "}
        <A href="https://sass-lang.com/libsass">LibSass</A>.
      </P>
    </Entry>
  );
}
