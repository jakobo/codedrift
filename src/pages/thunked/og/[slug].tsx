import React from "react";
import { discussionToBlog } from "src/lib/github/discussionToPost";
import { DateTime } from "luxon";
import {
  Discussion,
  useSelectPostsWithSearchQuery,
} from "__generated__/graphql";
import { slugToSearch } from "src/pages/thunked/[slug]";
import { useRouter } from "next/router";
import { withDefaultUrqlClient } from "src/graphql";
import { Post } from "types/Post";
import cx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { demoji } from "src/lib/demoji";

interface LogoProps {
  className?: string;
}
const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cx(`h-[200px]`, "flex flex-row items-center", className)}>
      <ChevronLeftIcon className={cx(`h-[150px] w-[150px] color-current`)} />
      <ChevronRightIcon
        className={cx(`mt-[50px] ml-[-90px] h-[150px] w-[150px] color-current`)}
      />
      <span className="mt-[50px] ml-[-30px] block text-4xl">codedrift</span>
    </div>
  );
};

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

interface ThunkedBySlugImageProps {
  post?: Post;
  error?: number;
}

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
  const tagList = (post?.tags || []).map((t) => t.display || demoji(t.name));
  const catName = post?.category?.display || demoji(post?.category?.name);

  const publishedAt = DateTime.fromISO(post.publishedAt);
  const updatedAt = post.updatedAt ? DateTime.fromISO(post.updatedAt) : null;
  const isUpd = post.updatedAt && post.publishedAt !== post.updatedAt;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        width: "1200px",
        height: "600px",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        // https://heropatterns.com/
        backgroundColor: "#fafaf9",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23e7e5e4' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute left-8 top-16 text-gray-800">
          <h4 className="italic font-bold text-md">
            Thunked: Short essays on code and humans
          </h4>
          <h1 className="font-title text-6xl pt-8">{widont(post.title)}</h1>
        </div>
        <div className="absolute top-0 left-0 right-0 bg-gray-300 h-8" />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-600 h-16" />
        <div className="absolute bottom-24 left-8 w-[600px]">
          <div className="text-md text-gray-500">
            <span>{catName}</span>
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
                <span className="text-primary-500">updated</span>{" "}
                {updatedAt.toLocaleString(DateTime.DATETIME_FULL)}
              </span>
            )}
          </div>
        </div>
        <div className="absolute bottom-12 right-8">
          <Logo className="text-primary-700" />
        </div>
      </div>
      {post.title ? <div id="render-complete" /> : null}
    </div>
  );
};

export default withDefaultUrqlClient({ neverSuspend: true })(
  ThunkedBySlugImage
);
