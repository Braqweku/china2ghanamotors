import { Battery, Zap, Gauge, FileCheck } from "lucide-react";
import { getVehicles } from "@/lib/data/vehicles";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

const infoCards = [
  {
    icon: Battery,
    title: "Range & Battery",
    copy: "Electric vehicles we can source vary in battery capacity and range depending on the model — check each vehicle's specifications for the manufacturer's figures.",
  },
  {
    icon: Zap,
    title: "Charging",
    copy: "Most electric and plug-in hybrid vehicles support standard home charging, with faster charging available on select models.",
  },
  {
    icon: Gauge,
    title: "Efficiency",
    copy: "Hybrid vehicles combine a combustion engine with an electric motor for improved fuel efficiency without requiring charging infrastructure.",
  },
  {
    icon: FileCheck,
    title: "Import Considerations",
    copy: "Electric and hybrid vehicles are subject to the same sourcing, verification, shipping and clearing process as any other vehicle we source.",
  },
];

export default async function EvPage() {
  const [electric, hybrid] = await Promise.all([
    getVehicles({ fuelType: "electric" }),
    getVehicles({ fuelType: "hybrid" }),
  ]);
  const seen = new Set<string>();
  const vehicles = [...electric, ...hybrid].filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Electric & Hybrid Vehicles</h1>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">
        A growing share of the vehicles we can source from China are electric or
        hybrid. Here&apos;s what to know before you import one.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map((card) => (
          <div key={card.title} className="rounded-lg border border-border p-5">
            <card.icon className="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 className="mt-3 text-h3 font-semibold text-foreground">{card.title}</h3>
            <p className="mt-2 text-small text-muted-foreground">{card.copy}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-h2 font-semibold text-foreground">
        Electric & Hybrid Vehicles We Can Source
      </h2>

      {vehicles.length === 0 ? (
        <p className="mt-6 text-body text-muted-foreground">
          No electric or hybrid vehicles are currently listed as examples.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
