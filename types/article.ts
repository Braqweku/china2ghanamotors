export type ArticleCategory =
  | "buying-guides"
  | "import-guides"
  | "ev"
  | "shipping"
  | "customs"
  | "vehicle-reviews"
  | "china-automotive-market";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readMinutes: number;
  content: string[];
};
