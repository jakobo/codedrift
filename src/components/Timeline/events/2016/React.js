import { Entry } from "src/components/Timeline";
import React from "react";

export default function ReactAtPinterest() {
  return (
    <Entry
      year="2016"
      title="Head of Core Experience"
      product="React at Pinterest"
      href="https://medium.com/pinterest-engineering/how-we-switched-our-template-rendering-engine-to-react-a799a3d540b0"
      categories={["Featured", "Engineering"]}
    >
      <p>
        Pinterest&lsquo;s web architecture consisted of a django frontend
        coupled with backbone.js and a custom templating engine. To support
        massive engineering growth over the next several years, the Core
        Experience Web team helped the company incrementally transition to a
        React based architecture. A custom binding layer allowed us to use
        legacy code from jinja alongside new components.
      </p>
    </Entry>
  );
}
