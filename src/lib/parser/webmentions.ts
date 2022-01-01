import rehype from "rehype-parse";
import sanitize from "rehype-sanitize";
import select from "./plugins/rehype-select";
import smartypants from "./plugins/rehype-smartypants";
import { unified } from "unified";
import webmentionSchema from "./plugins/rehype-sanitize-webmention.json";
import widont from "rehype-widont";

export const createParser = () =>
  unified()
    .use(rehype, { fragment: true })
    .use(widont)
    .use(smartypants)
    .use(select, {
      selector: "element[tagName=p]:first-of-type",
    })
    .use(sanitize, webmentionSchema); // VERY restricted schema
