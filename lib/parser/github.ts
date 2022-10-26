import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import addClasses from "rehype-add-classes";

export const createParser = () =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype)
    .use(addClasses, {
      pre: "not-prose",
    });
