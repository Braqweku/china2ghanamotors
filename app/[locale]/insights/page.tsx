import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/data/articles";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { PageHeader } from "@/components/layout/page-header";
import { ArticleMeta } from "@/components/insights/article-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insights" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/insights", locale),
  };
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const articles = [...(await getArticles(locale))].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={t("title")} intro={t("intro")} />

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
