import Head from "next/head";
import Layout from "src/components/Layout";
import React from "react";
import fetch from "cross-fetch";

const CODA_DOC_ID = "FBvQLDXnR5";
const TABLE_ID = "grid-nY6gZ4WA3F";
const RO_TOKEN = process.env.CODA_SHORTLINK_TOKEN;
const URL_COLUMN = "c-Zj97xpo6te";
const URL_DESCRIPTION_COLUMN = "c-DoxDsHBIsp";

// const sample = {
//   id: "i-QyuC-GaC87",
//   type: "row",
//   href: "https://coda.io/apis/v1/docs/FBvQLDXnR5/tables/grid-nY6gZ4WA3F/rows/i-QyuC-GaC87",
//   name: "ik-one",
//   index: 0,
//   createdAt: "2021-09-26T07:52:44.970Z",
//   updatedAt: "2021-09-26T07:53:28.295Z",
//   browserLink:
//     "https://coda.io/d/_dFBvQLDXnR5#_tugrid-nY6gZ4WA3F/_rui-QyuC-GaC87",
//   values: {
//     "c-bM6bzYJlBO": "ik-one",
//     "c-Zj97xpo6te":
//       "https://codepen.io/collection/2fbcb10973559a9115c7f5c2320133c2?grid_type=list",
//     "c-DoxDsHBIsp": "IK Module 1 codepens",
//   },
//   parent: {
//     id: "grid-nY6gZ4WA3F",
//     type: "table",
//     tableType: "table",
//     href: "https://coda.io/apis/v1/docs/FBvQLDXnR5/tables/grid-nY6gZ4WA3F",
//     browserLink: "https://coda.io/d/_dFBvQLDXnR5#_tugrid-nY6gZ4WA3F",
//     name: "Short Links",
//   },
// };

const codaUrl = (name) =>
  `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${TABLE_ID}/rows/${name}`;

export default function ShortLink({ coda } = {}) {
  const link = coda?.values?.[URL_COLUMN];
  const description = coda?.values?.[URL_DESCRIPTION_COLUMN];
  return (
    <>
      <Head>
        <title>Codedrift Short Link</title>
        <meta name="robots" content="noindex" />
        {link ? <meta httpEquiv="refresh" content={`3;URL='${link}'`} /> : null}
      </Head>
      <Layout>
        <div className="flex-col w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">Redirecting</h1>
          <div className="prose dark:prose-dark">
            <p>
              You&rsquo;re accessing a codedrift short link. In a few moments,
              you&rsquo;ll be taken to &ldquo;{description}&rdquo; at{" "}
              <code>{link}</code>
            </p>
            <p>
              If you are not redirected automatically,{" "}
              <a href={link}>access {link}</a>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps(ctx) {
  const url = codaUrl(ctx.params.link);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${RO_TOKEN}`,
    },
  });
  const result = await response.json();
  return {
    props: {
      coda: result,
    },
    revalidate: 300,
  };
}

// we are abusing fallback here to avoid a huge query on ghost
// which would also impact build times. If we end up favoring build times
// we'll make a call to the post directory to get paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
