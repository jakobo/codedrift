import Head from "next/head";
import Layout from "src/components/Layout";
import React from "react";

export default function ThunkedByTagName() {
  return (
    <>
      <Head>
        <title>Contact Jakob - Code Drift</title>
      </Head>
      <Layout>
        <div className="flex-col w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">Contact</h1>
          <p>
            I love feedback of all kinds. If you&rsquo;d like to share thoughts
            with me, I am reachable through all the following mediums:
          </p>
          <ul>
            <li>
              Twitter <a href="https://twitter.com/jakobo">@jakobo</a>
            </li>
            <li>
              LinkedIn:{" "}
              <a href="https://linkedin.com/in/jakobheuser">in/jakobheuser</a>
            </li>
            <li>Email: jakob [at] this domain</li>
          </ul>
        </div>
      </Layout>
    </>
  );
}
