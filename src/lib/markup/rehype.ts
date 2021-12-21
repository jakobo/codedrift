import React from "react";
import rehype from "rehype-parse";
import rehype2react from "rehype-react";
import sanitize from "rehype-sanitize";
import select from "./plugins/rehype-select";
import smartypants from "./plugins/rehype-smartypants";
import unified from "unified";
import webmentionSchema from "./plugins/rehype-sanitize-webmention.json";
import widont from "rehype-widont";
import { A } from "./tags/A";

export const webmentionParser = unified()
  .use(rehype, { fragment: true })
  .use(widont)
  .use(smartypants)
  .use(select, {
    selector: "element[tagName=p]:first-of-type",
  })
  .use(sanitize, webmentionSchema) // VERY restricted schema
  .use(rehype2react, {
    Fragment: React.Fragment,
    createElement: React.createElement,
    components: {
      a: A,
    },
  });

export const html2React = (text: string, parser: unified.Processor) => {
  if (!text) {
    return null;
  }
  return parser.processSync(text).result;
};
