import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTrackingEvents } from "@/lib/data/tracking";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { ReferenceLookupForm } from "@/components/tracking/reference-lookup-form";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { PageHeader } from "@/components/layout/page-header";
import type { TrackingStage } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "track" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/track", locale),
    robots: { index: false, follow: false },
  };
}

const phases: { key: string; stages: TrackingStage[] }[] = [
  { key: "phaseSourcing", stages: ["received", "sourcing", "selected"] },
  { key: "phaseInspection", stages: ["verification", "inspection", "purchased"] },
  { key: "phaseShipping", stages: ["ready_to_ship", "in_transit", "arrived_ghana"] },
  { key: "phaseClearing", stages: ["clearing", "ready_for_delivery", "delivered"] },
];

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("track");
  const tStages = await getTranslations("stages");
  const { ref } = await searchParams;
  const events = ref ? await getTrackingEvents(ref) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={t("title")} intro={t("intro")} />

      <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6">
        <ReferenceLookupForm defaultValue={ref} />
        <p className="mt-3 text-small text-muted-foreground">
          {t.rich("hint", {
            ref: (chunks) => <span className="font-mono text-foreground">{chunks}</span>,
          })}
        </p>

        {ref && events === null && (
          <p className="mt-6 border-t border-border pt-5 text-body text-destructive" role="alert">
            {t("notFound")}
          </p>
        )}

        {ref && events && events.length === 0 && (
          <p className="mt-6 border-t border-border pt-5 text-body text-muted-foreground">
            {t("noUpdates")}
          </p>
        )}

        {ref && events && events.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-small text-muted-foreground">
              {t("reference")} <span className="font-mono text-foreground">{ref}</span>
            </p>
            <div className="mt-6">
              <TrackingTimeline events={events} />
            </div>
          </div>
        )}
      </div>

      <section aria-labelledby="how-heading" className="mt-10">
        <h2 id="how-heading" className="text-small font-semibold text-foreground">
          {t("howTitle")}
        </h2>
        <ol className="mt-4 grid gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, i) => (
            <li key={phase.key}>
              <p className="text-caption font-medium tabular-nums text-muted-foreground">
                {t("step", { n: i + 1 })}
              </p>
              <p className="mt-0.5 text-small font-semibold text-foreground">{t(phase.key)}</p>
              <p className="mt-1 text-caption text-muted-foreground">
                {phase.stages.map((s) => tStages(s)).join(" · ")}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
