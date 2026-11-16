import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/data/vehicles";
import { getArticles } from "@/lib/data/articles";
import { alternatesFor } from "@/lib/i18n/alternates";
import { locales } from "@/lib/i18n/locales";
import { SHIPPING_PATH } from "@/lib/seo/llms";
import { siteConfig } from "@/lib/config";

const BASE_URL = siteConfig.url;

type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> & { path: string };

/** One sitemap URL per language, each listing its hreflang alternates. */
function localized({ path, ...rest }: Entry): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const { canonical, languages } = alternatesFor(path, locale);
    return {
      ...rest,
      url: `${BASE_URL}${canonical === "/" ? "" : canonical}`,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languages).map(([lang, p]) => [lang, `${BASE_URL}${p === "/" ? "" : p}`])
        ),
      },
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, articles] = await Promise.all([getVehicles(), getArticles("en")]);

  const entries: Entry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/vehicles", changeFrequency: "daily", priority: 0.9 },
    { path: SHIPPING_PATH, changeFrequency: "monthly", priority: 0.9 },
    { path: "/source", changeFrequency: "monthly", priority: 0.8 },
    { path: "/fleet", changeFrequency: "monthly", priority: 0.7 },
    { path: "/ev", changeFrequency: "monthly", priority: 0.7 },
    { path: "/insights", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    ...vehicles.map((vehicle): Entry => ({
      path: `/vehicles/${vehicle.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...articles.map((article): Entry => ({
      path: `/insights/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];

  return entries.flatMap(localized);
}
