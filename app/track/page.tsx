import type { Metadata } from "next";
import { getTrackingEvents } from "@/lib/data/tracking";
import { stageLabels } from "@/lib/tracking-stages";
import { ReferenceLookupForm } from "@/components/tracking/reference-lookup-form";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { PageHeader } from "@/components/layout/page-header";
import type { TrackingStage } from "@/types";

export const metadata: Metadata = {
  title: "Track Your Vehicle",
  description: "Enter your tracking reference to see the status of your request.",
  robots: { index: false, follow: false },
};

const phases: { title: string; stages: TrackingStage[] }[] = [
  { title: "Sourcing", stages: ["received", "sourcing", "selected"] },
  { title: "Inspection and purchase", stages: ["verification", "inspection", "purchased"] },
  { title: "Shipping", stages: ["ready_to_ship", "in_transit", "arrived_ghana"] },
  { title: "Clearing and delivery", stages: ["clearing", "ready_for_delivery", "delivered"] },
];

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const events = ref ? await getTrackingEvents(ref) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Track your vehicle"
        intro="Enter your tracking reference to see where your vehicle is in the process."
      />

      <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6">
        <ReferenceLookupForm defaultValue={ref} />
        <p className="mt-3 text-small text-muted-foreground">
          Your reference starts with <span className="font-mono text-foreground">C2G-</span>. It is
          shown when you submit a request and sent to your email if you gave one.
        </p>

        {ref && events === null && (
          <p className="mt-6 border-t border-border pt-5 text-body text-destructive" role="alert">
            We couldn&apos;t find that reference. Check it and try again.
          </p>
        )}

        {ref && events && events.length === 0 && (
          <p className="mt-6 border-t border-border pt-5 text-body text-muted-foreground">
            This reference exists but has no updates recorded yet.
          </p>
        )}

        {ref && events && events.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-small text-muted-foreground">
              Reference: <span className="font-mono text-foreground">{ref}</span>
            </p>
            <div className="mt-6">
              <TrackingTimeline events={events} />
            </div>
          </div>
        )}
      </div>

      <section aria-labelledby="how-heading" className="mt-10">
        <h2 id="how-heading" className="text-small font-semibold text-foreground">
          How tracking works
        </h2>
        <ol className="mt-4 grid gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, i) => (
            <li key={phase.title}>
              <p className="text-caption font-medium tabular-nums text-muted-foreground">
                Step {i + 1}
              </p>
              <p className="mt-0.5 text-small font-semibold text-foreground">{phase.title}</p>
              <p className="mt-1 text-caption text-muted-foreground">
                {phase.stages.map((s) => stageLabels[s]).join(" · ")}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
