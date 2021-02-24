import React from "react";
import breaks from "remark-breaks";
import emoji from "remark-emoji";
import smartyPants from "@silvenon/remark-smartypants";
import markdown from "remark-parse";
import rehype2react from "rehype-react";
import remark2rehype from "remark-rehype";
import widont from "rehype-widont";
import unified from "unified";
import slug from "remark-slug";
import highlight from "rehype-highlight";
import unwrapImages from "remark-unwrap-images";
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

const headings = [H1, H2, H3, H4, H5, H6];
export const createParser = ({
  headerLevel = 2,
  components: overrideComponents = {},
} = {}) => {
  const components = {
    p: P,
    a: A,
    ol: OL,
    ul: UL,
    li: LI,
  };
  let set = headings.slice(Math.max(headerLevel - 1, 0));
  const remainder = new Array(6 - set.length).fill(H6);
  [...set, ...remainder].forEach((c, idx) => {
    components[`h${idx + 1}`] = c;
  });

  const all = {
    ...components,
    ...(overrideComponents || {}),
  };

  return unified()
    .use(markdown, {
      gfm: true,
    })
    .use(emoji, {
      padSpaceAfter: true,
    })
    .use(smartyPants)
    .use(breaks)
    .use(slug)
    .use(unwrapImages)
    .use(remark2rehype)
    .use(highlight)
    .use(widont)
    .use(rehype2react, {
      Fragment: React.Fragment,
      createElement: React.createElement,
      components: all,
    })
    .freeze();
};

export const Markdown = ({ headerLevel, text = "" }) => {
  const p = createParser({ headerLevel });
  if (!text) {
    return null;
  }
  const md = p.processSync(text).result();
  return md;
};
