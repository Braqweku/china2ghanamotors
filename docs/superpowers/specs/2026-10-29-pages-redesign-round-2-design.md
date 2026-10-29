# Redesign Round 2 — Remaining Public Pages

Status: Approved (2026-10-29)
Scope: `/ev`, `/fleet`, `/source`, `/track`, `/faq`, `/insights`. Admin out of scope.
Builds on round 1 (`2026-10-29-vehicles-redesign-design.md`); same rules from `CLAUDE.md`.

## Shared

- `components/layout/page-header.tsx` — `PageHeader({ title, intro?, children? })`: `h1.text-h1`, intro `text-body text-muted-foreground max-w-2xl`. Every page in scope uses it.
- `components/layout/form-page.tsx` — `FormPage({ aside, children })`: two columns on `lg` (`minmax(0,1fr)` + `340px`), form in a bordered panel, aside below the form on mobile.
- `components/layout/next-steps.tsx` — `NextSteps({ title, steps: string[] })`: numbered list (number in a small muted circle), no cards.

## EV

- Facts: two-column definition list with dividers (Range & battery, Charging, Efficiency, Importing), no icon cards.
- Two sections: "Electric (N)" and "Hybrid (N)" using `VehicleCard`. Copy says "available now".

## Fleet

- `FormPage` with existing `FleetEnquiryForm`.
- Aside: "Who this is for" (ride-hailing operators, logistics, dealers, corporate and institutions), "What's included" (bulk sourcing, inspection of every unit, consolidated shipping and clearing), `NextSteps` (4 steps).

## Source

- Page renders `PageHeader` + `FormPage`; `SourcingWizard` loses its own container, `h1` and intro (logic unchanged).
- Aside: `NextSteps` (what happens after you submit) + link "Browse vehicles available now".
- Placeholder: "e.g. Toyota Corolla Cross, or a hybrid SUV under 60,000 km".

## Track

- `FormPage`: lookup form + results in the main panel; aside "Where to find your reference" and the 12 stages from `lib/tracking-stages.ts` as a compact numbered list.

## FAQ

- shadcn `Accordion` (single, collapsible). JSON-LD unchanged.
- Correct answers: "Are the vehicles new or used?" → current stock is used vehicles inspected in China; new vehicles can be sourced on request. Remove "filter by condition"; mention filtering by brand, body type, fuel and year.

## Insights

- Newest article as a featured row (wide, larger title + excerpt), rest in a 2-column list grid separated by borders.
- Category shown as plain uppercase caption text, not a pill.

## Testing

`npm test`, `tsc --noEmit`, `next lint`, `next build`; screenshots of each page at 1280px and 390px (iframe method).
