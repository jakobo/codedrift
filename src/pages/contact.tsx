import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import React from "react";

const Contact: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>{createTitle("Contact Jakob")}</title>
      </Head>
      <Layout>
        <div className="flex-col w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">Contact</h1>
          <p>
            I love feedback of all kinds. If you&rsquo;d like to share thoughts
            with me, you can find me:
          </p>
          <ul>
            <li>
              On Twitter <a href="https://twitter.com/jakobo">@jakobo</a>
            </li>
            <li>
              On LinkedIn:{" "}
              <a href="https://linkedin.com/in/jakobheuser">in/jakobheuser</a>
            </li>
            <li>Via Email: jakob [at] this domain</li>
          </ul>
        </div>
      </Layout>
    </>
  );
};

export default Contact;
