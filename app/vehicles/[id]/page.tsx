import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById, getVehicles } from "@/lib/data/vehicles";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return { title: "Vehicle not found" };
  }

  const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const description = `${vehicleName} — a ${vehicle.condition === "new" ? "new" : "used"} ${vehicle.vehicleType} with ${vehicle.fuelType} fuel and ${vehicle.transmission} transmission. Sourced from verified suppliers in China and delivered to Ghana.`;

  return {
    title: `${vehicleName} — ${vehicle.vehicleType.toUpperCase()} Sourced from China`,
    description,
    alternates: { canonical: `/vehicles/${id}` },
    openGraph: { images: vehicle.images.length > 0 ? [vehicle.images[0]] : undefined },
    twitter: { images: vehicle.images.length > 0 ? [vehicle.images[0]] : undefined },
  };
}

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
  const vehicleUrl = `${siteConfig.url}/vehicles/${vehicle.id}`;
  const whatsappHref = buildWhatsAppLink(
    `I'm interested in the ${vehicleName} listed by ${siteConfig.name}.`
  );

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleName,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.mileageKm, unitCode: "KMT" },
    itemCondition:
      vehicle.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    image: vehicle.images.map((src) => `${siteConfig.url}${src}`),
    url: vehicleUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Vehicles", item: `${siteConfig.url}/vehicles` },
      { "@type": "ListItem", position: 3, name: vehicleName, item: vehicleUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
