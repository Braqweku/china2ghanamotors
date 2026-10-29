import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { Vehicle } from "@/types";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

export function HotDeals({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-label font-medium uppercase tracking-wide text-accent">
            <Flame className="h-4 w-4" aria-hidden="true" />
            Hot deals
          </p>
          <h2 className="mt-2 text-h2 font-semibold text-foreground">
            Popular vehicles available now
          </h2>
        </div>
        <Link
          href="/vehicles"
          className="group flex items-center gap-1 text-small font-medium text-foreground hover:text-accent"
        >
          View all vehicles
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-72 shrink-0 snap-start sm:w-80">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </section>
  );
}
