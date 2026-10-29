import Link from "next/link";
import type { Metadata } from "next";
import { getArticles } from "@/lib/data/articles";
import { PageHeader } from "@/components/layout/page-header";
import { ArticleMeta } from "@/components/insights/article-meta";

export const metadata: Metadata = {
  title: "Insights — Buying, Import & Shipping Guides",
  description:
    "Buying guides, step-by-step import and shipping basics, customs clearing in Ghana, and background on China's automotive market.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const articles = [...(await getArticles())].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Insights"
        intro="Buying guides, import and shipping basics, and background on China's car market."
      />

      {featured && (
        <Link
          href={`/insights/${featured.slug}`}
          className="group mt-8 block rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8"
        >
          <ArticleMeta article={featured} />
          <h2 className="mt-3 max-w-3xl text-h2 font-semibold text-foreground underline-offset-4 group-hover:underline">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">{featured.excerpt}</p>
        </Link>
      )}

      <ul className="mt-10 grid border-t border-border md:grid-cols-2 md:gap-x-10">
        {rest.map((article) => (
          <li key={article.slug} className="border-b border-border">
            <Link
              href={`/insights/${article.slug}`}
              className="group block py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArticleMeta article={article} />
              <h2 className="mt-2 text-h3 font-semibold text-foreground underline-offset-4 group-hover:underline">
                {article.title}
              </h2>
              <p className="mt-2 text-small text-muted-foreground">{article.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
