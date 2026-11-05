import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getMakes, getVehicles } from "@/lib/data/vehicles";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { VehicleFilters, VehicleSortSelect } from "@/components/vehicles/vehicle-filters";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import type { VehicleFilters as VehicleFiltersType, VehicleSort } from "@/types";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vehicles" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/vehicles", locale),
  };
}

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
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("vehicles");
  const filters = buildFilters(await searchParams);
  const [vehicles, makes] = await Promise.all([getVehicles(filters), getMakes()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">{t("intro")}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Suspense>
          <VehicleFilters makes={makes} />
        </Suspense>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-small text-muted-foreground" aria-live="polite">
              {t.rich("count", {
                count: vehicles.length,
                b: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
              })}
            </p>
            <Suspense>
              <VehicleSortSelect />
            </Suspense>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-body text-foreground">{t("none")}</p>
              <Link
                href="/vehicles"
                className="mt-2 inline-block text-small font-medium text-foreground underline underline-offset-4"
              >
                {t("clear")}
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
