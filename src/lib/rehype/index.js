import React from "react";
import smartyPants from "retext-smartypants";
import rehype2react from "rehype-react";
import widont from "rehype-widont";
import unified from "unified";
import slug from "rehype-slug";
import highlight from "rehype-highlight";
import rehype from "rehype-parse";
import rehype2retext from "rehype-retext";
import {
  A,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  LI,
  OL,
  UL,
  P,
} from "../../components/markup";

export const createParser = ({ components: overrideComponents = {} } = {}) => {
  const components = {
    p: P,
    a: A,
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

  const all = {
    ...components,
    ...(overrideComponents || {}),
  };

  return (
    unified()
      .use(rehype, { fragment: true })
      // .use(rehype2retext, unified().use(smartyPants))
      .use(slug)
      .use(highlight)
      .use(widont)
      .use(rehype2react, {
        Fragment: React.Fragment,
        createElement: React.createElement,
        components: all,
      })
  );
};

export const parse = (text, overrideComponents = null) => {
  const p = createParser({ overrideComponents });
  if (!text) {
    return null;
  }
  return p.processSync(text).result;
};
