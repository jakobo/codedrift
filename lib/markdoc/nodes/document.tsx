// Applies frontmatter to external next.js attributes

import { type Schema, nodes, Tag } from "@markdoc/markdoc";
import React, { type BaseHTMLAttributes } from "react";
import Head from "next/head.js";

export const document: Schema = {
  ...nodes.document,
  render: "Document",
  attributes: {
    ...nodes.document.attributes,
    frontmatter: {
      render: false,
    },
    matter: {
      render: true,
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Tag(
      `Document`,
      {
        ...attributes,
        matter:
          (config.variables?.frontmatter as Record<string, unknown>) ??
          undefined,
      },
      children
    );
  },
};

type DocumentProps = {
  matter?: Yaml;
};

type Yaml = Record<string, unknown>;

export const Document: React.FC<
  BaseHTMLAttributes<HTMLDivElement> & DocumentProps
> = ({ matter, ...rest }) => {
  return (
    <>
      <Head>
        {matter?.title && typeof matter.title === "string" ? (
          <title key="title">{matter.title ?? "Codedrift"}</title>
        ) : (
          <></>
        )}
      </Head>
      <article {...rest} />
    </>
  );
};
