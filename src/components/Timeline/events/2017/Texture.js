import { A, P } from "src/components/markup";
import { Entry } from "src/components/Timeline";
import React from "react";

export default function Texture() {
  return (
    <Entry
      year="2017"
      title="Head of Core Experience"
      product="Texture"
      href="https://medium.com/pinterest-engineering/introducing-texture-a-new-home-for-asyncdisplaykit-e7c003308f50"
      categories={["Engineering"]}
    >
      <P>
        Pinterest is an inherently visual site, and a visual site demands
        nothing less than 60fps with hundreds of interactive images. Very few
        iOS technologies can manage layout and redrawing operations within a
        sub-10ms window. The initial Pinterest iOS app rewrite was written on a
        technology known as AsyncDisplayKit (ASDK). When Facebook announced that
        ASDK would no longer be one of their supported projects, we felt the
        technology benefits were too important to the seamless expeirence of
        Pinterest; so we took it on.
        <A href="https://github.com/TextureGroup/Texture">
          &ldquo;Texture&rdquo;
        </A>{" "}
        is the result of former ASDK members and Pinterest engineers pushing for
        a beautiful iOS experience.
      </P>
    </Entry>
  );
}
