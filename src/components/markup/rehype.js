import {
  A,
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Img,
  LI,
  OL,
  P,
  UL,
} from "../../components/markup";
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

const components = {
  p: P,
  a: A,
  img: Img,
  code: Code,
  blockquote: Blockquote,
  ol: OL,
  ul: UL,
  li: LI,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
};

export const html2React = (
  text,
  { headings = [H1, H2, H3, H4, H5, H6] } = {}
) => {
  if (!text) {
    return null;
  }

  const resHeadings = {
    h1: headings[0] || H1,
    h2: headings[1] || H2,
    h3: headings[2] || H3,
    h4: headings[3] || H4,
    h5: headings[4] || H5,
    h6: headings[5] || H6,
  };

  const allComponents = {
    ...components,
    ...resHeadings,
  };

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
      components: allComponents,
    });

  return parser.processSync(text).result;
};
