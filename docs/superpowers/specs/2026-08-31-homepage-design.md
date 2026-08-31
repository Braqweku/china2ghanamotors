# Homepage — Design Spec

Status: Approved
Sub-project 2 of the roadmap in `docs/design-spec.md` §8. Builds directly on the Foundation & Design System sub-project (design tokens, Header/Footer, type scale, motion tokens) — no new architectural decisions, just the first real page.

---

## 1. Narrative

Follows the master brief's 11-beat homepage story as an arc across sections, not literal on-page labels:

1. Hero — states the need and the promise
2. Trust layer — SOURCE → VERIFY → SHIP → DELIVER
3. Journey — the concrete step-by-step path a customer's request takes
4. Final CTA band — restates the two ways to start

No vehicle cards (Marketplace/Vehicle Detail don't exist yet — nothing to link to without 404ing on the one thing a card exists to do: let you click through). No fabricated stats, testimonials, or certifications anywhere on this page.

---

## 2. Sections

### 2.1 Hero

- Headline: **"YOUR NEXT VEHICLE STARTS IN CHINA."**
- Supporting copy: "We source, verify, ship and deliver vehicles from trusted suppliers in China — giving you a clearer, safer and more convenient route to your next vehicle in Ghana."
- Primary CTA: **"Source My Vehicle"** → `/source`
- Secondary CTA: **"Explore Vehicles"** → `/vehicles` (route doesn't exist until the Marketplace sub-project ships — will 404 until then; expected, not a defect)
- Visual: an abstract SVG route-line motif in navy/red at low opacity behind/beside the headline — no literal car/map illustration, no stock photography. Large, confident typography (`text-display` on desktop, scaling down on mobile) carries the section, per the brief's own "expensive through restraint" principle (§9).

### 2.2 Trust layer (SOURCE → VERIFY → SHIP → DELIVER)

The visual signature of the page. Four cards, row on desktop/tablet, stacked on mobile. Each: a Lucide icon, a one-word stage title, one sentence of real explanation grounded in the concept brief's actual service descriptions (not invented):

| Stage | Copy |
|---|---|
| **Source** | We identify the right vehicle from verified suppliers in China, based on your specifications and budget. |
| **Verify** | Every vehicle is inspected and its condition confirmed before you approve the purchase. |
| **Ship** | We coordinate shipping and handle customs and clearing, so the process is never on you alone. |
| **Deliver** | Your vehicle is delivered to you in Ghana, with updates and documentation the whole way. |

### 2.3 Journey

Reuses the 8-step marketing journey already defined in `docs/design-spec.md` §1, rather than introducing a fourth near-duplicate list (the master brief's §14 gives a 9-step variant and design-spec.md's §2 has a distinct 12-step *operational tracking* list — using three different journey lists across the site would read as inconsistent, so this section standardizes on the one already documented as "marketing/narrative framing"):

Customer Request → Vehicle Options Sourced in China → Price & Specifications Shared → Inspection/Verification → Customer Approval & Payment → Shipping to Ghana → Clearing & Documentation → Vehicle Delivery.

Presented as a vertical timeline (same orientation on mobile and desktop — stays legible at every width, unlike a horizontal scroll-jacked version). Each step's marker and label fade in once as it enters the viewport.

### 2.4 Final CTA band

Full-bleed `primary` (navy) background — the one deliberate full-bleed use of the brand's dominant color on this page — with off-white text. Restates both CTAs: "Source My Vehicle" (primary) and the WhatsApp "Chat with a Sourcing Specialist" link (already built in the Header, restated here as this is the natural point of decision after reading the whole story). Static — no motion needed on a CTA band.

---

## 3. Motion

- Trust-layer cards and journey steps reveal once via `IntersectionObserver`-driven fade + small upward translate, using the existing `--motion-base` duration and `--motion-ease` curve from `app/globals.css`. Not repeated on re-scroll.
- Respects `prefers-reduced-motion` via the token layer already established in Foundation (durations collapse to near-zero) — no per-component override needed.
- No pinned/scroll-jacked scenes, no parallax, no auto-playing background video.

---

## 4. Technical notes (detail lives in the implementation plan)

- New route: `app/page.tsx` is replaced (currently the Foundation placeholder listing mock vehicles — that placeholder is retired here).
- New components under `components/home/`: `hero.tsx`, `trust-layer.tsx`, `journey.tsx`, `cta-band.tsx` — each a focused, single-purpose section component assembled by `app/page.tsx`.
- The scroll-reveal behavior (shared by trust-layer and journey) is one small reusable client-side hook (`useRevealOnScroll` or equivalent) rather than duplicated `IntersectionObserver` wiring in two places.
- Hero's SVG route-line motif is inline SVG (no external asset), sized/positioned via CSS, `aria-hidden` (decorative, not content).
- Everything else (Header, Footer, design tokens, data layer) is already in place from Foundation — this sub-project only adds the homepage's own section components.

---

## 5. Explicitly out of scope

- Vehicle teaser cards (deferred until Marketplace/Detail exist)
- Real photography/video (deferred until assets are available — the abstract treatment is designed to be swapped in later without restructuring the section)
- Any animation beyond the single restrained reveal pattern described above
