import type { TrackingEvent } from "@/types";

export const mockTrackingEvents: Record<string, TrackingEvent[]> = {
  "C2G-8837XJ": [
    { reference: "C2G-8837XJ", stage: "received", timestamp: "2026-07-01T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "sourcing", timestamp: "2026-07-03T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "selected", timestamp: "2026-07-10T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "verification", timestamp: "2026-07-14T09:00:00Z" },
  ],
};
