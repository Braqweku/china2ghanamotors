# Redesign Round 1 (Foundation + Vehicles) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the vehicle experience look like a professional marketplace and show every vehicle photo uncropped.

**Architecture:** Pure, unit-tested query/format helpers (`lib/vehicle-query.ts`, `lib/vehicle-format.ts`) feed server components. One reusable `VehicleCard` (4:3, `object-contain`) is used everywhere. Gallery and filters are client components. Cover photos are fixed once in the catalog data.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui (radix), lucide-react, Node 26 built-in test runner (native TS type stripping).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-10-29-vehicles-redesign-design.md`.
- Every vehicle photo frame is 4:3 landscape with `object-contain` on `bg-muted`. Never `object-cover` on vehicle photos.
- Follow `CLAUDE.md`: no gradients, glows, extra badges/pills, decorative shadows; one shadow level (`shadow-sm`); visible focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
- Use existing tokens only (`text-h1/h2/h3/body/small/caption`, `bg-muted`, `border-border`, etc.). No new colours.
- No Chinese text anywhere. No prices rendered.
- Labels shown to users are title case via `lib/vehicle-format.ts` maps (e.g. `SUV`, `Automatic`, `Hybrid`).

---

### Task 1: Landscape cover photos

**Files:**
- Modify: `lib/mock/vehicles.ts` (image array order only)
- Script (not committed): `<scratchpad>/fix_covers.py`

**Interfaces:**
- Produces: every `mockVehicles[i].images[0]` is a landscape (width ≥ height) image.

- [ ] **Step 1: Write the script**

```python
import re, sys
from PIL import Image
repo = sys.argv[1]
path = f"{repo}/lib/mock/vehicles.ts"
src = open(path, encoding="utf-8").read()

def dims(p):
    with Image.open(f"{repo}/public{p}") as im:
        return im.size

def fix(m):
    paths = re.findall(r'"(/vehicles/[^"]+)"', m.group(0))
    w, h = dims(paths[0])
    if w >= h:
        return m.group(0)
    for i, p in enumerate(paths):
        pw, ph = dims(p)
        if pw > ph:
            paths.insert(0, paths.pop(i))
            print("cover swapped:", paths[0])
            break
    body = "".join(f'      "{p}",\n' for p in paths)
    return f"images: [\n{body}    ],"

src = re.sub(r"images: \[\n(?:      \"[^\"]+\",\n)+    \],", fix, src)
open(path, "w", encoding="utf-8", newline="\n").write(src)
bad = []
for block in re.findall(r"images: \[\n      \"([^\"]+)\"", src):
    w, h = dims(block)
    if w < h:
        bad.append(block)
print("portrait covers remaining:", bad)
```

- [ ] **Step 2: Run it**

Run: `python -I fix_covers.py "c:/src/china2ghana motors"`
Expected: a few `cover swapped:` lines, then `portrait covers remaining: []`.

- [ ] **Step 3: Commit**

```bash
git add lib/mock/vehicles.ts
git commit -m "fix: use landscape photos as vehicle covers"
```

---

### Task 2: Query and format helpers (TDD)

**Files:**
- Create: `lib/vehicle-query.ts`, `lib/vehicle-format.ts`, `tests/vehicle-query.test.ts`, `tests/vehicle-format.test.ts`
- Modify: `types/vehicle.ts`, `lib/data/vehicles.ts`, `package.json` (scripts), `tsconfig.json` (exclude)

**Interfaces:**
- Produces:
  - `type VehicleSort = "recent" | "year-desc" | "mileage-asc"`; `VehicleFilters.make?: string`
  - `filterVehicles(vehicles: Vehicle[], filters?: VehicleFilters): Vehicle[]`
  - `sortVehicles(vehicles: Vehicle[], sort?: VehicleSort): Vehicle[]`
  - `listMakes(vehicles: Vehicle[]): string[]`
  - `similarVehicles(vehicles: Vehicle[], current: Vehicle, limit?: number): Vehicle[]`
  - `vehicleTypeLabels`, `fuelTypeLabels`, `transmissionLabels` (Record maps), `vehicleTitle(v)`, `formatMileage(km)`, `specLabel(key)`
  - `getMakes(): Promise<string[]>` in `lib/data/vehicles.ts`

- [ ] **Step 1: Test runner setup**

`package.json` scripts — add: `"test": "node --test \"tests/**/*.test.ts\""`
`tsconfig.json` — `"exclude": ["node_modules", "tests"]`

- [ ] **Step 2: Types**

In `types/vehicle.ts` replace `export type VehicleSort = "year-desc";` with:

```ts
export type VehicleSort = "recent" | "year-desc" | "mileage-asc";
```

and add `make?: string;` as the first field of `VehicleFilters`.

- [ ] **Step 3: Write failing tests**

`tests/vehicle-query.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { filterVehicles, listMakes, similarVehicles, sortVehicles } from "../lib/vehicle-query.ts";
import type { Vehicle } from "../types/vehicle.ts";

