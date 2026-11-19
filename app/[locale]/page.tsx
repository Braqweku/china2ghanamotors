import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { Hero } from "@/components/home/hero";
import { VehicleTypes } from "@/components/home/vehicle-types";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { Services } from "@/components/home/services";
import { BrandsGrid } from "@/components/home/brands-grid";
import { AboutBand } from "@/components/home/about-band";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaBand } from "@/components/home/cta-band";
import { PhotoBand } from "@/components/site/photo-band";
import { getVehicles } from "@/lib/data/vehicles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor("/", locale) };
}

const FEATURED_VEHICLE_IDS = ["veh_101", "veh_166", "veh_157", "veh_158", "veh_163", "veh_115"];

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const vehicles = await getVehicles();
  const featured = FEATURED_VEHICLE_IDS.map((id) => vehicles.find((v) => v.id === id)).filter(
    (v): v is NonNullable<typeof v> => v !== undefined
  );

  return (
    <>
      <Hero />
      <VehicleTypes />
      <FeaturedVehicles vehicles={featured} />
      <Services />
      <PhotoBand src="/stock/band-car-carrier.jpg" alt={t("bandAlt")} className="h-[360px] sm:h-[480px] lg:h-[560px]" />
      <BrandsGrid />
      <AboutBand />
      <HowItWorks />
      <CtaBand />
    </>
  );
}
