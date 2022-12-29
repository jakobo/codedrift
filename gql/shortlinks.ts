import { REPO_NAME, REPO_OWNER } from "lib/constants";
import { query } from "__generated__/github";

export const selectShortlinkData = query((q) => [
  q.repository({ name: REPO_NAME, owner: REPO_OWNER }, (r) => [
    r.object({ expression: "main:data/shortlinks.yaml" }, (x) => [
      x.$on("Blob", (b) => [b.id, b.text]),
    ]),
  ]),
]);
