export type Shortlink = {
  url: string;
  description: string;
};

export type ShortlinkFile = {
  links: Record<string, string | Shortlink>;
};
