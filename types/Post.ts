import { RenderableTreeNodes } from "@markdoc/markdoc";

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
  updatedAt: string;
  category?: Tag | null;
  tags: Tag[];
  changelog?: {
    isoDate: string | null;
    change: {
      body: string;
      html?: string;
    };
  }[];
};
