import { Entry } from "src/components/Timeline";
import { P } from "src/components/markup";
import React from "react";

export default function Aibex() {
  return (
    <Entry
      year="2018"
      title="Co-Founder &amp; CEO, Aibex"
      product="Aibex (exploration)"
      categories={["Featured", "Product", "Engineering", "Design"]}
    >
      <P>
        Aibex wants you to get the most out of your career, and that means
        understanding what you want from your current job and how it&rsquo;s
        part of your larger story. Through guided reflection and timely prompts,
        Karl and Aibex help you explore your relationship with work.
      </P>
    </Entry>
  );
}
