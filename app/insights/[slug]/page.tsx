import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getArticles } from "@/lib/data/articles";
import { ArticleMeta, categoryLabels } from "@/components/insights/article-meta";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

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

  const more = (await getArticles())
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/insights" className="hover:text-foreground">
                Insights
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {categoryLabels[article.category]}
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 text-h1 font-semibold tracking-tight text-foreground">{article.title}</h1>
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
          <h2 className="text-h3 font-semibold text-foreground">Ready to find your vehicle?</h2>
          <p className="mt-2 text-small text-muted-foreground">
            Browse used vehicles available now, or tell us what you need and we will source it.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/vehicles">Browse vehicles</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/source">Source a vehicle</Link>
            </Button>
          </div>
        </aside>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="mx-auto mt-16 max-w-2xl">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="more-heading" className="text-h3 font-semibold text-foreground">
              More insights
            </h2>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-small font-medium text-foreground underline-offset-4 hover:underline"
            >
              All articles
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-4 border-t border-border">
            {more.map((a) => (
              <li key={a.slug} className="border-b border-border">
                <Link href={`/insights/${a.slug}`} className="group block py-5">
                  <ArticleMeta article={a} />
                  <p className="mt-1 text-body font-semibold text-foreground underline-offset-4 group-hover:underline">
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
