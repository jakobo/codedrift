import Link from "next/link";
import React from "react";
import autolinkHeadings from "rehype-autolink-headings";
import deghost from "./plugins/rehype-deghost";
import highlight from "rehype-highlight";
import noEmpty from "./plugins/rehype-noempty";
import rehype from "rehype-parse";
import rehype2react from "rehype-react";
import sanitize from "rehype-sanitize";
import select from "./plugins/rehype-select";
import slug from "rehype-slug";
import smartypants from "./plugins/rehype-smartypants";
import unified from "unified";
import webmentionSchema from "./plugins/rehype-sanitize-webmention.json";
import widont from "rehype-widont";

const NextLink = ({ href, children, ...rest }) => {
  return (
    <Link href={href} passHref>
      <a {...rest}>{children}</a>
    </Link>
  );
};

export const ghostParser = unified()
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

export const webmentionParser = unified()
  .use(rehype, { fragment: true })
  .use(widont)
  .use(smartypants)
  .use(select, "element[tagName=p]:first-of-type")
  .use(noEmpty)
  .use(sanitize, webmentionSchema) // VERY restricted schema
  .use(rehype2react, {
    Fragment: React.Fragment,
    createElement: React.createElement,
    components: {
      a: NextLink,
    },
  });

export const html2React = (text, parser = ghostParser) => {
  if (!text) {
    return null;
  }
  return parser.processSync(text).result;
};
