import visit from "unist-util-visit";

// based on css-to-top, optimized to drop outside of visit
// https://github.com/rehypejs/rehype-minify/blob/main/packages/rehype-css-to-top/index.js
export default function rehypeNoEmpty() {
  return function transformer(tree) {
    const drop = [];
    visit(tree, (node, index, parent) => {
      if (parseInt(node?.children?.length, 10) === 0) {
        drop.push({ node, parent });
      }
    });
    drop.forEach((d) => {
      const { node, parent } = d;
      parent.children = parent.children.filter((child) => child !== node);
    });
  };
}
