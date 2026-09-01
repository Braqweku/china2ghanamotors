# Marketplace + Vehicle Detail Implementation Plan

**Goal:** Build `/vehicles` (filterable listing) and `/vehicles/[id]` (detail with cost breakdown), replacing the 3-vehicle mock dataset with a ~20-vehicle spread and extending the Foundation data layer with filtering.

**Architecture:** Server Components for both routes (data fetched server-side from `searchParams`/`params`), one client component for interactive filter controls that manipulates URL search params. A pure `lib/pricing.ts` function computes the illustrative landed-cost breakdown — no new runtime dependencies.

**Tech Stack:** Unchanged from Foundation/Homepage — Next.js 15.5.24, TypeScript strict, Tailwind v4, shadcn/ui (Radix), Lucide, npm. This plan adds two shadcn components (`select`, `input`).

**Execution:** Implemented directly in this session (no subagents), same as Homepage — self-reviewed against this plan and the spec, verified with `tsc`/`lint`/`build` and a dev-server render check.

## Global Constraints

(From `docs/superpowers/specs/2026-08-31-marketplace-vehicle-detail-design.md`.)

- No fabricated reviews, "X viewing now," or urgency messaging. No "Buy now" — CTAs are request/inquiry framed.
- `getVehicles()` signature change must stay backward compatible (optional `filters` param).
- Cost breakdown must include the exact disclaimer sentence and must not present itself as a real customs/duty calculation.
- `/source` is a known-404-for-now target (Sourcing wizard not yet built) — same accepted pattern as Homepage.
- No automated test framework — verification is `tsc --noEmit` / `next lint` / `next build` plus dev-server render checks, consistent with Foundation and Homepage.
- Responsive breakpoints: 320/375/390/430/768/1024/1280/1440/1920px.

---

### Task 1: Filter types and pricing helper

**Files:** Modify `types/vehicle.ts`. Create `lib/pricing.ts`.

Add to `types/vehicle.ts`:
```ts
export type VehicleSort = "price-asc" | "price-desc" | "year-desc";

export type VehicleFilters = {
  query?: string;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  transmission?: Transmission;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort?: VehicleSort;
};
```

Create `lib/pricing.ts`:
```ts
import type { Vehicle, VehicleType } from "@/types";

const SHIPPING_USD_BY_TYPE: Record<VehicleType, number> = {
  sedan: 1000,
  hatchback: 1000,
  suv: 1300,
  van: 1300,
  pickup: 1500,
  truck: 1500,
};

const INSPECTION_FEE_USD = 150;
const CLEARING_FEE_USD = 2000;

export function estimateLandedCost(vehicle: Vehicle) {
  const shippingUsd = SHIPPING_USD_BY_TYPE[vehicle.vehicleType];
  const inspectionUsd = INSPECTION_FEE_USD;
  const clearingUsd = CLEARING_FEE_USD;
  const totalUsd = vehicle.priceUsd + shippingUsd + inspectionUsd + clearingUsd;
  return { shippingUsd, inspectionUsd, clearingUsd, totalUsd };
}
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add vehicle filter types and landed-cost pricing helper`.

---

### Task 2: Expand mock vehicle data

**Files:** Modify `lib/mock/vehicles.ts`.

Replace the 3-vehicle array with ~20 vehicles per the spec's spread rules (§2): all 6 `vehicleType`s with ≥2 each, all 4 `fuelType`s with ≥3 each, mixed `condition`, price range ~$9,000–$45,000, years 2021–2024, real Chinese manufacturers (BYD, Wuling, JAC, Chery, Geely, Haval, MG, Changan, GAC, Dongfeng, FAW, Foton), a mix of `availability` values (mostly `sourcing`, a few `available`, a couple `sold`) to exercise the UI's badge states, `supplierId`s cycling through `sup_001`–`sup_006`, and a `specs` object per vehicle (engine/seats/drivetrain for combustion/hybrid, range/seats/battery for electric).

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: expand mock vehicle catalog for marketplace filtering`.

---

### Task 3: Filtering/sorting in the repository layer

**Files:** Modify `lib/data/vehicles.ts`.

```ts
import type { Vehicle, VehicleFilters } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  let results = mockVehicles;

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
  }
  if (filters?.vehicleType) {
    results = results.filter((v) => v.vehicleType === filters.vehicleType);
  }
  if (filters?.fuelType) {
    results = results.filter((v) => v.fuelType === filters.fuelType);
  }
  if (filters?.transmission) {
    results = results.filter((v) => v.transmission === filters.transmission);
  }
  if (filters?.condition) {
    results = results.filter((v) => v.condition === filters.condition);
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((v) => v.priceUsd >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((v) => v.priceUsd <= filters.maxPrice!);
  }
  if (filters?.minYear !== undefined) {
    results = results.filter((v) => v.year >= filters.minYear!);
  }
  if (filters?.maxYear !== undefined) {
    results = results.filter((v) => v.year <= filters.maxYear!);
  }

  results = [...results];
  if (filters?.sort === "price-asc") results.sort((a, b) => a.priceUsd - b.priceUsd);
  if (filters?.sort === "price-desc") results.sort((a, b) => b.priceUsd - a.priceUsd);
  if (filters?.sort === "year-desc") results.sort((a, b) => b.year - a.year);

  return results;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}
