import React from "react";
import { type GetStaticProps } from "next";
import yaml from "js-yaml";
import { NextSeo } from "next-seo";
import Head from "next/head.js";
import { Layout } from "@/components/Layout.js";
import { initDefaultUrqlClient } from "@/gql/index.js";
import { type ShortlinkFile } from "@/types/shortlinks.js";
import { PROSE, SECTION_HEADLINE } from "@/data/constants.js";
import { selectShortlinkData } from "@/gql/shortlinks.js";
import { firstOf } from "@/lib/firstOf.js";

type ShortLinkToProps = {
  name: string;
  description?: string;
  url: string;
};

const ShortLinkTo: React.FC<ShortLinkToProps> = ({
  name,
  description,
  url,
}) => {
  return (
    <>
      <NextSeo
        noindex
        nofollow
        title="Redirecting"
        description="Redirecting"
        openGraph={{
          title: "Redirecting",
          description: "Redirecting",
        }}
      />
      <Head>
        {url ? <meta httpEquiv="refresh" content={`3;URL='${url}'`} /> : null}
      </Head>
      <Layout>
        <div className="max-w-reading w-full flex-col">
          <h1 className={SECTION_HEADLINE}>Redirecting</h1>
          <div className={PROSE}>
            <p>
              You&rsquo;re accessing a codedrift short link. In a few moments,
              you&rsquo;ll be taken to &ldquo;{name}&rdquo;{" "}
              {description ? <>({description})</> : null} at <code>{url}</code>
            </p>
            <p>
              If you are not redirected automatically,you can follow this link:
              <br />
              <a href={url} className="text-sm">
                {url}
              </a>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ShortLinkTo;

export const getStaticProps: GetStaticProps<ShortLinkToProps> = async (ctx) => {
  const link = firstOf(ctx.params?.link);
  const { client, cache } = initDefaultUrqlClient(false);
  const result = await client.query(selectShortlinkData, {}).toPromise();

  // allow for legacy location
  const contents = result.data?.repository?.object?.text;
  if (!contents) {
    return {
      notFound: true,
    };
  }

  const data = yaml.load(contents) as ShortlinkFile;
  const row = data.links[link ?? ""];
  if (!row || !link) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      urqlState: cache.extractData(),
      name: link,
      url: typeof row === "string" ? row : row.url,
      description: typeof row === "string" ? undefined : row.description,
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
