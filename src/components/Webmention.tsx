import { html2React, webmentionParser } from "src/lib/markup/rehype";
import Icon from "./Icon";
import React, { HTMLAttributes } from "react";
import { Webmention as WebmentionType } from "src/lib/webmentions/client";
import { DateTime } from "luxon";

const avatarSourceIcons: {
  [source: string]: [string, HTMLAttributes<HTMLDivElement>["style"]];
} = {
  web: ["wm-source-other", {}],
  reddit: ["wm-source-other", { color: "#FF4500" }], // no reddit icon in feather
  twitter: ["wm-source-twitter", { color: "#1DA1F2" }],
  facebook: ["wm-source-facebook", { color: "#4267B2" }],
};
interface AvatarProps {
  name: string;
  src: string;
  source: string;
  className: string;
}
const Avatar: React.FC<AvatarProps> = ({ name, src, source, className }) => {
  const [iconName, styles] =
    avatarSourceIcons?.[source] || avatarSourceIcons.web;
  return (
    <div className={className}>
      <div className="relative w-12 h-12">
        <div className="flex flex-row items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-gray-900">
          {src ? (
            <img src={src} alt={name} title={name} className="object-cover" />
          ) : (
            <div>{name.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <Icon
          icon={iconName}
          className="absolute bottom-0 right-0 w-4 h-4 text-brand-500 fill-current"
          style={styles}
        />
      </div>
    </div>
  );
};

const SKIP_TYPES = ["like", "bookmark"];

const fixContent = (content = "", source = "") => {
  // content variants
  // If a URL is available, describe this as a mention (happens if a webmention doesn't syndicate content)
  if (!content) {
    content = `<p>Mentioned this article on ${source
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")}</p>`;
  }

  // if the content doesn't contain a p tag, force one
  if (content.indexOf("<p>") === -1) {
    content = `<p>${content.trim()}</p>`;
  }

  return content;
};

const sources: [RegExp, string][] = [
  [/^https?:\/\/(www\.)?twitter\.com/, "twitter"],
  [/^https?:\/\/(www\.)?facebook\.com/, "facebook"],
  [/^https?:\/\/(www\.)?reddit\.com/, "reddit"],
];
const fallbackSource = "web";

const sourceOf = (url: string) => {
  for (const [regex, source] of sources) {
    if (regex.test(url)) {
      return source;
    }
  }
  return fallbackSource;
};

// given a webmention, describe the action in plain terms
const Action: React.FC<{
  mention: WebmentionType;
}> = ({ mention }) => {
  if (mention.activity.type === "repost") {
    return <span className="ml-1">reposted...</span>;
  }
  if (mention.activity.type === "reply") {
    return <span className="ml-1">replied...</span>;
  }

  return <span className="ml-1">mentioned...</span>;
};

interface WebmentionProps {
  mention: WebmentionType;
  className?: string;
}
export const Webmention: React.FC<WebmentionProps> = ({
  mention: wm,
  className,
}) => {
  const dName = wm?.data?.author?.name || wm?.data?.author?.url || null;

  // skip users with no defined name as abusive
  // skip types we don't display as a mention
  if (!dName || SKIP_TYPES.includes(wm.activity.type)) {
    return null;
  }

  const avatarName = wm?.data?.author?.name || "?";
  const content = fixContent(wm?.data?.content, wm?.data?.url);
  const reactContent = html2React(content, webmentionParser);
  const mDate = wm?.data?.published_ts
    ? DateTime.fromSeconds(wm?.data?.published_ts)
    : null;

  const wmId = `w-${wm.id}`;

  return (
    <div className={`flex flex-row ${className}`}>
      <a
        id={wmId}
        href={`#${wmId}`}
        dangerouslySetInnerHTML={{ __html: "" }}
      ></a>
      <a href={wm?.data?.author?.url || "#"} rel="nofollow">
        <Avatar
          name={avatarName}
          src={wm?.data?.author?.photo}
          className="mr-4 flex-shrink-0"
          source={sourceOf(wm.data?.url)}
        />
      </a>
      <div className="flex-grow">
        <div className="w-3/4 truncate">
          <a
            className="text-brand-500 dark:text-brand-invert-500"
            href={wm?.data?.url || wm?.data?.author?.url}
            rel="nofollow"
          >
            {dName}
            <Action mention={wm} />
          </a>
        </div>
        <div className="prose dark:prose-dark max-w-none">{reactContent}</div>
        <div className="text-gray-500">
          <a href={`#${wmId}`}>{mDate ? mDate.toRelative() : "(undated)"}</a>
        </div>
      </div>
    </div>
  );
};
