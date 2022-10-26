import {
  $,
  $$,
  Blob,
  GitObject,
  query,
  SearchType,
} from "__generated__/github";

export const selectShortlinkData = query((q) => [
  q.repository({ name: "codedrift", owner: "jakobo" }, (r) => [
    r.object({ expression: "main:data/shortlinks.yaml" }, (x) => [
      x.$on("Blob", (b) => [b.id, b.text]),
    ]),
  ]),
]);
