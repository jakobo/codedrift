import retext from "retext";
import smartypants from "retext-smartypants";
import unified from "unified";
import visit from "unist-util-visit";
import { type Literal } from "unist";

const OMIT = ["script", "style"];

function isLiteral(s: unknown): s is Literal {
  let t = s as Literal;
  return typeof t?.value !== "undefined";
}

const rehypeSmartypants: unified.Plugin = (options = {}) => {
  const p = retext().use(smartypants, options);

  return function transformer(tree) {
    visit(tree, "text", (node, index, parent) => {
      if (!OMIT.includes(parent.type) && isLiteral(node)) {
        node.value = String(p.processSync(node.value));
      }
    });
  };
};

export default rehypeSmartypants;