function v(id: string, over: Partial<Vehicle> = {}): Vehicle {
  return {
    id, make: "Toyota", model: "Camry", year: 2020, vehicleType: "sedan", fuelType: "petrol",
    transmission: "automatic", mileageKm: 50000, condition: "used", images: [],
    availability: "available", supplierId: "sup_006", specs: { trim: "2.0G Luxury" }, ...over,
  };
}
const list = [
  v("a", { make: "Toyota", year: 2019, mileageKm: 90000 }),
  v("b", { make: "BYD", model: "Seagull", year: 2025, mileageKm: 10000, vehicleType: "hatchback", fuelType: "electric" }),
  v("c", { make: "Honda", model: "CR-V", year: 2021, mileageKm: 60000, vehicleType: "suv" }),
  v("d", { make: "Toyota", model: "Highlander", year: 2021, mileageKm: 70000, vehicleType: "suv", specs: { trim: "Elite" } }),
];

test("filters by make", () => {
  assert.deepEqual(filterVehicles(list, { make: "Toyota" }).map((x) => x.id), ["a", "d"]);
});
test("query matches make, model and trim", () => {
  assert.deepEqual(filterVehicles(list, { query: "seagull" }).map((x) => x.id), ["b"]);
  assert.deepEqual(filterVehicles(list, { query: "elite" }).map((x) => x.id), ["d"]);
});
test("combines filters", () => {
  assert.deepEqual(filterVehicles(list, { vehicleType: "suv", minYear: 2021, make: "Honda" }).map((x) => x.id), ["c"]);
});
test("sorts", () => {
  assert.deepEqual(sortVehicles(list, "mileage-asc").map((x) => x.id), ["b", "c", "d", "a"]);
  assert.deepEqual(sortVehicles(list, "year-desc").map((x) => x.id)[0], "b");
  assert.deepEqual(sortVehicles(list, "recent").map((x) => x.id), ["a", "b", "c", "d"]);
  assert.deepEqual(sortVehicles(list).map((x) => x.id), ["a", "b", "c", "d"]);
});
test("sort does not mutate input", () => {
  sortVehicles(list, "mileage-asc");
  assert.equal(list[0].id, "a");
});
test("lists makes alphabetically, unique", () => {
  assert.deepEqual(listMakes(list), ["BYD", "Honda", "Toyota"]);
});
test("similar vehicles share body type and exclude current", () => {
  assert.deepEqual(similarVehicles(list, list[2]).map((x) => x.id), ["d"]);
  assert.equal(similarVehicles(list, list[0], 0).length, 0);
});
```

`tests/vehicle-format.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMileage, fuelTypeLabels, specLabel, transmissionLabels, vehicleTitle, vehicleTypeLabels } from "../lib/vehicle-format.ts";

