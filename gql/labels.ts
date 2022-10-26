import { $$, query } from "__generated__/github";

export const selectLabelDetails = query((q) => [
  q.repository({ name: "codedrift", owner: "jakobo" }, (r) => [
    r.label({ name: $$("label") }, (l) => [l.id, l.name, l.description]),
  ]),
]);
