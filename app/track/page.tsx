import type { Metadata } from "next";
import { getTrackingEvents } from "@/lib/data/tracking";
import { stageLabels, stageOrder } from "@/lib/tracking-stages";
import { ReferenceLookupForm } from "@/components/tracking/reference-lookup-form";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { PageHeader } from "@/components/layout/page-header";
import { AsideSection, FormPage } from "@/components/layout/form-page";
import { NextSteps } from "@/components/layout/next-steps";

export const metadata: Metadata = {
  title: "Track Your Vehicle",
  description: "Enter your tracking reference to see the status of your request.",
  robots: { index: false, follow: false },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const events = ref ? await getTrackingEvents(ref) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Track your vehicle"
        intro="Enter your tracking reference to see where your vehicle is in the process."
      />

      <FormPage
        aside={
          <>
            <AsideSection title="Where to find your reference">
              <p>
                Your reference starts with <span className="font-mono text-foreground">C2G-</span>. It
                is shown when you submit a request and sent to your email if you gave one.
              </p>
            </AsideSection>
            <AsideSection title="Tracking stages">
              <NextSteps steps={stageOrder.map((stage) => stageLabels[stage])} />
            </AsideSection>
          </>
        }
      >
        <ReferenceLookupForm defaultValue={ref} />

        {ref && events === null && (
          <p className="mt-6 text-body text-destructive" role="alert">
            We couldn&apos;t find that reference. Check it and try again.
          </p>
        )}

        {ref && events && events.length === 0 && (
          <p className="mt-6 text-body text-muted-foreground">
            This reference exists but has no updates recorded yet.
          </p>
        )}

        {ref && events && events.length > 0 && (
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-small text-muted-foreground">
              Reference: <span className="font-mono text-foreground">{ref}</span>
            </p>
            <div className="mt-6">
              <TrackingTimeline events={events} />
            </div>
          </div>
        )}
      </FormPage>
    </div>
  );
}