test("title", () => assert.equal(vehicleTitle({ year: 2023, make: "Toyota", model: "Sienna" }), "2023 Toyota Sienna"));
test("mileage", () => {
  assert.equal(formatMileage(57000), "57,000 km");
  assert.equal(formatMileage(0), "0 km");
});
test("labels", () => {
  assert.equal(vehicleTypeLabels.suv, "SUV");
  assert.equal(vehicleTypeLabels.mpv, "MPV");
  assert.equal(fuelTypeLabels.electric, "Electric");
  assert.equal(transmissionLabels.manual, "Manual");
});
test("spec label sentence case", () => {
  assert.equal(specLabel("first registered"), "First registered");
  assert.equal(specLabel("range"), "Range");
});
```

- [ ] **Step 4: Run tests — expect failure**

Run: `npm test`
Expected: FAIL — cannot find module `../lib/vehicle-query.ts`.

- [ ] **Step 5: Implement**

`lib/vehicle-query.ts`:

```ts
import type { Vehicle, VehicleFilters, VehicleSort } from "@/types";

export function sortVehicles(vehicles: Vehicle[], sort?: VehicleSort): Vehicle[] {
  const result = [...vehicles];
  if (sort === "year-desc") result.sort((a, b) => b.year - a.year);
  if (sort === "mileage-asc") result.sort((a, b) => a.mileageKm - b.mileageKm);
  return result;
}

export function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters = {}): Vehicle[] {
  let results = vehicles;
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    results = results.filter((v) =>
      `${v.make} ${v.model} ${v.specs.trim ?? ""}`.toLowerCase().includes(q)
    );
  }
  if (filters.make) results = results.filter((v) => v.make === filters.make);
  if (filters.vehicleType) results = results.filter((v) => v.vehicleType === filters.vehicleType);
  if (filters.fuelType) results = results.filter((v) => v.fuelType === filters.fuelType);
  if (filters.transmission) results = results.filter((v) => v.transmission === filters.transmission);
  if (filters.condition) results = results.filter((v) => v.condition === filters.condition);
  if (filters.minYear !== undefined) results = results.filter((v) => v.year >= filters.minYear!);
  if (filters.maxYear !== undefined) results = results.filter((v) => v.year <= filters.maxYear!);
  return sortVehicles(results, filters.sort);
}

export function listMakes(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map((v) => v.make))].sort((a, b) => a.localeCompare(b));
}

export function similarVehicles(vehicles: Vehicle[], current: Vehicle, limit = 4): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== current.id && v.vehicleType === current.vehicleType)
    .slice(0, limit);
}
```

`lib/vehicle-format.ts`:

```ts
import type { FuelType, Transmission, Vehicle, VehicleType } from "@/types";

export const vehicleTypeLabels: Record<VehicleType, string> = {
  sedan: "Sedan", suv: "SUV", mpv: "MPV", pickup: "Pickup", van: "Van", hatchback: "Hatchback", truck: "Truck",
};
export const fuelTypeLabels: Record<FuelType, string> = {
  petrol: "Petrol", hybrid: "Hybrid", electric: "Electric", diesel: "Diesel",
};
export const transmissionLabels: Record<Transmission, string> = {
  automatic: "Automatic", manual: "Manual",
};

export function vehicleTitle(v: Pick<Vehicle, "year" | "make" | "model">): string {
  return `${v.year} ${v.make} ${v.model}`;
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString("en-US")} km`;
}

export function specLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}
```

Replace `lib/data/vehicles.ts` with:

```ts
import type { Vehicle, VehicleFilters } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";
import { filterVehicles, listMakes } from "@/lib/vehicle-query";

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  return filterVehicles(mockVehicles, filters);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}

export async function getMakes(): Promise<string[]> {
  return listMakes(mockVehicles);
}
```

- [ ] **Step 6: Run tests — expect pass; type-check**

Run: `npm test` → all tests pass. Run: `npx tsc --noEmit` → no errors (if `vehicle-filters.tsx` errors on `"year-desc"` select value, that is fixed in Task 4; it should still compile since the value is a string).

- [ ] **Step 7: Commit**

```bash
git add lib/vehicle-query.ts lib/vehicle-format.ts lib/data/vehicles.ts types/vehicle.ts tests package.json tsconfig.json
git commit -m "feat: tested vehicle query and format helpers, brand filter and new sorts"
```

---

