import { Entry } from "src/components/Timeline";
import React from "react";

export default function KatyDavinci() {
  return (
    <Entry
      year="2012"
      title="Principal Web Developer"
      product="Katy / DaVinci LinkedIn Redesign"
      href="https://www.wired.com/2012/09/linkedin-project-katy/"
      categories={["Featured", "Engineering", "Design", "Product"]}
    >
      <p>
        A complete overhaul of LinkedIn&lsquo;s UI to standardize it across all
        platforms, identifiable by LinkedIn&rsquo;s dark gray navigation bar.
        Included a comprehensive pattern library site and a huge improvement to
        our SASS design token system, allowing us to keyword elements with code
        like <code>@include styleguide(primary button in a container)</code> to
        account for color and contrast variations.
      </p>
    </Entry>
  );
}
