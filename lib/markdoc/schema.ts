import { type Config } from "@markdoc/markdoc";
import type React from "react";
import { Document, document } from "./nodes/document.js";
import { Link, link } from "./nodes/link.js";
import { Fence, fence } from "./nodes/fence.js";

export const markdocSchema: Config = {
  nodes: {
    document,
    fence,
    link,
  },
  tags: {},
  variables: {},
  functions: {},
  partials: {},
};

export const markdocComponents: Record<
  string,
  React.ReactNode | React.FC<any>
> = {
  Fence,
  Document,
  Link,
};
