import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrackingEvent, TrackingStage } from "@/types";

const stageLabels: Record<TrackingStage, string> = {
  received: "Request received",
  sourcing: "Vehicle sourcing",
  selected: "Vehicle selected",
  verification: "Verification",
  inspection: "Inspection",
  purchased: "Purchase",
  ready_to_ship: "Ready for shipping",
  in_transit: "In transit",
  arrived_ghana: "Arrived in Ghana",
  clearing: "Clearing",
  ready_for_delivery: "Ready for delivery",
  delivered: "Delivered",
};

const stageOrder: TrackingStage[] = [
  "received",
  "sourcing",
  "selected",
  "verification",
  "inspection",
  "purchased",
  "ready_to_ship",
  "in_transit",
  "arrived_ghana",
  "clearing",
  "ready_for_delivery",
  "delivered",
];

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  const eventByStage = new Map(events.map((e) => [e.stage, e]));
  const lastCompletedIndex = stageOrder.reduce(
    (acc, stage, i) => (eventByStage.has(stage) ? i : acc),
    -1
  );

  return (
    <ol>
      {stageOrder.map((stage, i) => {
        const event = eventByStage.get(stage);
        const isComplete = Boolean(event);
        const isCurrent = i === lastCompletedIndex;
        const isLast = i === stageOrder.length - 1;

        return (
          <li key={stage} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute top-6 left-[9px] h-full w-px",
                  i < lastCompletedIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                isCurrent
                  ? "border-accent bg-accent"
                  : isComplete
                    ? "border-primary bg-primary"
                    : "border-border bg-background"
              )}
            >
              {isComplete && (
                <Check className="h-3 w-3 text-primary-foreground" aria-hidden="true" />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  "text-body font-medium",
                  isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stageLabels[stage]}
              </p>
              {event && (
                <p className="mt-1 text-small text-muted-foreground">
                  {new Date(event.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
