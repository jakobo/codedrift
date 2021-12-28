import Link from "next/link";
import React, { HTMLAttributes, PropsWithChildren } from "react";
import { DateTime } from "luxon";
import { Post as PT, Tag } from "types/Post";
import { demoji } from "src/lib/demoji";

const permalinkClass =
  "block font-sans-caps text-gray-300 text-sm no-underline";

const widont = (text: string) =>
  text.replace(/([^\s])\s+([^\s]+)\s*$/, "$1\u00a0$2");

interface TagLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  display: string;
  href: string;
}

const TagLink: React.FC<TagLinkProps> = ({
  display,
  href,
  className,
  ...rest
}) => (
  <Link href={href}>
    <a
      href={href}
      className="text-brand-500 dark:text-brand-invert-500"
      {...rest}
    >
      <span className={className}>{display}</span>
    </a>
  </Link>
);

interface PostProps extends HTMLAttributes<HTMLDivElement> {
  post: PT;
  titleTag: React.ComponentType<HTMLAttributes<HTMLElement>>;
  className?: string;
}

// order for listing tags on blog posts
const tagSort = ["🏷", "⌛"];

export const Post: React.FC<PropsWithChildren<PostProps>> = ({
  post,
  titleTag: TitleTag,
  children,
  className = "",
}) => {
  const { title, slug, category, tags, publishedAt } = post;
  const tagsByEmoji = (tags || []).reduce((all, curr) => {
    const none = demoji(curr.name);
    const icon = curr.name.replace(none, "").trim();
    if (!all[icon]) {
      all[icon] = [];
    }
    all[icon].push(curr);
    return all;
  }, {});

  return (
    <div className={className}>
      <div className="flex-col lg:flex-row px-1">
        <div className="flex flex-row space-x-2 lg:flex-col w-full lg:w-36 lg:-ml-36 pr-4 font-sans-caps lg:text-right leading-none">
          {category ? (
            <TagLink
              className="block"
              href={`/thunked/tag/${category.name}`}
              display={category.name}
              title={category.description}
            />
          ) : null}
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
        <div className="w-full max-w-reading flex-shrink-0 lg:-mt-10">
          <TitleTag style={{ marginBottom: "0.25em" }}>
            {widont(title)}
          </TitleTag>
          {tagSort.map((name, typeIdx) => {
            const list = tagsByEmoji[name] || [];
            if (list.length === 0) return null;
            return (
              <div
                key={name}
                className={`inline-block text-sm ${
                  typeIdx === 0 ? "" : "ml-2"
                }`}
              >
                {name}
                {list.map((tag: Tag, idx: number) => (
                  <span
                    key={tag.id}
                    className="text-gray-300 dark:text-gray-500"
                  >
                    {idx === 0 ? "" : ", "}
                    <TagLink
                      href={`/thunked/tag/${tag.name}`}
                      display={tag.display}
                      className="text-gray-300 dark:text-gray-500"
                      title={tag.description}
                    />
                  </span>
                ))}
              </div>
            );
          })}
          <div className="prose dark:prose-dark max-w-none">{children}</div>
        </div>
      </div>
    </div>
  );
};