### Task 3: VehicleCard + homepage hot deals

**Files:**
- Modify: `components/vehicles/vehicle-card.tsx` (full replace), `components/home/hot-deals.tsx`

**Interfaces:**
- Consumes: `vehicleTitle`, `formatMileage`, `fuelTypeLabels`, `transmissionLabels` (Task 2)
- Produces: `VehicleCard({ vehicle, priority? }: { vehicle: Vehicle; priority?: boolean })`

- [ ] **Step 1: Replace `components/vehicles/vehicle-card.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Camera, Car } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatMileage, fuelTypeLabels, transmissionLabels, vehicleTitle } from "@/lib/vehicle-format";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const image = vehicle.images[0];
  const title = vehicleTitle(vehicle);

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Car className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        {vehicle.images.length > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-foreground/75 px-1.5 py-0.5 text-caption font-medium tabular-nums text-background">
            <Camera className="h-3 w-3" aria-hidden="true" />
            {vehicle.images.length}
            <span className="sr-only"> photos</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-body font-semibold text-foreground underline-offset-4 group-hover:underline">
          {title}
        </h3>
        {vehicle.specs.trim && (
          <p className="mt-0.5 line-clamp-1 text-small text-muted-foreground">{vehicle.specs.trim}</p>
        )}
        <p className="mt-3 text-small text-foreground/80">
          {formatMileage(vehicle.mileageKm)} · {transmissionLabels[vehicle.transmission]} ·{" "}
          {fuelTypeLabels[vehicle.fuelType]}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Hot deals uses the card**

In `components/home/hot-deals.tsx`: remove the `Image` import; import `VehicleCard`; replace the whole `{vehicles.map((vehicle) => ( <Link ...> ... </Link> ))}` block with:

```tsx
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-72 shrink-0 snap-start sm:w-80">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
```

Change heading text "High-demand vehicles, ready to source" → "Popular vehicles available now".

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx next lint` → clean.

- [ ] **Step 4: Commit**

```bash
git add components/vehicles/vehicle-card.tsx components/home/hot-deals.tsx
git commit -m "feat: landscape uncropped vehicle card with spec row and photo count"
```

---

### Task 4: Vehicle listing page + filters

**Files:**
- Modify: `components/vehicles/vehicle-filters.tsx` (full replace), `app/vehicles/page.tsx`

**Interfaces:**
- Consumes: `getMakes`, `getVehicles` (Task 2), labels maps (Task 2), `VehicleCard` (Task 3)
- Produces: `VehicleFilters({ makes }: { makes: string[] })`, `VehicleSortSelect()`

