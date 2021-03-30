import Link from "next/link";
import React from "react";
import format from "date-fns/format";

export const Post = ({
  title,
  titleTag: TitleTag,
  // slug = "/",
  category,
  children,
  date,
  prologue = null,
  eplilogue = null,
  className,
}) => (
  <div className={className}>
    <div className="flex-col lg:flex-row px-1">
      <div className="w-full lg:w-36 lg:-ml-36 pr-4 font-sans-caps text-right">
        <Link href={`/thunked/tag/${category.toLowerCase()}`} passHref>
          <a className="block text-brand-500">{category}</a>
        </Link>
        {!date ? null : (
          <span className="block font-sans-caps text-gray-300 text-sm">
            {format(new Date(date), "P")}
          </span>
        )}
      </div>
      <div
        className={`w-full max-w-reading flex-shrink-0 lg:${
          date ? "-mt-10" : "-mt-5"
        }`}
      >
        <TitleTag>{title}</TitleTag>
        {!prologue ? null : <div>{prologue}</div>}
        <div className="prose dark:prose-dark max-w-none">{children}</div>
        {!eplilogue ? null : <div>{eplilogue}</div>}
      </div>
    </div>
  </div>
);
