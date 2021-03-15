import { Entry } from "src/components/Timeline";
import { P } from "src/components/markup";
import React from "react";

export default function HSDL() {
  return (
    <Entry
      year="2004"
      title="Software Engineer, NPS"
      product="HSDL Threat Level"
      href="https://hsdl.org"
      categories={["Engineering"]}
    >
      <P>
        Linked the DHS Threat Level and historical data to active curated
        articles on homeland security, providing additional context to
        researchers and civilians with access to the system.
      </P>
    </Entry>
  );
}
