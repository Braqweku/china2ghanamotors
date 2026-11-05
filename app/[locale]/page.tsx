import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { Hero } from "@/components/home/hero";
import { TopBrands } from "@/components/home/top-brands";
import { HotDeals } from "@/components/home/hot-deals";
import { TrustLayer } from "@/components/home/trust-layer";
import { Journey } from "@/components/home/journey";
import { CtaBand } from "@/components/home/cta-band";
import { getVehicles } from "@/lib/data/vehicles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor("/", locale) };
}

const DEAL_VEHICLE_IDS = [
  "veh_101",
  "veh_166",
  "veh_157",
  "veh_158",
  "veh_163",
  "veh_115",
  "veh_145",
];

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const vehicles = await getVehicles();
  const dealVehicles = DEAL_VEHICLE_IDS.map((id) =>
    vehicles.find((v) => v.id === id)
  ).filter((v): v is NonNullable<typeof v> => v !== undefined);

  return (
    <>
      <Hero />
      <TopBrands />
      <HotDeals vehicles={dealVehicles} />
      <TrustLayer />
      <Journey />
      <CtaBand />
    </>
  );
}
