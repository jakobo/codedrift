import { Entry } from "src/components/Timeline";
import React from "react";

export default function LinkedInMobileWeb() {
  return (
    <Entry
      year="2011"
      title="Engineering Manager, LinkedIn"
      product="LinkedIn Mobile Web Experience"
      href="https://blog.linkedin.com/2011/08/16/new-linkedin-mobile"
      categories={["Featured", "Engineering"]}
    >
      <p>
        As we moved to using our mobile phones for everything, the team explored
        how we can deliver an amazing experience for the Mobile Web. The HTML5
        compatible version pushed the bounds of what was possible using CSS on
        portable devices. My personal favorite quirk was all the CSS hacks
        required to force work onto the GPU, a technique we still use (as of
        2021) in React Native.
      </p>
    </Entry>
  );
}
