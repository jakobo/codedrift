export type Shortlink = {
  url: string;
  description: string;
};

export type ShortlinkFile = {
  links: {
    [link: string]: string | Shortlink;
  };
};
