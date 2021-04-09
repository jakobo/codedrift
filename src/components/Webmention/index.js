import { formatDistance, parseISO } from "date-fns";
import { html2React, webmentionParser } from "../markup/rehype";
import Icon from "../Icon";
import React from "react";

const avatarSourceIcons = {
  web: ["wm-source-other"],
  reddit: ["wm-source-other", { color: "#FF4500" }], // no reddit icon in feather
  twitter: ["wm-source-twitter", { color: "#1DA1F2" }],
  facebook: ["wm-source-facebook", { color: "#4267B2" }],
};
const Avatar = ({ name, src, source, className }) => {
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
          style={styles || {}}
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

const sources = [
  [/^https?:\/\/(www\.)?twitter\.com/, "twitter"],
  [/^https?:\/\/(www\.)?facebook\.com/, "facebook"],
  [/^https?:\/\/(www\.)?reddit\.com/, "reddit"],
];
const fallbackSource = "web";

const sourceOf = (url) => {
  for (const [regex, source] of sources) {
    if (regex.test(url)) {
      return source;
    }
  }
  return fallbackSource;
};

export default function Webmention({ mention: wm, className }) {
  const dName = wm?.author?.name || wm?.author?.url || wm?.url || null;

  // skip users with no defined name as abusive
  // skip types we don't display as a mention
  if (!dName || SKIP_TYPES.includes(wm.type)) {
    return null;
  }

  const avatarName = wm?.author?.name || "?";
  const content = fixContent(wm?.content, wm?.url);
  const reactContent = html2React(content, webmentionParser);
  const mDate = wm?.publishedAt ? parseISO(wm.publishedAt) : null;
  const wmId = `w-${wm.id}`;

  return (
    <div className={`flex flex-row ${className}`}>
      <a id={wmId} href={`#${wmId}`}></a>
      <Avatar
        name={avatarName}
        src={wm?.author?.photo}
        className="mr-4 flex-shrink-0"
        source={sourceOf(wm.url)}
      />
      <div className="flex-grow">
        <div className="w-3/4 truncate">
          <a
            className="text-brand-500 dark:text-brand-invert-500"
            href={wm?.author?.url || wm?.url}
          >
            {dName}
          </a>
        </div>
        <div className="prose dark:prose-dark max-w-none">{reactContent}</div>
        <div className="text-gray-500">
          <a href={`#${wmId}`}>
            {mDate
              ? formatDistance(mDate, new Date(), { addSuffix: true })
              : "(undated)"}
          </a>
        </div>
      </div>
    </div>
  );
}
