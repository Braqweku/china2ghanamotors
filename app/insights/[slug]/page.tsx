import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug } from "@/lib/data/articles";
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Badge variant="secondary">{categoryLabels[article.category]}</Badge>
      <h1 className="mt-3 text-h1 font-semibold text-foreground">{article.title}</h1>
      <p className="mt-2 text-caption text-muted-foreground">
        {new Date(article.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {" · "}
        {article.readMinutes} min read
      </p>

      <div className="mt-8 space-y-4">
        {article.content.map((paragraph, i) => (
          <p key={i} className="text-body text-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <Link href="/insights" className="mt-10 inline-block text-small text-accent underline">
        Back to Insights
      </Link>
    </div>
  );
}
