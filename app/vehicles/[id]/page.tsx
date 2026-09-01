import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById } from "@/lib/data/vehicles";
import { estimateLandedCost } from "@/lib/pricing";
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

  const { shippingUsd, inspectionUsd, clearingUsd, totalUsd } = estimateLandedCost(vehicle);
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
        <div className="flex items-center justify-between">
          <h2 className="text-h3 font-semibold text-foreground">Estimated Landed Cost</h2>
          <Badge variant="outline">Estimate</Badge>
        </div>
        <dl className="mt-4 space-y-2 text-body">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Vehicle Price</dt>
            <dd className="text-foreground">${vehicle.priceUsd.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Estimated Shipping</dt>
            <dd className="text-foreground">${shippingUsd.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Inspection Fee</dt>
            <dd className="text-foreground">${inspectionUsd.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Estimated Clearing & Documentation</dt>
            <dd className="text-foreground">${clearingUsd.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-h3 font-semibold">
            <dt className="text-foreground">Estimated Landed Cost</dt>
            <dd className="text-foreground">${totalUsd.toLocaleString()}</dd>
          </div>
        </dl>
        <p className="mt-4 text-caption text-muted-foreground">
          This is an estimate. Final costs depend on actual quotations, shipping,
          exchange rates, customs and applicable charges.
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <a href="/source">Request this vehicle</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Ask about this vehicle
          </a>
        </Button>
      </div>
    </div>
  );
}
