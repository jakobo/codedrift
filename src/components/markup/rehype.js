import Link from "next/link";
import React from "react";
import autolinkHeadings from "rehype-autolink-headings";
import deghost from "./plugins/rehype-deghost";
import highlight from "rehype-highlight";
import rehype from "rehype-parse";
import rehype2react from "rehype-react";
import slug from "rehype-slug";
import smartypants from "./plugins/rehype-smartypants";
import unified from "unified";
import widont from "rehype-widont";

const NextLink = ({ href, children, ...rest }) => (
  <Link href={href} passHref>
    <a {...rest}>{children}</a>
  </Link>
);

export const html2React = (text) => {
  if (!text) {
    return null;
  }

  const parser = unified()
    .use(rehype, { fragment: true })
    .use(slug)
    .use(autolinkHeadings)
    .use(highlight)
    .use(widont)
    .use(smartypants)
    .use(deghost)
    .use(rehype2react, {
      Fragment: React.Fragment,
      createElement: React.createElement,
      components: {
        a: NextLink,
      },
    });

  return parser.processSync(text).result;
};
