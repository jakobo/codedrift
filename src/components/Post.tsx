import Link from "next/link";
import React, { HTMLAttributes, PropsWithChildren } from "react";
import { DateTime } from "luxon";
import { Post as PT, Tag } from "types/Post";
import { demoji } from "src/lib/demoji";
import cx from "classnames";
import { MINOR_LINK, PROSE } from "src/constants";

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
      <div className="flex-col">
        <div className="w-full max-w-reading flex-shrink-0">
          <TitleTag style={{ marginBottom: "0.25em" }}>
            {widont(title)}
          </TitleTag>
          {!publishedAt ? (
            <Link href={`/thunked/${slug}`} passHref>
              <a href={`/thunked/${slug}`} className="text-sm text-gray-500">
                # permalink
              </a>
            </Link>
          ) : (
            <Link href={`/thunked/${slug}`} passHref>
              <a
                href={`/thunked/${slug}`}
                className="text-sm text-gray-500"
                title={DateTime.fromISO(publishedAt).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              >
                {DateTime.fromISO(publishedAt).toRelativeCalendar()}
              </a>
            </Link>
          )}
          <div className="text-gray-500 text-sm">
            {category ? (
              <span>
                in&nbsp;
                <TagLink
                  className={cx(MINOR_LINK, "mr-1")}
                  href={`/thunked/tag/${category.name}`}
                  display={demoji(category.name)}
                  title={category.description}
                />
              </span>
            ) : null}
            {tagSort.map((name, typeIdx) => {
              const list = tagsByEmoji[name] || [];
              if (list.length === 0) return null;
              return (
                <div key={name} className={`inline-block space-x-1`}>
                  <span>+</span>
                  {list.map((tag: Tag, idx: number, all: any[]) => (
                    <span key={tag.id} className="text-gray-500">
                      <TagLink
                        href={`/thunked/tag/${tag.name}`}
                        display={tag.display}
                        className={cx(MINOR_LINK)}
                        title={tag.description}
                      />
                      {idx < all.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
          <div className={PROSE}>{children}</div>
        </div>
      </div>
    </div>
  );
};
