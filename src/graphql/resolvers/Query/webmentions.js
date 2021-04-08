import { decodeCursor, encodeCursor, pager } from "../../util";

export const MENTIONS_ENDPOINT = "https://webmention.io/api/mentions";
export const COUNT_ENDPOINT = "https://webmention.io/api/count.json";

/*
sample count response from swyx
{
  "count": 1062,
  "type": {
    "like": 638,
    "mention": 154,
    "reply": 51,
    "repost": 219
  }
}
*/

const HARD_LIMIT = 150;

export default async function webmentions(
  _,
  {
    filter: rawFilter = "mention, reply, repost, like",
    sortBy = "published",
    sortDir,
    url,
    first: firstLimit = 15,
    after = null,
    literal = false,
  } = {}
) {
  const wmFilter = rawFilter
    .split(",")
    .map((s) => s.trim())
    .filter((f) => !!f)
    .sort();
  const cursor = after
    ? decodeCursor(after)
    : {
        type: "Webmention",
        filter: wmFilter,
        sortBy,
        sortDir,
        id: null,
        url,
        literal,
        offset: 0,
      };

  if (
    cursor.filter.sort().join(",") !== wmFilter.join(",") ||
    cursor.sortDir !== sortDir ||
    cursor.sortBy !== sortBy
  ) {
    throw new Error(
      "Using a cursor requires you to maintain the same filter, sortBy, and sortDir criteria to operate on the same dataset"
    );
  }

  // trusted cursor, can use graphql inputs and get same result. Offset is in cursor
  const first = Math.min(firstLimit, HARD_LIMIT);

  // next item is +1
  const { page, limit, waste } =
    after === null ? pager(0, first) : pager(cursor.offset + 1, first);

  const targets = literal
    ? [url]
    : [
        url.replace(/^https?:\/\//, "https://"),
        url.replace(/^https?:\/\//, "http://"),
        url.replace(/^https?:\/\//, ""),
      ];

  const req = new URL(MENTIONS_ENDPOINT);
  wmFilter.forEach((f) => {
    req.searchParams.append("wm-property[]", f);
  });
  targets.forEach((t) => req.searchParams.append("target[]", t));
  req.searchParams.append("sort-by", sortBy);
  req.searchParams.append("sort-dir", sortDir);
  req.searchParams.append("per-page", limit);
  req.searchParams.append("page", page);

  const next = new URL(req.toString());
  next.searchParams.set("page", page + 1);

  const [res, nextRes] = await Promise.all([
    fetch(req.toString()),
    fetch(next.toString()),
  ]);

  const resJson = await res.json();
  const slice = waste.tail > 0 ? [waste.head, -1 * waste.tail] : [waste.head];
  const mentions = resJson.links.slice(...slice);

  const nextResJson = await nextRes.json();
  const hasNextPage =
    waste.tail > 0
      ? resJson.links.length > waste.head + limit
      : nextResJson.links.length > 0;

  const edges = mentions.map((wm, idx) => {
    return {
      node: {
        id: `mention-${wm.id}`,
        type: wm.activity.type,
        source: wm.source,
        url: wm.data.url,
        author: {
          id: encodeCursor({
            url: wm.data.author?.url || `author-of-${wm.id}`,
          }),
          name: wm.data.author?.name,
          url: wm.data.author?.url,
          photo: wm.data.author?.photo,
        },
        publishedAt: wm.data.published,
        content: wm.data.content,
      },
      cursor: encodeCursor({
        type: "Webmention",
        filter: wmFilter,
        sortBy,
        sortDir,
        id: wm.id,
        url,
        literal,
        offset: cursor.offset + idx,
      }),
    };
  });

  return {
    edges,
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage,
      startCursor: edges?.[0]?.cursor || null,
      endCursor: edges?.[Math.max(0, edges.length - 1)]?.cursor || null,
    },
  };
}
