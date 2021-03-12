import { decodeCursor, encodeCursor, ghost2Post } from "../../util";
import { getClient, pager } from "src/lib/ghost";

const POST_FILTER = "tag:hash-post";
const HARD_LIMIT = 15;

export default async function posts(
  _,
  {
    filter: ghostFilter = null,
    orderBy = "published_at DESC",
    first: firstLimit = 15,
    after = null,
  } = {}
) {
  const cursor = after
    ? decodeCursor(after)
    : {
        type: "Post",
        filter: ghostFilter,
        orderBy,
        id: null,
        offset: 0,
      };

  if (cursor.filter !== ghostFilter || cursor.orderBy !== orderBy) {
    throw new Error(
      "Using a cursor requires you to maintain the same filter and orderBy criteria to operate on the same dataset"
    );
  }

  // trusted cursor, can use graphql inputs and get same result. Offset is in cursor
  const filter = ghostFilter ? `${POST_FILTER}+${ghostFilter}` : POST_FILTER;
  const first = Math.min(firstLimit, HARD_LIMIT);

  // next item is +1
  const { page, limit, waste } =
    after === null ? pager(0, first) : pager(cursor.offset + 1, first);

  const ghost = getClient();
  const result = await ghost.posts.browse({
    filter,
    limit,
    page: page + 1,
    include: "tags",
    ...(orderBy ? { order: orderBy } : {}),
  });

  // ghost bolts meta onto the array. why?!
  const meta = result.meta;
  const slice = waste.tail > 0 ? [waste.head, -1 * waste.tail] : [waste.head];
  const posts = result.map((p) => p).slice(...slice);

  // create edges matching typedef (tags are not in a cursor)
  const edges = posts.map((post, idx) => {
    const clean = ghost2Post(post);
    return {
      node: clean,
      cursor: encodeCursor({
        type: "Post",
        filter: ghostFilter,
        orderBy,
        id: clean.id,
        offset: cursor.offset + idx,
      }),
    };
  });

  const hasNextPage = !!meta?.pagination?.next;
  const totalCount = meta?.pagination?.total || 0;

  return {
    totalCount,
    edges,
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage,
      startCursor: edges?.[0]?.cursor || null,
      endCursor: edges?.[Math.max(0, edges.length - 1)]?.cursor || null,
    },
  };
}
