import Link from "next/link";
import React from "react";
import format from "date-fns/format";

const permalinkClass =
  "block font-sans-caps text-gray-300 text-sm no-underline";

const widont = (text) => text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

export const Post = ({
  title,
  titleTag: TitleTag,
  slug = "/",
  category,
  children,
  date,
  prologue = null,
  eplilogue = null,
  className,
}) => (
  <div className={className}>
    <div className="flex-col lg:flex-row px-1">
      <div className="flex flex-row space-x-2 lg:flex-col w-full lg:w-36 lg:-ml-36 pr-4 font-sans-caps lg:text-right leading-none">
        <Link href={`/thunked/tag/${category.toLowerCase()}`} passHref>
          <a className="block text-brand-500 dark:text-brand-invert-500">
            {category}
          </a>
        </Link>
        {!date ? (
          <Link href={`/thunked/${slug}`} passHref>
            <a className={permalinkClass}>#</a>
          </Link>
        ) : (
          <Link href={`/thunked/${slug}`} passHref>
            <a className={permalinkClass}>{format(new Date(date), "P")}</a>
          </Link>
        )}
      </div>
      <div
        className={`w-full max-w-reading flex-shrink-0 lg:${
          date ? "-mt-10" : "-mt-5"
        }`}
      >
        <TitleTag style={{ marginBottom: "0.25em" }}>{widont(title)}</TitleTag>
        {!prologue ? null : <div>{prologue}</div>}
        <div className="prose dark:prose-dark max-w-none">{children}</div>
        {!eplilogue ? null : <div>{eplilogue}</div>}
      </div>
    </div>
  </div>
);
