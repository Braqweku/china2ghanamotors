export type ArticleCategory =
  | "buying-guides"
  | "import-guides"
  | "ev"
  | "shipping"
  | "customs"
  | "vehicle-reviews"
  | "china-automotive-market";

/** Facts shared by every language version of an article. */
export type ArticleMeta = {
  slug: string;
  category: ArticleCategory;
  publishedAt: string;
  readMinutes: number;
};

/** The readable part of an article, one per language. */
export type ArticleText = {
  title: string;
  excerpt: string;
  content: string[];
};

export type Article = ArticleMeta & ArticleText;