- [ ] **Step 1: Replace `components/vehicles/vehicle-filters.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import type { FuelType, Transmission, VehicleType } from "@/types";
import { fuelTypeLabels, transmissionLabels, vehicleTypeLabels } from "@/lib/vehicle-format";

const vehicleTypes = Object.keys(vehicleTypeLabels) as VehicleType[];
const fuelTypes = Object.keys(fuelTypeLabels) as FuelType[];
const transmissions = Object.keys(transmissionLabels) as Transmission[];

function useUpdateParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return { updateParam, searchParams, pathname };
}

function FilterSelect({
  id, label, param, allLabel, options,
}: {
  id: string; label: string; param: string; allLabel: string; options: { value: string; label: string }[];
}) {
  const { updateParam, searchParams } = useUpdateParam();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-small text-muted-foreground">{label}</Label>
      <Select value={searchParams.get(param) ?? "all"} onValueChange={(v) => updateParam(param, v)}>
        <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterFields({ makes, idPrefix }: { makes: string[]; idPrefix: string }) {
  const { updateParam, searchParams, pathname } = useUpdateParam();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-query`} className="text-small text-muted-foreground">Search</Label>
        <Input
          id={`${idPrefix}-query`}
          type="search"
          placeholder="Make, model or trim"
          defaultValue={searchParams.get("query") ?? ""}
          onKeyDown={(e) => { if (e.key === "Enter") updateParam("query", e.currentTarget.value); }}
          onBlur={(e) => updateParam("query", e.target.value)}
        />
      </div>
      <FilterSelect id={`${idPrefix}-make`} label="Brand" param="make" allLabel="All brands"
        options={makes.map((m) => ({ value: m, label: m }))} />
      <FilterSelect id={`${idPrefix}-type`} label="Body type" param="vehicleType" allLabel="All body types"
        options={vehicleTypes.map((t) => ({ value: t, label: vehicleTypeLabels[t] }))} />
      <FilterSelect id={`${idPrefix}-fuel`} label="Fuel" param="fuelType" allLabel="All fuel types"
        options={fuelTypes.map((t) => ({ value: t, label: fuelTypeLabels[t] }))} />
      <FilterSelect id={`${idPrefix}-gearbox`} label="Gearbox" param="transmission" allLabel="Any gearbox"
        options={transmissions.map((t) => ({ value: t, label: transmissionLabels[t] }))} />
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-small text-muted-foreground">Year</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" inputMode="numeric" aria-label="Minimum year" placeholder="From"
            defaultValue={searchParams.get("minYear") ?? ""} onBlur={(e) => updateParam("minYear", e.target.value)} />
          <Input type="number" inputMode="numeric" aria-label="Maximum year" placeholder="To"
            defaultValue={searchParams.get("maxYear") ?? ""} onBlur={(e) => updateParam("maxYear", e.target.value)} />
        </div>
      </fieldset>
      <Button variant="outline" asChild>
        <Link href={pathname}>Clear filters</Link>
      </Button>
    </div>
  );
}

