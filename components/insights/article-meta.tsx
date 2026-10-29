import type { Article, ArticleCategory } from "@/types";

export const categoryLabels: Record<ArticleCategory, string> = {
  "buying-guides": "Buying guides",
  "import-guides": "Import guides",
  ev: "Electric vehicles",
  shipping: "Shipping",
  customs: "Customs",
  "vehicle-reviews": "Vehicle reviews",
  "china-automotive-market": "China's car market",
};

export function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="text-caption text-muted-foreground">
      <span className="font-medium uppercase tracking-wide text-foreground/70">
        {categoryLabels[article.category]}
      </span>
      {" · "}
      {new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      {" · "}
      {article.readMinutes} min read
    </p>
  );
}
