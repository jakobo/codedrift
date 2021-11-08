import Link from "next/link";
import React from "react";

export const groupPostsByYear = (posts) => {
  const byYear = posts.reduce((collection, post) => {
    const year = new Date(post.publishedAt).getFullYear();
    if (!collection[year]) {
      collection[year] = [];
    }
    collection[year].push(post);
    return collection;
  }, {});
  return byYear;
};

export default function PostDirectory({
  className,
  postClassName,
  postsByYear,
}) {
  return (
    <>
      {Object.getOwnPropertyNames(postsByYear)
        .sort()
        .reverse()
        .map((year) => (
          <div key={year} className={`${className}`}>
            <h2 className="w-full lg:-ml-36 lg:w-36 font-sans-lg font-bold text-lg text-left lg:text-right pr-5 text-gray-300">
              {year}
            </h2>
            <ul className="-mt-6 flex flex-col lg:flex-row lg:flex-wrap">
              {postsByYear[year].map((post) => (
                <li
                  key={post.id}
                  className={`mb-10 lg:w-1/2 lg:even:pl-4 lg:odd:pr-4 ${postClassName}`}
                >
                  <h2>
                    <Link href={`/thunked/${post.slug}`} passHref>
                      <a
                        className={`
                            border-b
                            border-dotted 

                            font-sans
                            font-bold

                            text-brand-500
                            hover:text-brand-700
                            border-brand-500
                            hover:border-brand-700

                            dark:text-brand-invert-500
                            dark:hover:text-brand-invert-700
                            dark:border-brand-invert-500
                            dark:hover:border-invert-brand-700
                        `}
                      >
                        {post.title}
                      </a>
                    </Link>
                  </h2>
                  <div className="max-w-none prose dark:prose-dark">
                    <p>{post.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </>
  );
}
