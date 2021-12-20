import visit from "unist-util-visit";

const CMS_URL = /^https?:\/\/codedrift\.ghost\.io\/(?:.+?\/)?/;

export default function rehypeDeghost() {
  return function transformer(tree) {
    visit(tree, { tagName: "a" }, (node) => {
      if (!node?.properties?.href) {
        return node;
      }

      try {
        node.properties.href = node.properties.href.replace(CMS_URL, "");
      } catch {
        return node; // non parseable URL, such as #anchored
      }
    });
  };
}
