import { getVehicles } from "@/lib/data/vehicles";

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">
        China2Ghana Motors — Foundation
      </h1>
      <p className="mt-2 text-muted-foreground">
        Homepage build is the next sub-project. This placeholder confirms the
        design system, layout shell, and data layer are wired up.
      </p>
      <ul className="mt-8 space-y-2">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="rounded-md border border-border p-4">
            {vehicle.year} {vehicle.make} {vehicle.model} — ${vehicle.priceUsd.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
