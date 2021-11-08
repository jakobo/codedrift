import { PostDirectoryEntryFields } from "../../typeDefs";
import {
  createChangelog,
  extractExcerpt,
  extractGhostCategory,
  extractGhostTags,
  ghost2Graph,
} from "src/graphql/util";
import { getClient } from "src/lib/ghost";

export default async function postDirectory(
  _,
  { filter: ghostFilter = null, orderBy = "published_at DESC" }
) {
  const ghost = getClient();
  const filter = ghostFilter ? `${ghostFilter}` : "";

  const result = await ghost.posts.browse({
    filter,
    include: "tags",
    fields: [
      "id",
      "title",
      "slug",
      "excerpt",
      "custom_excerpt",
      "published_at",
      "updated_at",
      "codeinjection_foot",
    ],
    limit: "all",
    ...(orderBy ? { order: orderBy } : {}),
  });

  const posts = result.map((p) => p).slice(0);

  return posts.map((p) =>
    ghost2Graph(p, PostDirectoryEntryFields, {
      category: extractGhostCategory,
      tags: extractGhostTags,
      changelog: createChangelog,
      excerpt: extractExcerpt,
    })
  );
}
