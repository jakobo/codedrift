import retext from "retext";
import smartypants from "retext-smartypants";
import visit from "unist-util-visit";

const OMIT = ["script", "style"];

export default function rehypeSmartypants(options = {}) {
  const p = retext().use(smartypants, options);

  return function transformer(tree) {
    visit(tree, "text", (node, index, parent) => {
      if (!OMIT.includes(parent)) {
        node.value = String(p.processSync(node.value));
      }
    });
  };
}
