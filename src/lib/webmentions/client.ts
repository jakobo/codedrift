import ky from "ky-universal";

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

type WebmentionsBaseRequest = {
  property?: Arrayable<property>;
  sortBy?: sortBy;
  sortDir?: sortDir;
  page?: number;
  perPage?: number;
};

type WebmentionsRequestWithTarget = WebmentionsBaseRequest & {
  target?: Arrayable<string>;
};

type WebmentionsRequestWithDomain = WebmentionsBaseRequest & {
  domain?: string;
};

type WebmentionsRequestWithSince = WebmentionsBaseRequest & {
  since?: string;
};

type WebmentionsRequestWithSinceId = WebmentionsBaseRequest & {
  sinceId?: number;
};

export type WebmentionRequest = WebmentionsBaseRequest &
  (
    | WebmentionsRequestWithTarget
    | (WebmentionsRequestWithTarget & WebmentionsRequestWithSince)
    | (WebmentionsRequestWithTarget & WebmentionsRequestWithSinceId)
    | WebmentionsRequestWithDomain
    | (WebmentionsRequestWithDomain & WebmentionsRequestWithSince)
    | (WebmentionsRequestWithDomain & WebmentionsRequestWithSinceId)
  );

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

export const MENTIONS_ENDPOINT = "https://webmention.io/api/mentions.jf2";
export const COUNT_ENDPOINT = "https://webmention.io/api/count.json";

// typeguards
function optionHasTarget(
  options: WebmentionsRequestWithTarget
): options is WebmentionsRequestWithTarget {
  return (options as WebmentionsRequestWithTarget).target !== undefined;
}

function optionHasDomain(
  options: WebmentionsRequestWithDomain
): options is WebmentionsRequestWithDomain {
  return (options as WebmentionsRequestWithDomain).domain !== undefined;
}

function optionHasSince(
  options: WebmentionsRequestWithSince
): options is WebmentionsRequestWithSince {
  return (options as WebmentionsRequestWithSince).since !== undefined;
}

function optionHasSinceId(
  options: WebmentionsRequestWithSinceId
): options is WebmentionsRequestWithSinceId {
  return (options as WebmentionsRequestWithSinceId).sinceId !== undefined;
}

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

    const res: WebmentionCountResult = await ky(req.toString()).json();
    return res;
  }

  async get(options: WebmentionRequest): Promise<WebmentionsResult> {
    const req = new URL(MENTIONS_ENDPOINT);

    if (optionHasTarget(options) && optionHasDomain(options)) {
      throw new Error("Cannot combine .target and .domain in options");
    }

    if (optionHasSince(options) && optionHasSinceId(options)) {
      throw new Error("Cannot combine .since and .sinceId in options");
    }

    if (optionHasDomain(options) && !this.token) {
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
    if (optionHasTarget(options)) {
      (Array.isArray(options.target)
        ? options.target
        : [options.target]
      ).forEach((target) => {
        req.searchParams.append("target[]", target);
      });
    }

    //domain(s)
    if (optionHasDomain(options)) {
      (Array.isArray(options.domain)
        ? options.domain
        : [options.domain]
      ).forEach((domain) => {
        req.searchParams.append("domain[]", domain);
      });
    }

    // since
    if (optionHasSince(options)) {
      req.searchParams.append("since", options.since);
    }

    // sinceId
    if (optionHasSinceId(options)) {
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

    const res: WebmentionAPIResponse = await ky(req.toString()).json();
    return res;
  }
}
