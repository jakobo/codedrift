// changes the beheavior of a link to a Link object from next.js

import { type Schema, nodes } from "@markdoc/markdoc";
import React, { type AnchorHTMLAttributes } from "react";
import NextLink from "next/link.js";

export const link: Schema = {
  ...nodes.link,
  render: "Link",
};

export const Link: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  ...rest
}) => {
  if (!href) return <a {...rest} />;
  return <NextLink href={href} {...rest}></NextLink>;
};
