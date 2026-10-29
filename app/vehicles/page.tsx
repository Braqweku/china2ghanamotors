import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getMakes, getVehicles } from "@/lib/data/vehicles";
import { VehicleFilters, VehicleSortSelect } from "@/components/vehicles/vehicle-filters";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import type { VehicleFilters as VehicleFiltersType, VehicleSort } from "@/types";

export const metadata: Metadata = {
  title: "Used Vehicles from China — Available Now",
  description:
    "Browse used Toyota, Honda, BYD, Geely and more, inspected in China and shipped to Ghana. Filter by brand, body type, fuel and year, then request a full quote.",
  alternates: { canonical: "/vehicles" },
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function buildFilters(searchParams: SearchParams): VehicleFiltersType {
  return {
    make: first(searchParams.make),
    query: first(searchParams.query),
    vehicleType: first(searchParams.vehicleType) as VehicleFiltersType["vehicleType"],
    fuelType: first(searchParams.fuelType) as VehicleFiltersType["fuelType"],
    transmission: first(searchParams.transmission) as VehicleFiltersType["transmission"],
    condition: first(searchParams.condition) as VehicleFiltersType["condition"],
    minYear: toNumber(first(searchParams.minYear)),
    maxYear: toNumber(first(searchParams.maxYear)),
    sort: first(searchParams.sort) as VehicleSort | undefined,
  };
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = buildFilters(resolvedSearchParams);
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
              <Link
                href="/vehicles"
                className="mt-2 inline-block text-small font-medium text-foreground underline underline-offset-4"
              >
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
