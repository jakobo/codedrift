import rehypeStringify from "rehype-stringify";
import { Processor } from "unified";

export const withHtmlString = (parser: Processor) => {
  parser.use(rehypeStringify);
  return parser;
};
