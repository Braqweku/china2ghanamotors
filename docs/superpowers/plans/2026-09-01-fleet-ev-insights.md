# Corporate/Fleet, EV Discovery, Content/Insights Implementation Plan

**Goal:** Build the three remaining roadmap sub-projects: `/fleet`, `/ev`, `/insights` + `/insights/[slug]`.

**Execution:** Implemented directly in this session (no subagents), same as prior sub-projects. Executed as three phases in sequence, each independently committed and quality-gated.

## Global Constraints

- No new dependencies across all three.
- No test framework.
- Fleet/Insights mock data follows the existing repository-function pattern (`lib/data/*` wrapping `lib/mock/*`), consistent with the rest of the site.
- No fabricated business statistics, testimonials, or reviews anywhere in Insights content.

---

## Phase A: Corporate/Fleet

### Task A1: `FleetEnquiry` type and repository function

**Files:** Create `types/fleet.ts`, `lib/data/fleet.ts`.

`types/fleet.ts`:
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

Add `export * from "./fleet";` to `types/index.ts`.

`lib/data/fleet.ts`:
```ts
import type { FleetEnquiry } from "@/types";

export async function submitFleetEnquiry(
  _enquiry: FleetEnquiry
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add FleetEnquiry type and submitFleetEnquiry`.

### Task A2: Fleet enquiry form + page

**Files:** Create `components/fleet/fleet-enquiry-form.tsx`, `app/fleet/page.tsx`.

Client component `FleetEnquiryForm`: local state for all `FleetEnquiry` fields (as strings for controlled inputs, `fleetSize` parsed on submit), single `validate()` function checking companyName/contactName/phone non-empty and fleetSize ≥ 1, inline error text, calls `submitFleetEnquiry` on submit, shows the reference + confirmation on success (same visual pattern as the Sourcing wizard's confirmation step — `rounded-lg border p-6 text-center`, `font-mono` reference).

`app/fleet/page.tsx`: static page, hero-style heading "Source Your Next Fleet From China", one paragraph of audience-framing copy (ride-hailing operators, logistics businesses, corporate organisations, institutions — from `docs/design-spec.md`'s target customers), then `<FleetEnquiryForm />`.

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add Corporate/Fleet page with enquiry form`.

---

## Phase B: EV Discovery

### Task B1: EV/hybrid page

**Files:** Create `app/ev/page.tsx`.

Server Component. Calls `getVehicles({ fuelType: "electric" })` and `getVehicles({ fuelType: "hybrid" })`, concatenates and dedupes by `id` (defensive — current filter logic can't actually double-return a vehicle since `fuelType` is a single value per vehicle, but dedupe anyway for correctness if the filter logic ever changes). Renders: heading "Electric & Hybrid Vehicles", 3-4 short educational paragraphs/cards (range, battery, charging, import considerations — general statements, no fabricated numbers), then a responsive grid of `VehicleCard`s for the combined EV+hybrid list. Empty state if the combined list is empty (defensive, though current mock data guarantees results).

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add EV/hybrid discovery page`.

---

## Phase C: Content/Insights

### Task C1: Article type and mock data

**Files:** Create `types/article.ts`, `lib/mock/articles.ts`, `lib/data/articles.ts`.

`types/article.ts`:
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
  content: string[];
};
```

Add `export * from "./article";` to `types/index.ts`.

`lib/mock/articles.ts`: 7 articles (one per category), each with a real title, a 1-sentence excerpt, a realistic `publishedAt` ISO date, a `readMinutes` estimate, and `content` as 3-5 genuinely informative paragraphs (general vehicle-import/shipping/customs/EV/buying-guide/market-overview knowledge — not fabricated statistics about this specific business, no fake reviews). Author the actual content directly in this file (not duplicated here in the plan) per the spec's topic list in §3.

`lib/data/articles.ts`:
```ts
import type { Article } from "@/types";
import { mockArticles } from "@/lib/mock/articles";

export async function getArticles(): Promise<Article[]> {
  return [...mockArticles];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return mockArticles.find((article) => article.slug === slug) ?? null;
}
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add Article type, mock content, and repository functions`.

### Task C2: Insights listing page

**Files:** Create `app/insights/page.tsx`.

Server Component. Calls `getArticles()`, renders a responsive card grid (title, excerpt, category badge, read time, formatted publish date), each card linking to `/insights/[slug]`.

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add Insights listing page`.

### Task C3: Article detail page

**Files:** Create `app/insights/[slug]/page.tsx`.

Server Component, `params: Promise<{ slug: string }>`. Calls `getArticleBySlug`, `notFound()` if `null` (root `not-found.tsx` handles rendering). Renders category badge, title, publish date + read time, then each `content` paragraph, then a "Back to Insights" link.

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add article detail page`.

---

## Final Task: Whole-batch quality gate

Fresh `tsc`/`lint`/`build`. Dev-server checks: `/fleet` (form renders, submits, shows reference), `/ev` (renders EV+hybrid grid only), `/insights` (7 cards), `/insights/<a-real-slug>` (full article), `/insights/does-not-exist` (404 content, same caveat as Vehicle Detail's not-found — real HTTP status may stay 200 due to the same root-layout streaming characteristic documented in Marketplace's summary; verify the correct content renders regardless). Confirm no lingering node processes after. Responsive check at the standard breakpoints.
