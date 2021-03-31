import { TagFields } from "src/graphql/typeDefs";
import { getClient } from "src/lib/ghost";
import { ghost2Graph } from "../../util";

export default async function tag(_, { id, name }) {
  const ghost = getClient();

  if (id) {
    const result = await ghost.tags.read({ id });
    return ghost2Graph(result || null, TagFields);
  } else if (name) {
    const result = await ghost.tags.read({ slug: name });
    return ghost2Graph(result || null, TagFields);
  } else {
    return null;
  }
}
