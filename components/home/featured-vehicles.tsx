import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

export function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const t = useTranslations("home");
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <SectionHeading align="center" label={t("featuredLabel")} title={t("featuredTitle")} />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/vehicles">{t("dealsViewAll")}</Link>
        </Button>
      </div>
    </section>
  );
}
