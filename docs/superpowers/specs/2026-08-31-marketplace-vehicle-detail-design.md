# Vehicle Marketplace + Vehicle Detail — Design Spec

Status: Approved. Combines the roadmap's "Vehicle Marketplace" and "Vehicle Detail" sub-projects (a listing page needs a detail page to link to), and folds in "Cost Estimator" onto the detail page, per user decisions during brainstorming.

Builds directly on `docs/design-spec.md` (brand/UX/UI/motion tokens) and the Foundation data layer (`types/`, `lib/data/`, `lib/mock/`).

---

## 1. Framing (carried from `docs/design-spec.md` §1)

Vehicles shown are **sourceable reference examples** ("we can source this for you"), not live dealer inventory — the business is at Phase 1 (assisted imports on request). CTAs read as request/inquiry actions, never "Buy now."

## 2. Mock Data

Expand `lib/mock/vehicles.ts` from 3 to ~18 vehicles, spanning:
- `vehicleType`: sedan, suv, pickup, van, hatchback, truck (at least 2 each)
- `fuelType`: petrol, hybrid, electric, diesel (at least 3 each)
- `condition`: mix of new/used
- `priceUsd`: spread from ~$9,000 to ~$45,000
- `year`: 2021–2024

Real Chinese makes/models already established as the pattern (BYD, Wuling, JAC, etc.) — extend with more real manufacturers (Chery, Geely, Great Wall/Haval, MG, Changan, GAC) rather than inventing fictional brands.

## 3. Data Layer Changes

`types/vehicle.ts` adds:

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

`lib/data/vehicles.ts`'s `getVehicles` signature changes from `(): Promise<Vehicle[]>` to `(filters?: VehicleFilters): Promise<Vehicle[]>` — backward compatible (no argument = current unfiltered behavior). Filtering and sorting happen in-memory over the mock array; `query` matches case-insensitively against `make`+`model`.

New `lib/pricing.ts`:

```ts
export function estimateLandedCost(vehicle: Vehicle): {
  shippingUsd: number;
  inspectionUsd: number;
  clearingUsd: number;
  totalUsd: number;
};
```

Illustrative, clearly-labeled placeholder figures — **not** a real customs/duty calculation (explicit brief requirement): shipping varies by `vehicleType` (sedan/hatchback $1,000; suv/van $1,300; pickup/truck $1,500), inspection is a flat $150, clearing & documentation is a flat $2,000. `totalUsd = priceUsd + shippingUsd + inspectionUsd + clearingUsd`.

## 4. Marketplace Page (`/vehicles`)

Server Component reading `searchParams`, mapping them into `VehicleFilters`, calling `getVehicles(filters)`.

- **Filters** (client component, manipulates URL search params via `useRouter`/`useSearchParams`): vehicle type, fuel type, condition, transmission (selects — new shadcn `select` component), price min/max, year min/max (new shadcn `input` component, type="number"), text search, sort. Sidebar on desktop (`lg:` breakpoint), collapsible `Sheet` trigger on mobile (reusing the pattern from Header).
- **Vehicle card**: placeholder visual (flat muted rectangle with a centered Lucide `Car` icon — an honest "no photo yet" treatment, not a fake stock photo), make/model/year, fuel + transmission + mileage, price, availability badge, "Request this vehicle" → `/vehicles/[id]`.
- **Empty state**: no results message + "Clear filters" action.
- **Loading state**: skeleton grid (reuses `Skeleton`).

## 5. Vehicle Detail Page (`/vehicles/[id]`)

Server Component calling `getVehicleById(id)`; `notFound()` (Next.js) if `null`.

- Same placeholder visual treatment as the card, larger, single area (no multi-image carousel — nothing to carousel through yet).
- Specs table from `vehicle.specs` plus year/mileage/condition/transmission/fuel.
- **Cost breakdown**, using `estimateLandedCost`: Vehicle Price, Estimated Shipping, Inspection Fee, Estimated Clearing & Documentation, then **Estimated Landed Cost** total — each line labeled, an "Estimate" marker, and this disclaimer verbatim: *"This is an estimate. Final costs depend on actual quotations, shipping, exchange rates, customs and applicable charges."*
- **Two CTAs**: "Request this vehicle" → `/source` (matches the Homepage CTA's existing target — will 404 until the Sourcing wizard sub-project ships, same accepted pattern as today), and "Ask about this vehicle" → WhatsApp deep link via the existing `buildWhatsAppLink` helper, prefilled: *"I'm interested in the [Year Make Model] listed by China2Ghana Motors."* (works today).

## 6. Out of Scope

Wishlist/save-for-later, image galleries (no real photos), supplier profile pages, related-vehicles recommendations. Not fabricated: no fake reviews, no fake "X people viewing this," no fake urgency messaging.
