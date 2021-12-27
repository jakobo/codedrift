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
  body: string;
  source: string;
  publishedAt: string;
  updatedAt: string;
  category?: Tag | null;
  tags: Tag[];
};
