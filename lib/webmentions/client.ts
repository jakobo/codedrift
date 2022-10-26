import fetch from "cross-fetch";

type property =
  | "in-reply-to"
  | "like-of"
  | "repost-of"
  | "bookmark-of"
  | "mention-of"
  | "rsvp";
type sortBy = "created" | "updated" | "published" | "rsvp";
type sortDir = "down" | "up";
type Nullable<T> = T | null;
type Arrayable<T> = T | T[];

type WebmentionRequest = {
  property?: Arrayable<property>;
  sortBy?: sortBy;
  sortDir?: sortDir;
  page?: number;
  perPage?: number;
  target?: Arrayable<string>;
  domain?: string;
  since?: string;
  sinceId?: number;
};

export type WebmentionCountRequest = {
  target: Arrayable<string>;
};

export type Webmention = {
  source: string;
  verified: boolean;
  verified_date: Nullable<string>;
  id: number;
  private: boolean;
  data: {
    author: {
      name: string;
      url: Nullable<string>;
      photo: Nullable<string>;
    };
    url: string;
    name: Nullable<string>;
    content: Nullable<string>;
    published: Nullable<string>;
    published_ts: Nullable<number>;
  };
  activity: {
    type: "link" | "reply" | "repost" | "like";
    sentence: string;
    sentence_html: string;
  };
  rels?: {
    canonica: string;
  };
  target: string;
};

export type WebmentionAPIResponse = {
  links: Webmention[];
};

export type WebmentionCountResult = {
  count: number;
  type: {
    like: number;
    mention: number;
    post: number;
    reply: number;
  };
};

type WebmentionsResult = {
  links: WebmentionAPIResponse["links"];
};

export const MENTIONS_ENDPOINT = "https://webmention.io/api/mentions.json";
export const COUNT_ENDPOINT = "https://webmention.io/api/count.json";

export default class WebmentionsClient {
  private token: string;
  constructor(options?: { token: string }) {
    this.token = options?.token;
  }

  async count(options: WebmentionCountRequest): Promise<WebmentionCountResult> {
    const req = new URL(COUNT_ENDPOINT);
    (Array.isArray(options.target) ? options.target : [options.target]).forEach(
      (target) => {
        req.searchParams.append("target[]", target);
      }
    );

    const resp = await fetch(req.toString());
    const res: WebmentionCountResult = await resp.json();
    return res;
  }

  async get(options: WebmentionRequest): Promise<WebmentionsResult> {
    const req = new URL(MENTIONS_ENDPOINT);

    if (
      typeof options.target !== "undefined" &&
      typeof options.domain !== "undefined"
    ) {
      throw new Error("Cannot combine .target and .domain in options");
    }

    if (
      typeof options.since !== "undefined" &&
      typeof options.sinceId !== "undefined"
    ) {
      throw new Error("Cannot combine .since and .sinceId in options");
    }

    if (typeof options.domain !== "undefined" && !this.token) {
      throw new Error(
        "To request domain-level mentions, you need to initialize the client with a token. You can find your token on https://webmention.io/settings"
      );
    }

    // filter properties
    if (options.property) {
      (Array.isArray(options.property)
        ? options.property
        : [options.property]
      ).forEach((property) => {
        req.searchParams.append("wm-property[]", property);
      });
    }

    //target(s)
    if (typeof options.target !== "undefined") {
      (Array.isArray(options.target)
        ? options.target
        : [options.target]
      ).forEach((target) => {
        req.searchParams.append("target[]", target);
      });
    }

    //domain(s)
    if (typeof options.domain !== "undefined") {
      (Array.isArray(options.domain)
        ? options.domain
        : [options.domain]
      ).forEach((domain) => {
        req.searchParams.append("domain[]", domain);
      });
    }

    // since
    if (typeof options.since !== "undefined") {
      req.searchParams.append("since", options.since);
    }

    // sinceId
    if (typeof options.sinceId !== "undefined") {
      req.searchParams.append("since_id", `${options.sinceId}`);
    }

    // sort
    req.searchParams.append("sort-by", options.sortBy || "published");
    req.searchParams.append("sort-dir", options.sortDir || "up");

    // paging
    if (options.perPage !== undefined) {
      req.searchParams.append("per-page", `${options.perPage}`);
    }
    if (options.page !== undefined) {
      req.searchParams.append("page", `${options.page}`);
    }

    // token
    req.searchParams.append("token", this.token);

    const resp = await fetch(req.toString());
    const res: WebmentionAPIResponse = await resp.json();
    // console.log(res);
    return res;
  }
}
