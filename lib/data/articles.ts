import type { Article } from "@/types";
import { mockArticles } from "@/lib/mock/articles";

export async function getArticles(): Promise<Article[]> {
  return [...mockArticles];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return mockArticles.find((article) => article.slug === slug) ?? null;
}
