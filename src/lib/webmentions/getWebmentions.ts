import ky from "ky-universal";
import { pager } from "../pager";

export const MENTIONS_ENDPOINT = "https://webmention.io/api/mentions";
export const COUNT_ENDPOINT = "https://webmention.io/api/count.json";

type WebmentionAPIResponse = {
  links: {
    id: number | string;
    source: string;
    verified: boolean;
    verified_date: string | null;
    activity: {
      type: string;
    };
    data: {
      url: string;
      published: string | null;
      content: string | null;
      author?: {
        name: string | null;
        url: string | null;
        photo: string | null;
      };
    };
    rels?: {
      canonical?: string | null;
    };
  }[];
};

export type Webmention = {
  id: string;
  type: string | null;
  source: string;
  url: string;
  author: {
    id: string;
    name?: string | null;
    url?: string | null;
    photo?: string | null;
  };
  publishedAt: string;
  content?: string | null;
};

export const getWebmentions = async (
  target: string,
  offset: number = 0,
  limit: number = 10
): Promise<Webmention[]> => {
  const req = new URL(MENTIONS_ENDPOINT);
  // filters
  ["reply-of", "repost-of", "like-of"].forEach((f) => {
    req.searchParams.append("wm-property[]", f);
  });

  // expand valid target URLs
  [
    target.replace(/^https?:\/\//, "https://"),
    target.replace(/^https?:\/\//, "http://"),
    target.replace(/^https?:\/\//, ""),
  ].forEach((t) => req.searchParams.append("target[]", t));

  req.searchParams.append("sort-by", "published");
  req.searchParams.append("sort-dir", "up");

  // offset/limit
  const { page, per_page: lmt, waste } = pager(offset, limit);
  req.searchParams.append("per-page", "" + lmt);
  req.searchParams.append("page", "" + page);

  const res: WebmentionAPIResponse = await ky(req.toString()).json();
  const slice = waste.tail > 0 ? [waste.head, -1 * waste.tail] : [waste.head];
  const mentions = res.links.slice(...slice);
  return mentions.map((wm) => ({
    id: `mention-${wm.id}`,
    type: wm.activity.type,
    source: wm.source,
    url: wm.data.url,
    author: {
      id: wm.data.author?.url || `author-of-${wm.id}`,
      name: wm.data.author?.name,
      url: wm.data.author?.url,
      photo: wm.data.author?.photo,
    },
    publishedAt: wm.data.published,
    content: wm.data.content,
  }));
};

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
