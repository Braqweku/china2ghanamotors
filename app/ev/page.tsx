import type { Metadata } from "next";
import { getVehicles } from "@/lib/data/vehicles";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { PageHeader } from "@/components/layout/page-header";
import type { Vehicle } from "@/types";

export const metadata: Metadata = {
  title: "Electric & Hybrid Vehicles from China",
  description:
    "Used electric and hybrid vehicles available now from China — BYD, Toyota, Geely and more, inspected and shipped to Ghana.",
  alternates: { canonical: "/ev" },
};

const facts = [
  {
    term: "Range and battery",
    detail:
      "Each listing shows the manufacturer's range where we have it. Real-world range is usually lower, especially with air conditioning in Ghana's heat.",
  },
  {
    term: "Charging",
    detail:
      "Electric vehicles charge from a standard home socket overnight. Hybrids charge themselves while driving and need no charging at all.",
  },
  {
    term: "Plug-in hybrids",
    detail:
      "Plug-in hybrids drive short distances on electric power, then switch to petrol, so you are never stuck without a charger.",
  },
  {
    term: "Importing",
    detail:
      "Electric and hybrid vehicles go through the same inspection, shipping and clearing as any other vehicle we source.",
  },
];

function VehicleSection({ title, vehicles }: { title: string; vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;
  return (
    <section className="mt-14" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`} className="text-h2 font-semibold text-foreground">
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

export default async function EvPage() {
  const [electric, hybrid] = await Promise.all([
    getVehicles({ fuelType: "electric" }),
    getVehicles({ fuelType: "hybrid" }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Electric and hybrid vehicles"
        intro="Used electric and hybrid vehicles available now from our partner in China, inspected before purchase and shipped to Ghana."
      />

      <dl className="mt-8 grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
        {facts.map((fact) => (
          <div key={fact.term} className="border-b border-border py-5">
            <dt className="text-body font-semibold text-foreground">{fact.term}</dt>
            <dd className="mt-1 text-small text-muted-foreground">{fact.detail}</dd>
          </div>
        ))}
      </dl>

      <VehicleSection title="Electric" vehicles={electric} />
      <VehicleSection title="Hybrid" vehicles={hybrid} />
    </div>
  );
}
