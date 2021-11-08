import { getAdminClient } from "src/lib/ghost";
import { ghost2Post } from "../../util";

export default async function draft(_, { id, slug }) {
  const ghost = getAdminClient();

  if (id) {
    const result = await ghost.posts.read({
      id,
      include: "tags",
      formats: "html",
    });
    return ghost2Post(result || null);
  } else if (slug) {
    const result = await ghost.posts.read({
      slug,
      include: "tags",
      formats: "html",
    });
    return ghost2Post(result || null);
  } else {
    return null;
  }
}
