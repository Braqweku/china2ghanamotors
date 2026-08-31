# China2Ghana Motors — Design Spec

Status: Approved (Foundation & Design System sub-project)
Source material: `CHINA2GHANA MOTORS.pdf` (concept brief), `China2Ghana Motors 2.pdf` (expanded business proposal), provided logo asset.

This spec covers brand, UX, UI, motion and responsive foundations for the whole site. It is the single design-spec document required by the project's build brief (rather than a separate short brainstorming-only doc), since the project explicitly calls for `docs/design-spec.md` as its own deliverable.

---

## 1. Brand

**Positioning:** China2Ghana Motors is not "another car dealer." It is a trusted automotive sourcing and mobility platform connecting Ghanaian buyers to China's automotive market — competing on trust, transparency, convenience, value and access rather than lowest price.

**Brand promise:** The trusted route between Ghanaian buyers and China's automotive market.

**Brand pillars:** Trust | Transparency | Access | Convenience | Value

**Tagline (primary):** China to Ghana. Driven by Trust.

**Alternative campaign line (available for section headers / marketing use, not the primary tagline):** See It. Verify It. Ship It. Drive It.

**Value proposition (primary copy, avoid generic AI phrasing):**
"Tell us the vehicle you want. We source it, verify it, ship it and deliver it."

**Service philosophy / core narrative device:** SOURCE → VERIFY → SHIP → DELIVER. This is the single most important repeated visual and structural motif across the site (trust layer, homepage journey, tracking).

**Voice:** Confident, specific, plain-spoken. No "revolutionizing," "seamless," "future of mobility" filler. Sounds like a real operator who has actually done this, not a marketing template.

**Business model context (for internal reasoning, not shown verbatim to users):** Asset-light — vehicles are sourced per confirmed customer order, not held as speculative stock. Revenue comes from sourcing fees, purchase margin, inspection/verification fees, logistics/clearing margins, fleet commissions, and (later) spare parts and financing/insurance commissions. Company is at **Phase 1 — Assisted Vehicle Imports** of a four-phase rollout (Phase 2: local ready-stock; Phase 3: full digital marketplace; Phase 4: mobility ecosystem — fleet, EVs, financing, insurance).

This phase context directly affects how the Vehicle Marketplace sub-project should frame listings: vehicles shown are **sourceable reference examples** ("we can source this for you"), not live dealer inventory. CTAs should read as request/inquiry actions ("Request this vehicle," "Ask about this vehicle"), never "Buy now" or "Add to cart." This will be carried into that sub-project's own brainstorm, not decided in code here.

**Core services** (drives future IA and admin entities — not all built now):
1. Vehicle Sourcing & pre-orders
2. Vehicle Verification & Inspection
3. Purchase Facilitation
4. Shipping & Logistics
5. Customs & Clearing Support
6. Vehicle Delivery
7. Fleet & Corporate Sourcing
8. Spare Parts & After-Sales Support (future)

**Target customers:** Individual buyers, first-time vehicle owners, ride-hailing operators/drivers, fleet owners, transport/logistics companies, corporate organisations, government/institutional buyers, EV buyers, car dealers seeking bulk sourcing.

**Customer journey (marketing/narrative framing — used on homepage, About, etc.):**
Customer Request → Vehicle Options Sourced in China → Price & Specifications Shared → Inspection/Verification → Customer Approval & Payment → Shipping to Ghana → Clearing & Documentation → Vehicle Delivery.

This is distinct from the more granular **12-stage operational tracking timeline** (see §2 below), which is what the Vehicle Tracking feature will actually display per order. The 8-step version above is for storytelling; the 12-step version is for real status tracking.

**Visual personality:** Premium, international, automotive, trustworthy, technological, human, efficient. Explicitly not: stereotypical China/Ghana iconography, generic SaaS gradients, stock-photo AI aesthetic.

---

## 2. UX

**Primary personas** (condensed from target customers above):
- **Individual buyer** — first vehicle or replacement vehicle, budget-conscious, needs reassurance on trust/process.
- **Ride-hailing / fleet operator** — recurring or bulk need, cares about total cost and turnaround time.
- **Corporate / institutional buyer** — formal procurement, needs a quote path and credibility signals, not a consumer checkout flow.

