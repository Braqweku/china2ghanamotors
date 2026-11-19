import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle, SearchCheck, Ship } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { getVehicleById, getVehicles } from "@/lib/data/vehicles";
import { similarVehicles } from "@/lib/vehicle-query";
import { formatMileage, formatRegistered, specMessageKey, translateEngine, vehicleTitle } from "@/lib/vehicle-format";
import { alternatesFor, localizedPath } from "@/lib/i18n/alternates";
import { localeTags, locales, type Locale } from "@/lib/i18n/locales";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import type { Vehicle } from "@/types";

type Params = Promise<{ locale: Locale; id: string }>;

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return locales.flatMap((locale) => vehicles.map((vehicle) => ({ locale, id: vehicle.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return { title: t("vehicle.notFound") };
  }

  const name = vehicleTitle(vehicle);
  const type = t(`labels.bodyType.${vehicle.vehicleType}`);

  return {
    title: t("vehicle.metaTitle", { name, type }),
    description: t("vehicle.metaDescription", {
      name,
      trim: vehicle.specs.trim ? ` ${vehicle.specs.trim}` : "",
      type,
      fuel: t(`labels.fuel.${vehicle.fuelType}`).toLocaleLowerCase(locale),
      gearbox: t(`labels.gearbox.${vehicle.transmission}`).toLocaleLowerCase(locale),
      mileage: formatMileage(vehicle.mileageKm, localeTags[locale]),
    }),
    alternates: alternatesFor(`/vehicles/${id}`, locale),
    openGraph: { images: vehicle.images.length > 0 ? [vehicle.images[0]] : undefined },
    twitter: { images: vehicle.images.length > 0 ? [vehicle.images[0]] : undefined },
  };
}

type Translator = Awaited<ReturnType<typeof getTranslations>>;

function specValue(key: string, value: string, t: Translator, locale: Locale): string {
  if (key === "colour" && t.has(`labels.colour.${value}`)) return t(`labels.colour.${value}`);
  if (key === "first registered") return formatRegistered(value, localeTags[locale]);
  if (key === "engine") {
    return translateEngine(value, {
      pluginHybrid: t("labels.engine.pluginHybrid"),
      hybrid: t("labels.engine.hybrid"),
      diesel: t("labels.engine.diesel"),
    });
  }
  return value;
}

function specFacts(vehicle: Vehicle, t: Translator, locale: Locale) {
  return [
    { label: t("vehicle.year"), value: String(vehicle.year) },
    { label: t("vehicle.mileage"), value: formatMileage(vehicle.mileageKm, localeTags[locale]) },
    { label: t("vehicle.fuel"), value: t(`labels.fuel.${vehicle.fuelType}`) },
    { label: t("vehicle.gearbox"), value: t(`labels.gearbox.${vehicle.transmission}`) },
    { label: t("vehicle.bodyType"), value: t(`labels.bodyType.${vehicle.vehicleType}`) },
    ...Object.entries(vehicle.specs)
      .filter(([key]) => key !== "trim")
      .map(([key, value]) => ({
        label: t.has(`labels.spec.${specMessageKey(key)}`) ? t(`labels.spec.${specMessageKey(key)}`) : key,
        value: specValue(key, value, t, locale),
      })),
  ];
}

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const vehicleName = vehicleTitle(vehicle);
  const vehicleUrl = `${siteConfig.url}${localizedPath(`/vehicles/${vehicle.id}`, locale)}`;
  const whatsappHref = buildWhatsAppLink(t("vehicle.whatsappMessage", { name: vehicleName, id: vehicle.id }));
  const similar = similarVehicles(await getVehicles(), vehicle);
  const summary = [
    formatMileage(vehicle.mileageKm, localeTags[locale]),
    t(`labels.gearbox.${vehicle.transmission}`),
    t(`labels.fuel.${vehicle.fuelType}`),
  ].join(" · ");
  const facts = specFacts(vehicle, t, locale);

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

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: t("vehicle.home"), url: `${siteConfig.url}${localizedPath("/", locale)}` },
    { name: t("vehicle.breadcrumb"), url: `${siteConfig.url}${localizedPath("/vehicles", locale)}` },
    { name: vehicleName, url: vehicleUrl },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <JsonLd data={vehicleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
        <ol className="flex min-w-0 items-center gap-1.5">
          <li>
            <Link href="/vehicles" className="hover:text-foreground">
              {t("vehicle.breadcrumb")}
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
            <h2 id="specs-heading" className="text-h3 font-medium text-foreground">
              {t("vehicle.specs")}
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
            <h1 className="text-h2 font-medium text-foreground">{vehicleName}</h1>
            {vehicle.specs.trim && (
              <p className="mt-1 text-body text-muted-foreground">{vehicle.specs.trim}</p>
            )}
            <p className="mt-4 text-small text-foreground/80">{summary}</p>

            <div className="mt-6 hidden flex-col gap-3 lg:flex">
              <Button asChild size="lg">
                <Link href="/source">{t("vehicle.request")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {t("vehicle.askWhatsapp")}
                </a>
              </Button>
            </div>

            <Separator className="my-6" />

            <ul className="space-y-3 text-small text-muted-foreground">
              <li className="flex gap-3">
                <SearchCheck className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                {t("vehicle.inspected")}
              </li>
              <li className="flex gap-3">
                <Ship className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                {t("vehicle.shipped")}
              </li>
              <li className="flex gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" aria-hidden="true" />
                {t("vehicle.quoteIncludes")}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-h3 font-medium text-foreground">
            {t("vehicle.similar")}
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
            <Link href="/source">{t("vehicle.request")}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              {t("vehicle.whatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
