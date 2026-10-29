import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, SearchCheck, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById, getVehicles } from "@/lib/data/vehicles";
import { similarVehicles } from "@/lib/vehicle-query";
import {
  formatMileage,
  fuelTypeLabels,
  specLabel,
  transmissionLabels,
  vehicleTitle,
  vehicleTypeLabels,
} from "@/lib/vehicle-format";
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

  const vehicleName = vehicleTitle(vehicle);
  const description = `${vehicleName}${vehicle.specs.trim ? ` ${vehicle.specs.trim}` : ""}: used ${vehicleTypeLabels[vehicle.vehicleType]}, ${fuelTypeLabels[vehicle.fuelType].toLowerCase()}, ${transmissionLabels[vehicle.transmission].toLowerCase()}, ${formatMileage(vehicle.mileageKm)}. Inspected in China and shipped to Ghana.`;

  return {
    title: `${vehicleName} — Used ${vehicleTypeLabels[vehicle.vehicleType]} from China`,
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

  const vehicleName = vehicleTitle(vehicle);
  const vehicleUrl = `${siteConfig.url}/vehicles/${vehicle.id}`;
  const whatsappHref = buildWhatsAppLink(
    `I'm interested in the ${vehicleName} (${vehicle.id}) listed by ${siteConfig.name}.`
  );
  const similar = similarVehicles(await getVehicles(), vehicle);
  const summary = `${formatMileage(vehicle.mileageKm)} · ${transmissionLabels[vehicle.transmission]} · ${fuelTypeLabels[vehicle.fuelType]}`;

  const facts = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: formatMileage(vehicle.mileageKm) },
    { label: "Fuel", value: fuelTypeLabels[vehicle.fuelType] },
    { label: "Gearbox", value: transmissionLabels[vehicle.transmission] },
    { label: "Body type", value: vehicleTypeLabels[vehicle.vehicleType] },
    ...Object.entries(vehicle.specs)
      .filter(([key]) => key !== "trim")
      .map(([key, value]) => ({ label: specLabel(key), value })),
  ];

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
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
        <ol className="flex min-w-0 items-center gap-1.5">
          <li>
            <Link href="/vehicles" className="hover:text-foreground">
              Vehicles
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate text-foreground">
            {vehicleName}
          </li>
        </ol>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0">
          <VehicleGallery images={vehicle.images} alt={vehicleName} />

          <section className="mt-10" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-h3 font-semibold text-foreground">
              Specifications
            </h2>
            <dl className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 border-b border-border py-3">
                  <dt className="text-small text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right text-small font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-6">
            <h1 className="text-h2 font-semibold text-foreground">{vehicleName}</h1>
            {vehicle.specs.trim && (
              <p className="mt-1 text-body text-muted-foreground">{vehicle.specs.trim}</p>
            )}
            <p className="mt-4 text-small text-foreground/80">{summary}</p>

            <div className="mt-6 hidden flex-col gap-3 lg:flex">
              <Button asChild size="lg">
                <Link href="/source">Request this vehicle</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
            </div>

            <Separator className="my-6" />

            <ul className="space-y-3 text-small text-muted-foreground">
              <li className="flex gap-3">
                <SearchCheck className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                Inspected in China before purchase
              </li>
              <li className="flex gap-3">
                <Ship className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                Shipped and cleared to Ghana
              </li>
              <li className="flex gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                Your quote includes shipping, inspection and clearing
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-h3 font-semibold text-foreground">
            Similar vehicles
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background p-4 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-3">
          <Button asChild className="flex-1">
            <Link href="/source">Request this vehicle</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
