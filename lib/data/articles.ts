import type { Article, ArticleText } from "@/types";
import type { Locale } from "@/lib/i18n/locales";
import { articleMeta } from "@/lib/mock/articles";
import { articlesEn } from "@/lib/mock/articles/en";
import { articlesFr } from "@/lib/mock/articles/fr";
import { articlesPt } from "@/lib/mock/articles/pt";
import { articlesZh } from "@/lib/mock/articles/zh";

const textByLocale: Record<Locale, Record<string, ArticleText>> = {
  en: articlesEn,
  fr: articlesFr,
  pt: articlesPt,
  zh: articlesZh,
};

export async function getArticles(locale: Locale): Promise<Article[]> {
  // English is the fallback if a translation is ever missing.
  return articleMeta.map((meta) => ({
    ...meta,
    ...(textByLocale[locale][meta.slug] ?? articlesEn[meta.slug]),
  }));
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<Article | null> {
  return (await getArticles(locale)).find((article) => article.slug === slug) ?? null;
}
