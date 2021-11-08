import { Entry } from "src/components/Timeline";
import React from "react";

export default function ProjectThanks() {
  return (
    <Entry
      year="2020"
      title="Co-Founder &amp; CEO"
      product="(codename) Project Thanks"
      categories={["Featured", "Product", "Engineering", "Design"]}
    >
      <p>
        Building on what we learned building mentorship applications at Aibex,
        we&rsquo;re exploring how everyone can build deeper and more thoughtful
        relationships with the people they already know.
      </p>
    </Entry>
  );
}