export function VehicleSortSelect() {
  const { updateParam, searchParams } = useUpdateParam();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="vehicle-sort" className="text-small text-muted-foreground">Sort</Label>
      <Select value={searchParams.get("sort") ?? "recent"} onValueChange={(v) => updateParam("sort", v === "recent" ? "" : v)}>
        <SelectTrigger id="vehicle-sort" className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="recent">Recently added</SelectItem>
          <SelectItem value="year-desc">Newest year</SelectItem>
          <SelectItem value="mileage-asc">Lowest mileage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function VehicleFilters({ makes }: { makes: string[] }) {
  return (
    <>
      <div className="hidden lg:block">
        <FilterFields makes={makes} idPrefix="desktop" />
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
              <SheetTitle>Filters</SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FilterFields makes={makes} idPrefix="mobile" />
            </div>
            <div className="shrink-0 border-t border-border p-4">
              <SheetClose asChild>
                <Button className="w-full" size="lg">Show results</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Update `app/vehicles/page.tsx`**

Imports: `import { VehicleFilters, VehicleSortSelect } from "@/components/vehicles/vehicle-filters";` and `import { getMakes, getVehicles } from "@/lib/data/vehicles";`.

Metadata:

```ts
export const metadata: Metadata = {
  title: "Used Vehicles from China — Available Now",
  description:
    "Browse used Toyota, Honda, BYD, Geely and more, inspected in China and shipped to Ghana. Filter by brand, body type, fuel and year, then request a full quote.",
  alternates: { canonical: "/vehicles" },
};
```

In `buildFilters` add `make: first(searchParams.make),` as the first property.

Replace the component body after `const filters = buildFilters(resolvedSearchParams);` with:

```tsx
  const [vehicles, makes] = await Promise.all([getVehicles(filters), getMakes()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Vehicles available now</h1>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">
        Used vehicles from our partner in China, inspected before purchase and shipped to
        Ghana. Choose a vehicle and we&apos;ll send a full quote including shipping and clearing.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Suspense>
          <VehicleFilters makes={makes} />
        </Suspense>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-small text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground">{vehicles.length}</span>{" "}
              {vehicles.length === 1 ? "vehicle" : "vehicles"}
            </p>
            <Suspense>
              <VehicleSortSelect />
            </Suspense>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-body text-foreground">No vehicles match your filters.</p>
              <Link href="/vehicles" className="mt-2 inline-block text-small font-medium text-foreground underline underline-offset-4">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx next lint && npm test` → clean.

- [ ] **Step 4: Commit**

```bash
git add components/vehicles/vehicle-filters.tsx app/vehicles/page.tsx
git commit -m "feat: vehicle listing with brand filter, result count and sort toolbar"
```

---

### Task 5: Vehicle gallery

**Files:**
- Modify: `components/vehicles/vehicle-gallery.tsx` (full replace)

**Interfaces:**
- Produces: `VehicleGallery({ images, alt }: { images: string[]; alt: string })` (unchanged signature)

- [ ] **Step 1: Replace the file**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navButton =
  "absolute top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setActive((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  if (count === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted">
        <Car className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} photos`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt}, photo ${active + 1} of ${count}`}
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          priority={active === 0}
          className="object-contain"
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={cn(navButton, "left-3")}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={cn(navButton, "right-3")}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded bg-foreground/75 px-2 py-0.5 text-caption font-medium tabular-nums text-background"
            >
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div ref={thumbsRef} className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              data-index={index}
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-[border-color,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                index === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-contain" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit && npx next lint` → clean.

- [ ] **Step 3: Commit**

```bash
git add components/vehicles/vehicle-gallery.tsx
git commit -m "feat: uncropped vehicle gallery with arrows, keyboard, swipe and counter"
```

---

### Task 6: Vehicle detail page

**Files:**
- Modify: `app/vehicles/[id]/page.tsx` (replace the default export body; keep `generateStaticParams` and `generateMetadata`)

**Interfaces:**
- Consumes: `similarVehicles` (Task 2), format helpers (Task 2), `VehicleCard` (Task 3), `VehicleGallery` (Task 5)

- [ ] **Step 1: Imports**

Replace the import block with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, SearchCheck, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById, getVehicles } from "@/lib/data/vehicles";
import { similarVehicles } from "@/lib/vehicle-query";
import {
  formatMileage, fuelTypeLabels, specLabel, transmissionLabels, vehicleTitle, vehicleTypeLabels,
} from "@/lib/vehicle-format";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";
```

- [ ] **Step 2: Replace `VehicleDetailPage`**

```tsx
export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const vehicleName = vehicleTitle(vehicle);
  const vehicleUrl = `${siteConfig.url}/vehicles/${vehicle.id}`;
  const whatsappHref = buildWhatsAppLink(
    `I'm interested in the ${vehicleName} (${vehicle.id}) listed by ${siteConfig.name}.`
  );
  const similar = similarVehicles(await getVehicles(), vehicle);
  const summary = `${formatMileage(vehicle.mileageKm)} · ${transmissionLabels[vehicle.transmission]} · ${fuelTypeLabels[vehicle.fuelType]}`;

  const facts = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: formatMileage(vehicle.mileageKm) },
    { label: "Fuel", value: fuelTypeLabels[vehicle.fuelType] },
    { label: "Gearbox", value: transmissionLabels[vehicle.transmission] },
    { label: "Body type", value: vehicleTypeLabels[vehicle.vehicleType] },
    ...Object.entries(vehicle.specs)
      .filter(([key]) => key !== "trim")
      .map(([key, value]) => ({ label: specLabel(key), value })),
  ];

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleName,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.mileageKm, unitCode: "KMT" },
    itemCondition:
      vehicle.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    image: vehicle.images.map((src) => `${siteConfig.url}${src}`),
    url: vehicleUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Vehicles", item: `${siteConfig.url}/vehicles` },
      { "@type": "ListItem", position: 3, name: vehicleName, item: vehicleUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
        <ol className="flex min-w-0 items-center gap-1.5">
          <li><Link href="/vehicles" className="hover:text-foreground">Vehicles</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate text-foreground">{vehicleName}</li>
        </ol>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0">
          <VehicleGallery images={vehicle.images} alt={vehicleName} />

          <section className="mt-10" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-h3 font-semibold text-foreground">Specifications</h2>
            <dl className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 border-b border-border py-3">
                  <dt className="text-small text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right text-small font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-6">
            <h1 className="text-h2 font-semibold text-foreground">{vehicleName}</h1>
            {vehicle.specs.trim && <p className="mt-1 text-body text-muted-foreground">{vehicle.specs.trim}</p>}
            <p className="mt-4 text-small text-foreground/80">{summary}</p>

            <div className="mt-6 hidden flex-col gap-3 lg:flex">
              <Button asChild size="lg"><Link href="/source">Request this vehicle</Link></Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
              </Button>
            </div>

            <Separator className="my-6" />

            <ul className="space-y-3 text-small text-muted-foreground">
              <li className="flex gap-3"><SearchCheck className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />Inspected in China before purchase</li>
              <li className="flex gap-3"><Ship className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />Shipped and cleared to Ghana</li>
              <li className="flex gap-3"><MessageCircle className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />Your quote includes shipping, inspection and clearing</li>
            </ul>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-h3 font-semibold text-foreground">Similar vehicles</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background p-4 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-3">
          <Button asChild className="flex-1"><Link href="/source">Request this vehicle</Link></Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit && npx next lint` → clean.

- [ ] **Step 4: Commit**

```bash
git add "app/vehicles/[id]/page.tsx"
git commit -m "feat: vehicle detail layout with spec table, action panel and similar vehicles"
```

---

### Task 7: Foundation touches — header, footer, hero frame

**Files:**
- Modify: `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/home/hero-slideshow.tsx`, `components/home/hero.tsx`

- [ ] **Step 1: Header**

Reorder `navLinks` to: Vehicles (`/vehicles`, Car), EV (`/ev`, Zap), Fleet (`/fleet`, Building2), Source (`/source`, label "Source a Vehicle", Search), Track (`/track`, MapPin), Insights (`/insights`, BookOpen).

Desktop CTA — replace the `<Button asChild><a href={whatsappHref} ...>...</a></Button>` block with:

```tsx
          <Button asChild>
            <Link href="/source">Request a vehicle</Link>
          </Button>
```

Mobile sheet footer — replace its contents with:

```tsx
            <div className="flex flex-col gap-2 border-t border-border p-4">
              <SheetClose asChild>
                <Button asChild className="w-full"><Link href="/source">Request a vehicle</Link></Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
                </Button>
              </SheetClose>
            </div>
```

Nav links get a focus ring: add `rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` to the desktop link className.

- [ ] **Step 2: Footer**

In `components/layout/footer.tsx` change `<footer className="border-t border-border bg-background">` to `<footer className="border-t border-border bg-muted/40">`.

- [ ] **Step 3: Hero frame (no cropping)**

In `components/home/hero-slideshow.tsx`:
- `aspect-[3/4]` → `aspect-[4/3]` on the frame div.
- Image className becomes `"object-contain"` (remove the `cn(...)` with `object-cover` and the `animate-[hero-kenburns...]` class).
- `sizes` → `"(min-width: 1024px) 600px, 100vw"`.

In `components/home/hero.tsx` change the slideshow wrapper `max-w-sm` → `max-w-xl`.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx next lint && npm test && npx next build` → all pass; build lists 70 `/vehicles/[id]` paths.

- [ ] **Step 5: Commit**

```bash
git add components/layout/header.tsx components/layout/footer.tsx components/home/hero-slideshow.tsx components/home/hero.tsx
git commit -m "feat: header CTA, footer surface and uncropped hero frame"
```

---

### Task 8: Visual QA and ship

- [ ] **Step 1:** Run `npx next start -p 3123` (after build). Using an available browser skill, screenshot `/`, `/vehicles`, `/vehicles/veh_101`, `/vehicles/veh_112` at 390px, 768px and 1280px widths.
- [ ] **Step 2:** Check: no photo cropped (whole car visible in every card and gallery), no horizontal page scroll at 390px, mobile bottom bar does not cover content, filters sheet opens on mobile, keyboard focus visible on cards and gallery controls. Fix any issue found, re-run Task 7 Step 4.
- [ ] **Step 3:** Stop the server, `git push origin master`, then poll `https://www.china2ghana-motors.com/vehicles` until the new heading "Vehicles available now" is served.
