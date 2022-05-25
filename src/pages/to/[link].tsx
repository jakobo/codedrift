import Head from "next/head";
import { Layout } from "src/components/Layout";
import React from "react";
import { GetStaticProps } from "next";
import { initDefaultUrqlClient } from "src/graphql";
import {
  Blob,
  SelectShortlinkDataDocument,
  SelectShortlinkDataQuery,
  SelectShortlinkDataQueryVariables,
} from "__generated__/graphql";
import { ShortlinkFile } from "types/shortlinks";
import yaml from "js-yaml";
import { PROSE, SECTION_HEADLINE } from "src/constants";

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
  const link = Array.isArray(ctx.params.link)
    ? ctx.params.link[0]
    : ctx.params.link;
  const { client, cache } = initDefaultUrqlClient(false);
  const res = await client
    .query<SelectShortlinkDataQuery, SelectShortlinkDataQueryVariables>(
      SelectShortlinkDataDocument
    )
    .toPromise();

  // allow for legacy location
  const contents = (
    (res.data?.repository?.current || res.data?.repository?.legacy) as Blob
  )?.text;
  if (!contents) {
    return {
      notFound: true,
    };
  }

  const data = yaml.load(contents) as ShortlinkFile;
  const row = data.links[link];
  if (!row) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      urqlState: cache.extractData(),
      name: link,
      url: typeof row === "string" ? row : row.url,
      description: typeof row === "string" ? null : row.description,
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
