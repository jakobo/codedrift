import { Entry } from "src/components/Timeline";
import React from "react";

export default function ApplyWithLinkedIn() {
  return (
    <Entry
      year="2011"
      title="Engineering Manager, LinkedIn"
      product="Apply With LinkedIn"
      href="https://blog.linkedin.com/2011/07/24/apply-with-linkedin"
      categories={["Engineering"]}
    >
      <p>
        Built on top of the LinkedIn Connect SDK, &ldquo;Apply With
        LinkedIn&rdquo; gave job applicants 1-click job applications using their
        LinkedIn profile inside third party talent management applications.
      </p>
    </Entry>
  );
}
