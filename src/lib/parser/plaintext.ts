import { unified } from "unified";
import strip from "strip-markdown";
import remarkParse from "remark-parse";

export const createParser = () => unified().use(remarkParse).use(strip);