```

Note: the final `results = [...results]` before sorting ensures `mockVehicles` itself is never mutated by `.sort()`, preserving Foundation's array-copy safety guarantee even when no other filter already produced a copy.

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add filtering and sorting to getVehicles`.

---

### Task 4: Install shadcn `select` and `input`

```bash
npx shadcn@latest add select input
```

Verify: `npm run build` exits 0. Commit: `chore: add shadcn select and input components`.

---

### Task 5: Vehicle card component

**Files:** Create `components/vehicles/vehicle-card.tsx`.

```tsx
import Link from "next/link";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        <Car className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h3 font-semibold text-foreground">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Badge variant={vehicle.availability === "sold" ? "secondary" : "default"}>
            {vehicle.availability === "sold" ? "Sold" : vehicle.availability === "available" ? "Available" : "Sourcing"}
          </Badge>
        </div>
        <p className="mt-1 text-small text-muted-foreground">
          {vehicle.fuelType} · {vehicle.transmission} · {vehicle.mileageKm.toLocaleString()} km
        </p>
        <p className="mt-3 text-h3 font-semibold text-foreground">
          ${vehicle.priceUsd.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add vehicle card component`.

---

### Task 6: Filters component

**Files:** Create `components/vehicles/vehicle-filters.tsx`.

Client component. Reads current filter values from `useSearchParams()`, renders `Select`s for vehicle type/fuel/condition/transmission/sort and `Input`s (type="number") for price/year min-max plus a text search `Input`, and on change pushes an updated URL via `useRouter().push` with the new search params (preserving unrelated params). Includes a "Clear filters" link resetting to `/vehicles`. Wrapped in a `Sheet` trigger for viewports below `lg`, rendered inline as a sidebar at `lg:` and above — reusing the same `Sheet` pattern already established in `components/layout/header.tsx`.

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add vehicle marketplace filters`.

---

### Task 7: Marketplace page

**Files:** Create `app/vehicles/page.tsx`, `app/vehicles/loading.tsx`.

`page.tsx`: Server Component, `searchParams: Promise<Record<string, string | string[] | undefined>>` (Next 15 async searchParams), maps to `VehicleFilters`, calls `getVehicles(filters)`, renders `VehicleFilters` + a responsive grid of `VehicleCard`s (1 col mobile, 2 col `sm:`, 3 col `lg:`), or an empty state ("No vehicles match your filters" + a link back to `/vehicles` to clear) when the result array is empty.

`loading.tsx`: skeleton grid matching the card grid layout, using `Skeleton`.

Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add vehicle marketplace listing page`.

---

### Task 8: Vehicle detail page

**Files:** Create `app/vehicles/[id]/page.tsx`.

Server Component, `params: Promise<{ id: string }>`, calls `getVehicleById(id)`, calls Next's `notFound()` from `next/navigation` if `null` (Next.js renders the nearest `not-found.tsx` or its default 404). Renders: placeholder visual (same treatment as the card, larger `aspect-video` area), heading, specs grid from `vehicle.specs` plus year/mileage/condition/transmission/fuel, price, then the cost breakdown card built from `estimateLandedCost(vehicle)` with the four line items, the total, an "Estimate" `Badge`, and the exact disclaimer sentence from the spec. Two CTAs at the bottom: `Button asChild` linking to `/source` ("Request this vehicle"), and an `<a>` to `buildWhatsAppLink(...)` ("Ask about this vehicle").

Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: add vehicle detail page with cost breakdown`.

---

### Task 9: Final quality gate

Run `tsc --noEmit`, `npm run lint`, `npm run build` fresh. Start `npm run dev`, fetch `/vehicles`, `/vehicles?vehicleType=suv`, `/vehicles/veh_001`, and `/vehicles/does-not-exist` (expect a 404), confirm expected content/structure and the 404 behavior via HTTP status + rendered markup (same substitute-verification method used for Foundation/Homepage when no browser DevTools tool is available). Check responsive classes present in compiled CSS for the listed breakpoints. Stop the dev server and kill any lingering `next dev` node processes afterward (lesson from Foundation's worktree cleanup). Commit any fixes found, if any.

---

## Self-Review Notes

- **Spec coverage:** §2 mock data → Task 2. §3 data layer → Tasks 1, 3. §4 Marketplace → Tasks 4, 5, 6, 7. §5 Vehicle Detail → Tasks 1 (pricing), 8. §6 Out of scope items confirmed absent from all tasks.
- **Type consistency:** `VehicleFilters` (Task 1) field names match exactly what Task 3's `getVehicles` destructures and what Task 6's filter component will read from `useSearchParams`.
- **Placeholder scan:** no TBD/TODO. Task 2's exact vehicle list is authored directly in the mock file per the spec's deterministic spread rules rather than duplicated verbatim in this plan, since this plan is executed by the same session that wrote it (no subagent handoff) — the spread rules themselves are fully specified above, not vague.
