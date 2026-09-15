import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById } from "@/lib/data/vehicles";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const whatsappHref = buildWhatsAppLink(
    `I'm interested in the ${vehicleName} listed by ${siteConfig.name}.`
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <VehicleGallery images={vehicle.images} alt={vehicleName} />

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 font-semibold text-foreground">{vehicleName}</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {vehicle.condition === "new" ? "New" : "Used"} · {vehicle.fuelType} ·{" "}
            {vehicle.transmission} · {vehicle.mileageKm.toLocaleString()} km
          </p>
        </div>
        <Badge variant={vehicle.availability === "sold" ? "secondary" : "default"}>
          {vehicle.availability === "sold"
            ? "Sold"
            : vehicle.availability === "available"
              ? "Available"
              : "Sourcing"}
        </Badge>
      </div>

      <section className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-h3 font-semibold text-foreground">Specifications</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Object.entries(vehicle.specs).map(([key, value]) => (
            <div key={key}>
              <dt className="text-caption uppercase tracking-wide text-muted-foreground">
                {key}
              </dt>
              <dd className="text-small text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-h3 font-semibold text-foreground">Get a Quote</h2>
        <p className="mt-2 text-body text-muted-foreground">
          Pricing depends on specification, shipping and current exchange rates.
          Reach out and we&apos;ll get back to you with a full quote, including
          shipping, inspection and clearing.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href="/source">Request this vehicle</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Ask about this vehicle
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
