import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/data/articles";
import type { ArticleCategory } from "@/types";

const categoryLabels: Record<ArticleCategory, string> = {
  "buying-guides": "Buying Guides",
  "import-guides": "Import Guides",
  ev: "EV",
  shipping: "Shipping",
  customs: "Customs",
  "vehicle-reviews": "Vehicle Reviews",
  "china-automotive-market": "China Automotive Market",
};

export default async function InsightsPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Insights</h1>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">
        Buying guides, import and shipping basics, and background on China&apos;s
        automotive market.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/insights/${article.slug}`}
            className="block rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <Badge variant="secondary">{categoryLabels[article.category]}</Badge>
            <h2 className="mt-3 text-h3 font-semibold text-foreground">{article.title}</h2>
            <p className="mt-2 text-small text-muted-foreground">{article.excerpt}</p>
            <p className="mt-4 text-caption text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {article.readMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
