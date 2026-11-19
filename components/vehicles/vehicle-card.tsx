import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Camera, Car, Fuel, Gauge, Settings2 } from "lucide-react";
import type { Vehicle } from "@/types";
import { Link } from "@/i18n/navigation";
import { localeTags, type Locale } from "@/lib/i18n/locales";
import { formatMileage, vehicleTitle } from "@/lib/vehicle-format";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const image = vehicle.images[0];
  const title = vehicleTitle(vehicle);

  const specs = [
    { icon: Gauge, value: formatMileage(vehicle.mileageKm, localeTags[locale]) },
    { icon: Settings2, value: t(`labels.gearbox.${vehicle.transmission}`) },
    { icon: Fuel, value: t(`labels.fuel.${vehicle.fuelType}`) },
    { icon: Calendar, value: String(vehicle.year) },
  ];

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Partner photos are shown whole, never cropped. */}
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
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-caption font-medium tabular-nums text-white">
            <Camera className="h-3 w-3" aria-hidden="true" />
            <span aria-hidden="true">{vehicle.images.length}</span>
            <span className="sr-only">{t("vehicles.photos", { count: vehicle.images.length })}</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <h3 className="text-body font-medium text-foreground underline-offset-4 group-hover:underline">
          {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.specs.trim && (
          <p className="mt-0.5 line-clamp-1 text-small text-muted-foreground">{vehicle.specs.trim}</p>
        )}
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-small text-foreground/75">
          {specs.map(({ icon: Icon, value }) => (
            <li key={value} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {value}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
