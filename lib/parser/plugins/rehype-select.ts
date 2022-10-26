import { selectAll as rhSelectAll, select } from "unist-util-select";
import u from "unist-builder";
import unified from "unified";

type rehypeSelectOptions = {
  selector: string;
};
const rehypeSelect: unified.Plugin<any[], rehypeSelectOptions> = ({
  selector,
}) => {
  return function transformer(tree) {
    return u("root", select(selector, tree));
  };
};
export default rehypeSelect;

export const rehypeSelectAll: unified.Plugin<any[], rehypeSelectOptions> = ({
  selector,
}) => {
  return function transformer(tree) {
    return u("root", rhSelectAll(selector, tree));
  };
};
