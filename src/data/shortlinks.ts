export type shortlink = {
  url: string;
  description: string;
};

export type shortlinkYaml = {
  links: {
    [link: string]: string | shortlink;
  };
};
