import unified from "unified";
import visit from "unist-util-visit";
import { type Literal } from "unist";

const encodeSmarts = (str: string) =>
  str
    .replace(/“/g, "&#8220;")
    .replace(/”/g, "&#8221;")
    .replace(/‘/g, "&#8216;")
    .replace(/’/g, "&#8217;");

const OMIT = ["script", "style", "pre", "code"];

function isLiteral(s: unknown): s is Literal {
  let t = s as Literal;
  return typeof t?.value !== "undefined";
}

const rehypeEncodeQuotes: unified.Plugin = () => {
  return function transformer(tree) {
    visit(tree, "text", (node, index, parent) => {
      if (!OMIT.includes(parent.type) && isLiteral(node)) {
        node.value = encodeSmarts(node.value as string);
      }
    });
  };
};

export default rehypeEncodeQuotes;
