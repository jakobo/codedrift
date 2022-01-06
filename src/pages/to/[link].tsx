import Head from "next/head";
import Layout from "src/components/Layout";
import React from "react";
import { GetStaticProps } from "next";
import ky from "ky-universal";
import { APIResponse } from "../api/v1/shortlink/[key]";

interface ShortLinkToProps {
  name: string;
  description?: string;
  url: string;
}

const ShortLinkTo: React.FC<ShortLinkToProps> = ({
  name,
  description,
  url,
}) => {
  return (
    <>
      <Head>
        <title>Codedrift Short Link</title>
        <meta name="robots" content="noindex" />
        {url ? <meta httpEquiv="refresh" content={`3;URL='${url}'`} /> : null}
      </Head>
      <Layout>
        <div className="flex-col w-full max-w-reading">
          <h1 className="font-sans-lg font-bold text-7xl mb-3">Redirecting</h1>
          <div className="prose dark:prose-dark">
            <p>
              You&rsquo;re accessing a codedrift short link. In a few moments,
              you&rsquo;ll be taken to &ldquo;{name}&rdquo;{" "}
              {description ? <>({description})</> : null} at <code>{url}</code>
            </p>
            <p>
              If you are not redirected automatically,{" "}
              <a href={url}>access {url}</a>
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
  const details = (await ky(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/shortlink/${link}`
  ).json()) as APIResponse;
  if (!details || !details.link) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      name: link,
      url: typeof details === "string" ? details : details.link.url,
      description:
        typeof details === "string" ? null : details.link.description,
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
