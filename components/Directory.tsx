import { DateTime } from "luxon";
import React from "react";
import cx from "classnames";
import Link from "next/link.js";
import { type Post } from "@/types/Post.js";
import { LINK } from "@/data/constants.js";

type PostsByYear = Record<string, Post[]>;

type GroupablePost = Partial<Post> & {
  publishedAt: string;
};

export const groupPostsByYear = (posts: GroupablePost[]): PostsByYear => {
  const byYear: PostsByYear = {};

  for (const post of posts) {
    const year = DateTime.fromISO(post.publishedAt).toObject().year;
    if (!year) {
      throw new TypeError("Invalid post");
    }

    if (!byYear[year]) {
      byYear[year] = [];
    }

    byYear[year].push(post as Post);
  }

  return byYear;
};

type PostDirectoryProps = {
  className?: string;
  postClassName?: string;
  postsByYear: PostsByYear;
};

export const PostDirectory: React.FC<PostDirectoryProps> = ({
  className,
  postClassName,
  postsByYear,
}) => {
  return (
    <>
      {Object.getOwnPropertyNames(postsByYear)
        .sort()
        .reverse()
        .map((year) => (
          <div key={year} className={cx("mb-8", className)}>
            <h2 className="mb-1 w-full border-b border-gray-800 text-left font-sans text-2xl text-gray-800 dark:text-gray-100">
              {year}
            </h2>
            <ul className="grid grid-cols-2 gap-8">
              {(postsByYear[year] ?? []).map((post: Post) => (
                <li key={post.id} className={`w-full ${postClassName}`}>
                  <h2>
                    <Link
                      href={`/thunked/${post.slug}`}
                      passHref
                      className={cx(LINK, "font-bold")}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{post.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </>
  );
};
