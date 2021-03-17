import visit from "unist-util-visit";

const CMS_URL = /^https?:\/\/codedrift\.ghost\.io\/(?:.+?\/)?/;

export default function rehypeDeghost() {
  return function transformer(tree) {
    visit(tree, { tagName: "a" }, (node) => {
      if (!node?.properties?.href) {
        return node;
      }

      try {
        const u = new URL(node.properties.href);
        const p = u.pathname.replace(CMS_URL, "");
        node.properties.href = p;
      } catch {
        return node; // non parseable URL, such as #anchored
      }
    });
  };
}
