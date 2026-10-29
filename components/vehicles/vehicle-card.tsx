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
