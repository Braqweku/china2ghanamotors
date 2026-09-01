# Corporate/Fleet, EV Discovery, Content/Insights — Design Spec

Status: Approved. Covers the three remaining roadmap sub-projects, brainstormed together and executed sequentially with separate implementation plans/commits each.

---

## 1. Corporate/Fleet (`/fleet`)

Single-page enquiry form (not multi-step — B2B audience, more direct per the brief). Headline: "Source Your Next Fleet From China."

New type (`types/fleet.ts`):
```ts
export type FleetEnquiry = {
  companyName: string;
  contactName: string;
  phone: string;
  email?: string;
  fleetSize: number;
  vehicleTypesNeeded: string;
  notes?: string;
  status: "submitted" | "reviewing" | "quoted";
};
```

New repository function `submitFleetEnquiry(enquiry): Promise<{ reference: string }>` in `lib/data/fleet.ts`, mirroring `submitSourcingRequest`'s reference-generation pattern.

Fields: company name, contact name, phone (required); email (optional); fleet size (number, min 1); vehicle types needed (text); notes (optional). Simple required-field validation, same style as the Sourcing wizard (plain checks, no library). On submit, show the generated reference and confirmation copy — no fabricated response-time promise.

## 2. EV Discovery (`/ev`)

Single page. Top section: short educational copy on EV/hybrid basics — range, battery, charging, efficiency, import considerations. General statements only (e.g., "electric and hybrid vehicles are available through our sourcing network"), no fabricated numeric claims beyond what's already in the vehicle catalog's `specs`.

Below: a grid of electric + hybrid vehicles, fetched via two `getVehicles()` calls (`{ fuelType: "electric" }`, `{ fuelType: "hybrid" }`) merged and deduplicated by `id`, rendered with the existing `VehicleCard`. No new data types.

## 3. Content/Insights (`/insights`, `/insights/[slug]`)

New types (`types/article.ts`):
```ts
export type ArticleCategory =
  | "buying-guides"
  | "import-guides"
  | "ev"
  | "shipping"
  | "customs"
  | "vehicle-reviews"
  | "china-automotive-market";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readMinutes: number;
  content: string[]; // paragraphs
};
```

`lib/mock/articles.ts`: 7 articles, one per category — real, generic educational content (import process, shipping methods, customs basics, EV import considerations, vehicle-type buying guidance, an overview of China's automotive market). No fabricated statistics about this specific business, no fake reviews/testimonials — general, factual, non-business-specific guidance only.

`lib/data/articles.ts`: `getArticles(): Promise<Article[]>`, `getArticleBySlug(slug): Promise<Article | null>`.

`/insights`: grid of article cards (title, excerpt, category badge, read time, publish date).
`/insights/[slug]`: full article (paragraphs), category badge, back link; `notFound()` for an unknown slug (root `not-found.tsx` from Foundation already handles this correctly at the page level).

## 4. Shared Constraints

No new dependencies for any of the three. No test framework (consistent with the rest of the site — none of these introduce genuinely complex logic). All three follow the existing repository-function pattern for their data (even Fleet/Insights, which don't have a "real" backend yet, for consistency and future swap-ability).
