import { getTrackingEvents } from "@/lib/data/tracking";
import { ReferenceLookupForm } from "@/components/tracking/reference-lookup-form";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const events = ref ? await getTrackingEvents(ref) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Track Your Vehicle</h1>
      <p className="mt-2 text-body text-muted-foreground">
        Enter your tracking reference to see the status of your request.
      </p>

      <div className="mt-8">
        <ReferenceLookupForm defaultValue={ref} />
      </div>

      {ref && events === null && (
        <p className="mt-6 text-body text-destructive">
          We couldn&apos;t find that reference. Check it and try again.
        </p>
      )}

      {ref && events && events.length === 0 && (
        <p className="mt-6 text-body text-muted-foreground">
          This reference exists but has no updates recorded yet.
        </p>
      )}

      {ref && events && events.length > 0 && (
        <div className="mt-10">
          <p className="text-small text-muted-foreground">
            Reference: <span className="font-mono text-foreground">{ref}</span>
          </p>
          <div className="mt-6">
            <TrackingTimeline events={events} />
          </div>
        </div>
      )}
    </div>
  );
}
