import { Entry } from "src/components/Timeline";
import React from "react";

export default function FacetedSearch() {
  return (
    <Entry
      year="2009"
      title="Sr Software Engineer, LinkedIn"
      product="Faceted Search"
      href="https://blog.linkedin.com/2009/12/14/linkedin-faceted-search"
      categories={["Engineering"]}
    >
      <p>
        Real time filters that adjust with every interactionm offering true
        guided navigation and gets rid of the frustrating boolean searches that
        were assumed by search engine interfaces at the time.
      </p>
    </Entry>
  );
}
