import React from "react";
import rehype2react from "rehype-react";
import { Processor } from "unified";
import { A } from "./tags/A";

export const withReact = (parser: Processor) => {
  parser.use(rehype2react, {
    Fragment: React.Fragment,
    createElement: React.createElement,
    components: {
      a: A,
    },
  });
  return parser;
};
