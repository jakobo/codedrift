import { Entry } from "src/components/Timeline";
import { LI, P, UL } from "src/components/markup";
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
      <P>
        The LinkedIn Connect SDK is the best way to bring LinkedIn to third
        party sites. Extending the existing REST API, the Connect SDK provides
        JavaScript support and embeddable widgets for your website. We launched
        with the initial features:
      </P>
      <UL>
        <LI>Sign In With LinkedIn (OAuth 2)</LI>
        <LI>Share on LinkedIn Button</LI>
        <LI>Embeddable data (Profiles, Companies, etc)</LI>
        <LI>JavaScript to REST API Bridge</LI>
      </UL>
    </Entry>
  );
}
