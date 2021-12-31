type shortlink = {
  url: string;
  description: string;
};

export type shortlinks = {
  links: {
    [link: string]: string | shortlink;
  };
};