**Primary conversion paths:**
1. Homepage → Vehicle Marketplace → Vehicle Detail → "Request this vehicle" / WhatsApp
2. Homepage → "Source My Vehicle" wizard (for buyers who don't want to browse, they just describe what they need)
3. Homepage / Corporate page → Fleet enquiry form
4. Returning customer → Vehicle Tracking (reference lookup)

**Information architecture (site map):**
- `/` — Homepage
- `/vehicles` — Marketplace (listing, search, filter)
- `/vehicles/[id]` — Vehicle detail
- `/source` — Source My Vehicle wizard
- `/track` — Vehicle tracking
- `/fleet` — Corporate & fleet sourcing
- `/ev` — EV/hybrid discovery
- `/insights` — Editorial/content hub
- `/insights/[slug]` — Article
- `/about`, `/contact` — supporting pages (built as needed, not a Foundation deliverable)

**Operational tracking stages (12-step, used by `/track`):**
Request received → Vehicle sourcing → Vehicle selected → Verification → Inspection → Purchase → Ready for shipping → In transit → Arrived in Ghana → Clearing → Ready for delivery → Delivered.

**Error/empty/loading states are mandatory**, not optional polish: every data-driven view (marketplace results, vehicle detail, tracking lookup) must define what it looks like with zero results, a failed lookup, and mid-load — designed alongside the happy path, not bolted on after.

---

## 3. UI

**Typeface:** Geist (Sans) for all UI/body text; Geist Mono reserved narrowly for tracking reference codes (e.g. `C2G-8837XJ`) where a monospace read aids scanability. The logo's own wordmark is a fixed brand asset and is never reset in Geist — it stays as supplied artwork.

**Type scale:** Display, H1, H2, H3, Body, Small, Label, Caption — implemented as Tailwind utilities backed by CSS variable tokens (`--text-display`, `--text-h1`, etc. in `app/globals.css`'s `@theme`), not ad hoc font-size values per component. Values:

| Token | Size | Line height | Use |
|---|---|---|---|
| `display` | 3.5rem (56px) | 1.1 | Hero-level headlines only |
| `h1` | 2.5rem (40px) | 1.15 | Page-level headings |
| `h2` | 1.875rem (30px) | 1.2 | Section headings |
| `h3` | 1.5rem (24px) | 1.3 | Sub-section headings |
| `body` | 1rem (16px) | 1.6 | Default body text — comfortable line height |
| `small` | 0.875rem (14px) | 1.5 | Secondary/supporting text |
| `label` | 0.875rem (14px) | 1.4 | Form labels, UI chrome (medium weight) |
| `caption` | 0.75rem (12px) | 1.4 | Timestamps, fine print |

**Color tokens** (sampled from the provided logo; exact hex refined in code, not fabricated beyond what the logo shows):

| Token | Direction | Use |
|---|---|---|
| `background` | Warm off-white | Page background |
| `foreground` | Deep navy (logo wordmark/outline) | Body text |
| `primary` | Deep navy | Primary buttons, headings, nav, footer |
| `primary-foreground` | Off-white | Text on navy |
| `accent` | Controlled red (logo "2" / arrow) | CTAs, price emphasis, key highlights — sparingly, never as a full-section background wash |
| `muted` | Light neutral gray | Secondary backgrounds, disabled states |
| `border` | Low-contrast light gray | Card/input borders |
| `success` | Muted green | Delivered / confirmed states |
| `warning` | Amber | Pending / in-review states |
| `destructive` | A distinct error red (not the brand accent red, to avoid double-meaning between "brand CTA" and "error") | Form errors, failed states |

Dark mode is out of scope for Foundation — not a stated requirement, and automotive/logistics platforms in this category are read primarily in daylight/business contexts. Revisit only if requested.

**Spacing:** Tailwind's default 4px-based scale, used consistently — no arbitrary one-off pixel values.

**Radius:** One restrained scale (`sm` / `md` / `lg`), leaning small-to-moderate. Explicitly avoiding the "excessive rounded cards" anti-pattern.

**Shadows:** A 2–3 step elevation scale, subtle — no glow effects, no drop-shadow-as-decoration.

**Component inventory (installed incrementally via shadcn, not all up front):** button, card, badge, input, select, dialog, sheet (mobile nav), separator, skeleton, table, tabs, form — added when a sub-project's page actually needs them.

**Forms:** validated, progressive where multi-step (Source My Vehicle wizard), clear inline error messaging — no silent failures.

**Tables:** used for structured data (vehicle specs, cost breakdowns) — not used to fake a "data-dense" look where a list would read better.

---

## 4. Motion

**Principle:** every animation must answer at least one of — improves comprehension, communicates hierarchy, gives feedback, establishes spatial relationship, or makes an interaction feel responsive. If none apply, it doesn't ship.

**Tokens:** duration `fast` ≈150ms, `base` ≈250ms, `slow` ≈400ms. One deliberately chosen primary easing curve (not the default `cubic-bezier(0.4,0,0.2,1)` used reflexively) — finalized during implementation and recorded in `app/globals.css` as the source of truth.

**Reduced motion:** `prefers-reduced-motion` is handled at the token layer itself (durations collapse / transforms simplify), not as an afterthought per component.

**Hover:** gated behind `@media (hover: hover) and (pointer: fine)` so touch devices never get stuck hover states.

**Properties:** prefer `transform` and `opacity`; avoid animating layout-triggering properties. No `scale(0)` entrances — use restrained scale ranges paired with opacity.

---

## 5. Responsive

Mobile-first. Priority order on small screens: CTA → vehicle information → search → WhatsApp → forms → tracking. No hover-dependent functionality anywhere. Verified at 320/375/390/430/768/1024/1280/1440/1920px during each sub-project's build, not just at the end.

---

## 6. Data Architecture (Foundation)

Frontend-only for now, with a repository/service layer so a future real backend (e.g. Supabase) can be substituted without touching component code.

```
types/            Vehicle, SourcingRequest, TrackingEvent, Supplier (added as needed)
lib/data/         async repository functions: getVehicles(), getVehicleById(),
                  submitSourcingRequest(), getTrackingEvents()
lib/mock/         local TS/JSON the repository functions currently read from
```

Repository functions are `async` from day one even though they only read local arrays today, so call sites never change when real persistence is introduced.

`getTrackingEvents(reference)` returns `Promise<TrackingEvent[] | null>` — `null` for an unknown reference (failed lookup, per §2's mandatory error state), `[]` only for a valid reference with no events yet recorded. These are distinct states the `/track` page must render differently.

```ts
type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  vehicleType: "sedan" | "suv" | "pickup" | "van" | "hatchback" | "truck"
  fuelType: "petrol" | "hybrid" | "electric" | "diesel"
  transmission: "automatic" | "manual"
  mileageKm: number
  condition: "new" | "used"
  priceUsd: number
  images: string[]
  availability: "available" | "sourcing" | "sold"
  supplierId: string
  specs: Record<string, string>
}

type SourcingRequest = {
  vehicleQuery: string
  budgetUsd: { min: number; max: number }
  specifications: string[]
  quantity: number
  customer: { name: string; phone: string; email?: string; whatsapp?: string; location?: string }
  status: "submitted" | "reviewing" | "quoted"
}

type TrackingEvent = {
  reference: string
  stage: "received" | "sourcing" | "selected" | "verification" | "inspection"
    | "purchased" | "ready_to_ship" | "in_transit" | "arrived_ghana"
    | "clearing" | "ready_for_delivery" | "delivered"
  timestamp: string
  note?: string
}
```

No fabricated testimonials, certifications, reviews, or supplier claims anywhere — mock data is realistic but clearly synthetic, and any "verification" badge in the UI must represent real data, never a decorative trust signal.

---

## 7. Stack & Project Structure

Next.js 15 (App Router), TypeScript strict, Tailwind CSS, shadcn/ui (Radix primitives), Lucide icons, npm. Server Components by default; `"use client"` only where interactivity requires it.

```
app/                    routes
components/ui/          shadcn primitives
components/layout/      Header, Footer, site shell
components/shared/      cross-page building blocks (populated as needed)
lib/data/               repository functions
lib/mock/               mock data
lib/utils.ts            shadcn cn() helper
types/                  shared TypeScript types
styles/globals.css      Tailwind + CSS variable design tokens
docs/                   this spec, plus future sub-project specs
public/logo/            provided logo asset
```

No automated test framework yet — not warranted for a static shell with no business logic. Revisit once the Sourcing wizard and Cost Estimator (real validation/logic) are built.

**Quality gates:** `tsc --noEmit` clean, ESLint clean, `next build` succeeds, layout verified at the breakpoints listed in §5.

---

## 8. Sub-Project Roadmap

Each item below gets its own brainstorm → spec → plan → build cycle. This document only covers #1.

1. **Foundation & Design System** *(this document)*
2. Homepage
3. Vehicle Marketplace
4. Vehicle Detail Page
5. Source My Vehicle wizard
6. Cost Estimator (likely folded into #4/#5 rather than standing alone — decided at that sub-project's brainstorm)
7. Vehicle Tracking
8. Corporate/Fleet page
9. EV/Hybrid discovery page
10. Content/Insights (editorial)

---

## 9. Open Configuration (not fabricated, left as real placeholders)

- Business WhatsApp number — not yet provided. Implemented as an environment variable (`NEXT_PUBLIC_WHATSAPP_NUMBER` or similar) with a placeholder value, wired up for real once the actual number is supplied.
- Any other contact details (email, phone, physical address) — same treatment: environment/config placeholders, never fabricated content in the UI.
