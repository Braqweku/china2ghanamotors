# Redesign Round 1 — Foundation + Vehicles

Status: Approved (2026-10-29)
Scope: design-system refresh, header/footer, vehicle card, `/vehicles`, `/vehicles/[id]`, homepage hero + hot deals.
Out of scope (later rounds): EV, Fleet, Source, Track, Insights, FAQ, admin. They inherit the new header, footer and card but are not otherwise redesigned.

## Direction

Refined marketplace. Keep the navy brand, Geist type and existing semantic tokens. Clean white surfaces, landscape photo cards, key specs at a glance, strong filtering. Follows the project CLAUDE.md rules (no gradients, glows, excessive badges/pills/shadows; cards only where they group meaningfully).

## Core problem: photo cropping

Partner photos are mostly 4:3 landscape (some 16:9 and portrait). Current cards and gallery use a 3:4 portrait frame with `object-cover`, cutting off the front and rear of every car.

Rules:
- Every vehicle photo frame is **4:3 landscape** and renders the image with `object-contain` on a neutral `bg-muted` surface. No photo is ever cropped.
- **Cover selection** happens once, in the catalog data (`lib/mock/vehicles.ts`): where a vehicle's first image is portrait, the first landscape exterior image is moved to the front of its `images` array. Done by a one-off script that reads image dimensions; no runtime work.
- Images keep `next/image` with correct `sizes`.

## 1. Foundation

- Keep palette, Geist, semantic tokens (background, foreground, primary, secondary, muted, border, destructive, success, warning).
- Spacing on the 4/8px scale; card radius 8px (`rounded-lg`); one shadow level (`shadow-sm`), no hover shadow jumps.
- Visible focus rings on all interactive elements.
- **Header:** sticky, white with bottom border. Nav: Vehicles, EV, Fleet, Source, Track, Insights. Primary button "Request a vehicle" → `/source`. Mobile: menu in a `Sheet`.
- **Footer:** link columns (Vehicles, Services, Company) + contact details; muted background.

## 2. VehicleCard (single reusable component)

Used by homepage hot deals, `/vehicles`, `/ev`, and "Similar vehicles".

- 4:3 photo frame (`object-contain`, `bg-muted`), small photo-count indicator ("9 photos", camera icon) bottom-right.
- Title: `{year} {make} {model}`; secondary line: trim (`specs.trim`).
- Spec row: `57,000 km · Automatic · Hybrid` (capitalised).
- No availability badge (every listing is available). The "Hot deal" label remains only in the homepage section heading, not on each card.
- Whole card is one link; hover: border colour change only.

## 3. `/vehicles`

- Heading "Vehicles available now" + short accurate intro (real partner stock, inspected and shipped to Ghana). Remove "examples, not live inventory" copy.
- Desktop: filters sidebar (search, brand, body type, fuel, gearbox, year range). Mobile: "Filters" button opens a `Sheet` with the same fields.
- New **brand** filter (`make`), options derived from the catalog.
- Toolbar: result count ("70 vehicles") + sort select: Newest year, Lowest mileage, Recently added (catalog order).
- Grid: 1 col mobile, 2 cols sm, 3 cols xl.
- Empty state: message + "Clear filters".

## 4. `/vehicles/[id]`

- Two-column layout on desktop (gallery + specs left, sticky action panel right); single column on mobile with a fixed bottom action bar.
- **Gallery:** large 4:3 uncropped main image, thumbnail strip, previous/next buttons, left/right arrow keys, swipe on touch, "3 / 9" counter.
- **Specs:** two-column definition table (label / value) for year, mileage, fuel, gearbox, body type, plus all `specs` entries with sentence-case labels.
- **Action panel:** title, trim, key facts, "Request this vehicle" (→ `/source`) and "Ask on WhatsApp" buttons, short reassurance line about inspection and shipping.
- **Similar vehicles:** up to 4 cards, same body type, excluding current.
- Keep existing JSON-LD and breadcrumbs.

## 5. Homepage

- Hero slideshow frame changes from 3:4 portrait to 4:3 landscape with `object-contain`; remove the Ken Burns zoom (it crops).
- Hot deals uses `VehicleCard`.
- Section order otherwise unchanged.

## Data changes

- `VehicleSort` gains `"mileage-asc"` and `"recent"`; `VehicleFilters` gains `make`.
- `getVehicles` applies make filter, query also matches trim, and the new sorts.
- `getMakes()` returns sorted distinct makes for the brand filter.

## Testing

- `tsc --noEmit`, `next lint`, `next build`.
- Script check: every vehicle's `images[0]` is landscape.
- Visual check of listing, detail and homepage at 390px, 768px and 1280px before shipping.
