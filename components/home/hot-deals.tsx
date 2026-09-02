import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import type { Vehicle } from "@/types";

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
            Priced to move right now
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
          <Link
            key={vehicle.id}
            href={`/vehicles/${vehicle.id}`}
            className="group block w-64 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md sm:w-72"
          >
            <div className="relative aspect-[3/4] bg-muted">
              <Image
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                sizes="(min-width: 640px) 288px, 256px"
                className="object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--motion-ease)] group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-caption font-medium text-accent-foreground">
                <Flame className="h-3 w-3" aria-hidden="true" />
                Hot Deal
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-h3 font-semibold text-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="mt-1 text-small text-muted-foreground">
                {vehicle.fuelType} · {vehicle.transmission}
              </p>
              <p className="mt-3 text-h3 font-semibold text-foreground">
                ${vehicle.priceUsd.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
