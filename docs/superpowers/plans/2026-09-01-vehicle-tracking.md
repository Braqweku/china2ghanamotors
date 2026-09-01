# Vehicle Tracking Implementation Plan

**Goal:** Build `/track` — a reference lookup form plus a 12-stage timeline view, using the existing `getTrackingEvents` (already returns `TrackingEvent[] | null`).

**Execution:** Implemented directly in this session (no subagents), same as prior sub-projects.

## Global Constraints

- No new dependencies.
- Three distinct states must all render correctly: no reference yet, unknown reference (`null`), and a valid reference (including the edge case of zero events, even though no current mock data hits it — the type allows `[]`).
- No scroll-reveal animation on the timeline (status view, not marketing narrative, per the spec).

---

### Task 1: Expand mock tracking data

**Files:** Modify `lib/mock/tracking.ts`.

Add two more references to the existing `C2G-8837XJ` entry: one mid-pipeline (events through `in_transit`), one fully complete (all 12 stages through `delivered`), both with sequential, non-overlapping timestamps. Exact stage keys must match `TrackingStage` exactly.

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add mid-pipeline and delivered tracking examples`.

---

### Task 2: Reference lookup form

**Files:** Create `components/tracking/reference-lookup-form.tsx`.

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReferenceLookupForm({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/track?ref=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="e.g. C2G-8837XJ"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="font-mono"
        aria-label="Tracking reference"
      />
      <Button type="submit">Track</Button>
    </form>
  );
}
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add tracking reference lookup form`.

---

### Task 3: Timeline component

**Files:** Create `components/tracking/tracking-timeline.tsx`.

```tsx
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
```

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add tracking timeline component`.

---

### Task 4: Wire the route

**Files:** Create `app/track/page.tsx`.

Server Component reading `searchParams: Promise<{ ref?: string }>`. Calls `getTrackingEvents(ref)` when `ref` is present. Renders: heading + `ReferenceLookupForm` (always); if `ref` present and result is `null`, a "couldn't find that reference" message; if result is `[]`, a "reference found, no updates recorded yet" message; if result has events, the reference (mono styling) plus `TrackingTimeline`.

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: wire vehicle tracking route`.

---

### Task 5: Final quality gate

Fresh `tsc`/`lint`/`build`. Dev-server fetch checks: `/track` (form only), `/track?ref=C2G-8837XJ` (early-stage timeline), `/track?ref=` the mid-pipeline reference, `/track?ref=` the delivered reference, `/track?ref=does-not-exist` (not-found message). Confirm no lingering node processes after. Responsive check at the standard breakpoints.
