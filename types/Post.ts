import { type RenderableTreeNodes } from "@markdoc/markdoc";

export type Tag = {
  name: string;
  display?: string;
  description?: string;
  id: string | number;
};

export type Post = {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  slug: string;
  draft: boolean;
  canonicalUrl: string;
  commentUrl: string;
  markdoc: RenderableTreeNodes;
  body: string;
  html?: string;
  source: string;
  publishedAt: string;
  updatedAt?: string;
  category?: Tag | undefined;
  tags: Tag[];
  changelog?: Array<{
    isoDate: string | undefined;
    change: {
      body: string;
      markdoc?: RenderableTreeNodes | undefined;
    };
  }>;
  repost?: {
    url: string;
    text: string;
    markdoc?: RenderableTreeNodes | undefined;
  };
};
