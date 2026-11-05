import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Camera, Car } from "lucide-react";
import type { Vehicle } from "@/types";
import { Link } from "@/i18n/navigation";
import { localeTags, type Locale } from "@/lib/i18n/locales";
import { formatMileage, vehicleTitle } from "@/lib/vehicle-format";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
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
            <span aria-hidden="true">{vehicle.images.length}</span>
            <span className="sr-only">{t("vehicles.photos", { count: vehicle.images.length })}</span>
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
          {formatMileage(vehicle.mileageKm, localeTags[locale])} ·{" "}
          {t(`labels.gearbox.${vehicle.transmission}`)} · {t(`labels.fuel.${vehicle.fuelType}`)}
        </p>
      </div>
    </Link>
  );
}
