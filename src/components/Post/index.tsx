import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { DateTime } from "luxon";

const permalinkClass =
  "block font-sans-caps text-gray-300 text-sm no-underline";

const widont = (text) => text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

interface PostProps {
  title: string;
  titleTag: any; // TODO: what is this?!
  slug: string;
  category: string;
  publishedAt: string;
  className?: string;
}

export const Post: React.FC<PropsWithChildren<PostProps>> = ({
  title,
  titleTag: TitleTag,
  slug = "/",
  category,
  publishedAt,
  children,
  className = "",
}) => (
  <div className={className}>
    <div className="flex-col lg:flex-row px-1">
      <div className="flex flex-row space-x-2 lg:flex-col w-full lg:w-36 lg:-ml-36 pr-4 font-sans-caps lg:text-right leading-none">
        <Link href={`/thunked/tag/${category.toLowerCase()}`} passHref>
          <a
            href="overriden"
            className="block text-brand-500 dark:text-brand-invert-500"
          >
            {category}
          </a>
        </Link>
        {!publishedAt ? (
          <Link href={`/thunked/${slug}`} passHref>
            <a href={`/thunked/${slug}`} className={permalinkClass}>
              #
            </a>
          </Link>
        ) : (
          <Link href={`/thunked/${slug}`} passHref>
            <a
              href={`/thunked/${slug}`}
              className={permalinkClass}
              title={DateTime.fromISO(publishedAt).toLocaleString()}
            >
              {DateTime.fromISO(publishedAt).toRelativeCalendar()}
            </a>
          </Link>
        )}
      </div>
      <div
        className={`w-full max-w-reading flex-shrink-0 ${
          publishedAt ? "lg:-mt-10" : "lg:-mt-5"
        }`}
      >
        <TitleTag style={{ marginBottom: "0.25em" }}>{widont(title)}</TitleTag>
        <div className="prose dark:prose-dark max-w-none">{children}</div>
      </div>
    </div>
  </div>
);
