import { selectAll as rhSelectAll, select } from "unist-util-select";
import u from "unist-builder";

export default function rehypeSelect(cssSelector) {
  return function transformer(tree) {
    return u("root", select(cssSelector, tree));
  };
}

export function selectAll(cssSelector) {
  return function transformer(tree) {
    return u("root", rhSelectAll(cssSelector, tree));
  };
}
