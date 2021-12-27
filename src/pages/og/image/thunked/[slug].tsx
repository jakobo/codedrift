import Logo from "src/components/Logo";
import React from "react";
import {
  discussionToBlog,
  Post as PostItem,
} from "src/lib/github/discussionToPost";
import { DateTime } from "luxon";
import {
  Discussion,
  useSelectPostsWithSearchQuery,
} from "__generated__/graphql";
import { slugToSearch } from "src/pages/thunked/[slug]";
import { useRouter } from "next/router";
import { withDefaultUrqlClient } from "src/graphql";

type ThunkedBySlugImageProps = {
  post?: PostItem;
  error?: number;
};

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

const ThunkedBySlugImage: React.FC<ThunkedBySlugImageProps> = () => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;
  const [{ data }] = useSelectPostsWithSearchQuery({
    variables: {
      search: slugToSearch(slug),
    },
  });

  if (!data?.search?.nodes?.[0]) {
    return null;
  }

  const post = discussionToBlog(data?.search?.nodes?.[0] as Discussion);
  const tagList = (post?.tags || []).map((t) => t.display || t.name);
  const catName = post?.category?.name;

  const publishedAt = DateTime.fromISO(post.publishedAt);
  const updatedAt = post.updatedAt ? DateTime.fromISO(post.updatedAt) : null;
  const isUpd = post.updatedAt && post.publishedAt !== post.updatedAt;

  return (
    <div
      className="absolute overflow-hidden bg-white"
      style={{
        width: "1200px",
        height: "600px",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <div className="relative w-full h-full prose-2xl">
        <div className="absolute left-8 top-8 text-dark">
          <h3 className="italic">Thunked: Short essays on code and humans</h3>
          <h1 className="font-bold text-4xl">{widont(post.title)}</h1>
        </div>
        <div className="absolute bottom-0 p-8 w-full flex flex-row items-center">
          <div className="flex-grow">
            <div className="text-md text-gray-500">
              <span className="text-brand-500">{catName}</span>
              {tagList.length === 0 ? null : (
                <>
                  <span>&nbsp;+&nbsp;</span>
                  {tagList.map((t, idx) => (
                    <span key={t}>{idx === 0 ? t : `, ${t}`}</span>
                  ))}
                </>
              )}
            </div>
            <div className="text-gray-500">
              {!isUpd ? (
                <span>
                  published {publishedAt.toLocaleString(DateTime.DATETIME_FULL)}
                </span>
              ) : (
                <span>
                  <span className="text-brand-500">updated</span>{" "}
                  {updatedAt.toLocaleString(DateTime.DATETIME_FULL)}
                </span>
              )}
            </div>
          </div>
          <Logo
            left="text-gray-800"
            right="text-brand-500"
            text={["text-gray-800", "text-brand-500"]}
            style={{
              width: "360px",
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default withDefaultUrqlClient({ neverSuspend: true })(
  ThunkedBySlugImage
);
