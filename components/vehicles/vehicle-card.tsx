import Link from "next/link";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        <Car className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h3 font-semibold text-foreground">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Badge variant={vehicle.availability === "sold" ? "secondary" : "default"}>
            {vehicle.availability === "sold"
              ? "Sold"
              : vehicle.availability === "available"
                ? "Available"
                : "Sourcing"}
          </Badge>
        </div>
        <p className="mt-1 text-small text-muted-foreground">
          {vehicle.fuelType} · {vehicle.transmission} · {vehicle.mileageKm.toLocaleString()} km
        </p>
        <p className="mt-3 text-h3 font-semibold text-foreground">
          ${vehicle.priceUsd.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
