import { REPO_NAME, REPO_OWNER } from "lib/constants";
import { $$, query } from "__generated__/github";

export const selectLabelDetails = query((q) => [
  q.repository({ name: REPO_NAME, owner: REPO_OWNER }, (r) => [
    r.label({ name: $$("label") }, (l) => [l.id, l.name, l.description]),
  ]),
]);
