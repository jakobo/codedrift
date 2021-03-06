import { getClient, pager } from "src/lib/ghost";
import { encodeCursor, decodeCursor } from "../../util";
import { TimelineEntryType } from "../../typeDefs";

const TIMELINE_FILTER = "tags:[hash-post, hash-revised-post]";
const HARD_LIMIT = 15;

const getSlug = (s) => {
  const u = new URL(s);
  return `${u.pathname}`.substr(1).split("/")[0];
};

// transforms based on internal tags
const transforms = {
  "hash-post": (post) => ({
    id: post.id,
    type: TimelineEntryType.Post,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.featured_image,
    createdAt: post.published_at,
  }),
  "hash-revised-post": (post) => ({
    id: post.id,
    type: TimelineEntryType.RevisedPost,
    slug: getSlug(post.canonical_url),
    title: post.title,
    excerpt: post.excerpt,
    image: post.featured_image,
    createdAt: post.published_at,
  }),
};

const formatPost = (post) => {
  let res = {};
  post.tags.forEach((t) => {
    if (transforms[t.slug]) {
      res = {
        ...res,
        ...transforms[t.slug](post),
      };
    }
  });
  return res;
};

export default async function timeline(
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
        type: "TimelineEntry",
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
  const filter = ghostFilter
    ? `${TIMELINE_FILTER}+${ghostFilter}`
    : TIMELINE_FILTER;
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
  const entries = result.map((p) => p).slice(...slice);

  // create edges matching typedef (tags are not in a cursor)
  const edges = entries.map((post, idx) => {
    const clean = formatPost(post);
    return {
      node: clean,
      cursor: encodeCursor({
        type: "TimelineEntry",
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
