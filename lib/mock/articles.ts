import type { ArticleMeta } from "@/types";

// Article text for each language lives in lib/mock/articles/<locale>.ts.
export const articleMeta: ArticleMeta[] = [
  { slug: "first-time-buyers-guide", category: "buying-guides", publishedAt: "2026-05-04T09:00:00Z", readMinutes: 5 },
  { slug: "how-the-import-process-works", category: "import-guides", publishedAt: "2026-05-18T09:00:00Z", readMinutes: 6 },
  { slug: "ev-import-considerations", category: "ev", publishedAt: "2026-06-02T09:00:00Z", readMinutes: 5 },
  { slug: "understanding-vehicle-shipping", category: "shipping", publishedAt: "2026-06-15T09:00:00Z", readMinutes: 4 },
  { slug: "clearing-customs-ghana", category: "customs", publishedAt: "2026-06-28T09:00:00Z", readMinutes: 5 },
  { slug: "choosing-the-right-vehicle-type", category: "vehicle-reviews", publishedAt: "2026-07-06T09:00:00Z", readMinutes: 4 },
  { slug: "why-china-automotive-market", category: "china-automotive-market", publishedAt: "2026-07-20T09:00:00Z", readMinutes: 4 },
];
