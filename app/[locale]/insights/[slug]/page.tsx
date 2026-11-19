import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getArticles } from "@/lib/data/articles";
import { alternatesFor, localizedPath } from "@/lib/i18n/alternates";
import { locales, type Locale } from "@/lib/i18n/locales";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/config";
import { ArticleMeta } from "@/components/insights/article-meta";
import { JsonLd } from "@/components/seo/json-ld";

type Params = Promise<{ locale: Locale; slug: string }>;

export async function generateStaticParams() {
  const articles = await getArticles("en");
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    const t = await getTranslations({ locale, namespace: "insights" });
    return { title: t("notFound") };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: alternatesFor(`/insights/${slug}`, locale),
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const more = (await getArticles(locale))
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const articleUrl = `${siteConfig.url}${localizedPath(`/insights/${slug}`, locale)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
      <JsonLd
        data={articleSchema({
          locale,
          url: articleUrl,
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: t("title"), url: `${siteConfig.url}${localizedPath("/insights", locale)}` },
          { name: article.title, url: articleUrl },
        ])}
      />
      <article className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/insights" className="hover:text-foreground">
                {t("title")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {t(`categories.${article.category}`)}
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 text-h1 font-medium tracking-tight text-foreground">{article.title}</h1>
        <div className="mt-3">
          <ArticleMeta article={article} />
        </div>
        <p className="mt-6 text-body text-muted-foreground">{article.excerpt}</p>

        <div className="mt-8 flex flex-col gap-5 border-t border-border pt-8">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-body leading-relaxed text-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="text-h3 font-medium text-foreground">{t("ctaTitle")}</h2>
          <p className="mt-2 text-small text-muted-foreground">{t("ctaBody")}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/vehicles">{t("browse")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/source">{t("source")}</Link>
            </Button>
          </div>
        </aside>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="mx-auto mt-16 max-w-2xl">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="more-heading" className="text-h3 font-medium text-foreground">
              {t("more")}
            </h2>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-small font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t("all")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-4 border-t border-border">
            {more.map((a) => (
              <li key={a.slug} className="border-b border-border">
                <Link href={`/insights/${a.slug}`} className="group block py-5">
                  <ArticleMeta article={a} />
                  <p className="mt-1 text-body font-medium text-foreground underline-offset-4 group-hover:underline">
                    {a.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
