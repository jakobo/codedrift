import { Entry } from "src/components/Timeline";
import { P } from "src/components/markup";
import React from "react";

export default function LeadSV() {
  return (
    <Entry
      year="2017"
      title="Owner &amp; Consultant, Lead SV"
      product="React Ready @ Nav, Inc"
      href="https://web.archive.org/web/20200108233815/https://www.leadsv.com/stories/nav"
      categories={["Product", "Engineering"]}
    >
      <P>
        One of the largest challenges for companies moving to the React
        ecosystem is helping engineers adapt their mental models from the
        existing codebase to React&rsquo;s mental model for problem solving.
        React Ready was a customized training that took a company&rsquo;s
        existing code base and used that as a foundation for a more effective
        React training.
      </P>
      <P>Became part of Aibex in 2018</P>
    </Entry>
  );
}
