import { Post } from "src/components/Post";
import { gql } from "@urql/core";
import { html2React } from "src/components/markup/rehype";
import { useQuery } from "urql";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout, { createTitle } from "src/components/Layout";
import Link from "next/link";
import React, { useState } from "react";

const GET_POST = gql`
  query GetDraftBySlug($slug: String!) {
    draft(slug: $slug) {
      id
      title
      category {
        id
        name
      }
      tags {
        id
        name
      }
      html
      slug
      publishedAt
      updatedAt
    }
  }
`;

const IsDraft = ({ title, showButton, onClick }) => {
  return (
    <div className="prose dark:prose-dark max-w-reading p-4 bg-gray-100 dark:bg-gray-800">
      <p>
        ⚠ <strong>Do not share this article</strong>
      </p>
      <p>
        You&rsquo;re currently viewing a draft of content for Code Drift. It is
        not live, and this is not the final URL. If you have thoughts, reach out
        to me via your usual means. You can also{" "}
        <Link
          href={`https://twitter.com/messages/compose?recipient_id=855061&text=${encodeURIComponent(
            `I have feedback on ${title || "a post"}`
          )}`}
          passHref
        >
          <a>DM me via Twitter @jakobo</a>
        </Link>
        , or email jakob [at] this domain.
      </p>
      {showButton ? (
        <button
          className="bg-brand-500 dark:bg-brand-invert-500 px-4 py-2 text-light dark:text-dark rounded"
          onClick={() => (onClick ? onClick() : null)}
        >
          Got it, show the post
        </button>
      ) : null}
    </div>
  );
};

export default function ThunkedDraftBySlug() {
  const [ack, setAck] = useState(false);
  const route = useRouter();
  const [{ data }] = useQuery({
    query: GET_POST,
    variables: { slug: route?.query?.slug || "" },
    pause: !route?.query?.slug,
  });
  const post = data?.draft || {};

  return (
    <>
      <Head>
        <title>{createTitle(`DRAFT ${post?.title || ""}`)}</title>
      </Head>
      <Layout disabled>
        <div className="flex-col w-full">
          <div className="pb-24">
            <IsDraft showButton={!ack} onClick={() => setAck(true)} />
          </div>
          {!ack || !post.id ? null : (
            <>
              <Post
                title={post?.title}
                date={post?.publishedAt}
                slug={post?.slug}
                description={post?.excerpt}
                category={post?.category?.name}
                tags={post?.tags}
                titleTag={(props) => (
                  <h1
                    {...props}
                    className={`${
                      props.className || ""
                    } font-sans font-bold text-4xl`}
                  />
                )}
              >
                {html2React(post.html)}
              </Post>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}