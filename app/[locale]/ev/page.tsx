import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getVehicles } from "@/lib/data/vehicles";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { PageHeader } from "@/components/layout/page-header";
import type { Vehicle } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ev" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/ev", locale),
  };
}

const facts = ["range", "charging", "plugin", "importing"] as const;

function VehicleSection({ id, title, vehicles }: { id: string; title: string; vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;
  return (
    <section className="mt-14" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-h2 font-semibold text-foreground">
        {title} <span className="font-normal text-muted-foreground">({vehicles.length})</span>
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}

export default async function EvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ev");
  const [electric, hybrid] = await Promise.all([
    getVehicles({ fuelType: "electric" }),
    getVehicles({ fuelType: "hybrid" }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={t("title")} intro={t("intro")} />

      <dl className="mt-8 grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
        {facts.map((fact) => (
          <div key={fact} className="border-b border-border py-5">
            <dt className="text-body font-semibold text-foreground">{t(`${fact}Term`)}</dt>
            <dd className="mt-1 text-small text-muted-foreground">{t(`${fact}Detail`)}</dd>
          </div>
        ))}
      </dl>

      <VehicleSection id="electric" title={t("electric")} vehicles={electric} />
      <VehicleSection id="hybrid" title={t("hybrid")} vehicles={hybrid} />
    </div>
  );
}
