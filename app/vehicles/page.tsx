import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getVehicles } from "@/lib/data/vehicles";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import type { VehicleFilters as VehicleFiltersType, VehicleSort } from "@/types";

export const metadata: Metadata = {
  title: "Vehicles for Sale — Sourced from China",
  description:
    "Browse sedans, SUVs, pickups and EVs we can source from verified suppliers in China. Filter by type, fuel, condition and year, then request a personalized quote.",
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
  const vehicles = await getVehicles(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Vehicles We Can Source</h1>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">
        A sample of vehicles we can source from verified suppliers in China. Every
        request is individually sourced and verified — these are examples, not live
        inventory.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <Suspense>
          <VehicleFilters />
        </Suspense>

        {vehicles.length === 0 ? (
          <div className="rounded-lg border border-border p-12 text-center">
            <p className="text-body text-foreground">No vehicles match your filters.</p>
            <Link href="/vehicles" className="mt-2 inline-block text-small text-accent underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
