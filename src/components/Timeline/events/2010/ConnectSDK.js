import { Entry } from "src/components/Timeline";
import React from "react";

export default function ConnectSDK() {
  return (
    <Entry
      year="2010"
      title="Sr Software Engineer, LinkedIn"
      product="LinkedIn Connect SDK"
      href="https://blog.linkedin.com/2011/04/06/linkedin-developer-platform"
      categories={["Featured", "Engineering"]}
    >
      <p>
        The LinkedIn Connect SDK is the best way to bring LinkedIn to third
        party sites. Extending the existing REST API, the Connect SDK provides
        JavaScript support and embeddable widgets for your website. We launched
        with the initial features:
      </p>
      <ul>
        <li>Sign In With LinkedIn (OAuth 2)</li>
        <li>Share on LinkedIn Button</li>
        <li>Embeddable data (Profiles, Companies, etc)</li>
        <li>JavaScript to REST API Bridge</li>
      </ul>
    </Entry>
  );
}
