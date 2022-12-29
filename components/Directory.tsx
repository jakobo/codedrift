import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";
import cx from "classnames";
import { Post } from "types/Post";
import { LINK } from "data/constants";

type PostsByYear = {
  [year: number]: Post[];
};

type GroupablePost = Partial<Post> & {
  publishedAt: string;
};

export const groupPostsByYear = (posts: GroupablePost[]): PostsByYear => {
  const byYear = posts.reduce((collection, post) => {
    const year = DateTime.fromISO(post.publishedAt).toObject().year;
    if (!collection[year]) {
      collection[year] = [];
    }
    collection[year].push(post);
    return collection;
  }, {});
  return byYear;
};

interface PostDirectoryProps {
  className?: string;
  postClassName?: string;
  postsByYear: PostsByYear;
}

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
            <h2 className="w-full font-sans text-2xl text-left text-gray-800 dark:text-gray-100 border-b border-gray-800 mb-1">
              {year}
            </h2>
            <ul className="grid gap-8 grid-cols-2">
              {postsByYear[year].map((post: Post) => (
                <li key={post.id} className={`w-full ${postClassName}`}>
                  <h2>
                    <Link href={`/thunked/${post.slug}`} passHref>
                      <a
                        href={`/thunked/${post.slug}`}
                        className={cx(LINK, "font-bold")}
                      >
                        {post.title}
                      </a>
                    </Link>
                  </h2>
                  <div className="max-w-none prose dark:prose-invert">
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
