import { Entry } from "src/components/Timeline";
import React from "react";

export default function Aibex() {
  return (
    <Entry
      year="2018"
      title="Co-Founder &amp; CEO"
      product="Aibex"
      categories={["Product", "Engineering", "Design"]}
    >
      <p>
        A rethink of how we interact with mentors and our networks in order to
        get the most out of our careers. From guided reflections and journaling
        to weekly content, it enabled people to see the big picture and plan
        their next big steps.{" "}
      </p>
    </Entry>
  );
}
