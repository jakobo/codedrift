import retext from "retext";
import smartypants from "retext-smartypants";
import unified from "unified";
import visit from "unist-util-visit";

const OMIT = ["script", "style"];

const rehypeSmartypants: unified.Plugin = (options = {}) => {
  const p = retext().use(smartypants, options);

  return function transformer(tree) {
    visit(tree, "text", (node, index, parent) => {
      if (!OMIT.includes(parent.type)) {
        node.value = String(p.processSync(node.value));
      }
    });
  };
};

export default rehypeSmartypants;
