import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/data/vehicles";
import { getArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/config";

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, articles] = await Promise.all([getVehicles(), getArticles()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/vehicles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/source`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/fleet`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/ev`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/insights`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${BASE_URL}/vehicles/${vehicle.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/insights/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...articleRoutes];
}
