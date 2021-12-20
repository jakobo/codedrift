import Head from "next/head";
import Layout from "src/components/Layout";
import React from "react";
import { Coda } from "coda-js";
import { Unwrap } from "types/Unwrap";
import { GetStaticProps } from "next";

const CODA_DOC_ID = "FBvQLDXnR5";
const TABLE_ID = "grid-nY6gZ4WA3F";
const URL_COLUMN = "c-Zj97xpo6te";
const URL_DESCRIPTION_COLUMN = "c-DoxDsHBIsp";

const coda = new Coda(process.env.CODA_SHORTLINK_TOKEN);

interface ShortLinkToProps {
  coda: Unwrap<ReturnType<typeof coda.getRow>>;
}

const ShortLinkTo: React.FC<ShortLinkToProps> = ({ coda }) => {
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
};
export default ShortLinkTo;

export const getStaticProps: GetStaticProps<ShortLinkToProps> = async (ctx) => {
  const link = Array.isArray(ctx.params.link)
    ? ctx.params.link[0]
    : ctx.params.link;
  const result = await coda.getRow(CODA_DOC_ID, TABLE_ID, link, {});
  return {
    props: {
      coda: result,
    },
    revalidate: 300,
  };
};

// we are abusing fallback here to avoid a huge query on ghost
// which would also impact build times. If we end up favoring build times
// we'll make a call to the post directory to get paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
