import type { TrackingEvent } from "@/types";

export const mockTrackingEvents: Record<string, TrackingEvent[]> = {
  "C2G-8837XJ": [
    { reference: "C2G-8837XJ", stage: "received", timestamp: "2026-07-01T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "sourcing", timestamp: "2026-07-03T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "selected", timestamp: "2026-07-10T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "verification", timestamp: "2026-07-14T09:00:00Z" },
  ],
  "C2G-4L9PQR": [
    { reference: "C2G-4L9PQR", stage: "received", timestamp: "2026-06-01T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "sourcing", timestamp: "2026-06-03T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "selected", timestamp: "2026-06-08T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "verification", timestamp: "2026-06-12T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "inspection", timestamp: "2026-06-16T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "purchased", timestamp: "2026-06-20T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "ready_to_ship", timestamp: "2026-06-25T09:00:00Z" },
    { reference: "C2G-4L9PQR", stage: "in_transit", timestamp: "2026-07-02T09:00:00Z" },
  ],
  "C2G-9K2WZT": [
    { reference: "C2G-9K2WZT", stage: "received", timestamp: "2026-04-01T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "sourcing", timestamp: "2026-04-03T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "selected", timestamp: "2026-04-08T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "verification", timestamp: "2026-04-12T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "inspection", timestamp: "2026-04-16T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "purchased", timestamp: "2026-04-20T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "ready_to_ship", timestamp: "2026-04-25T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "in_transit", timestamp: "2026-05-02T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "arrived_ghana", timestamp: "2026-05-20T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "clearing", timestamp: "2026-05-24T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "ready_for_delivery", timestamp: "2026-05-28T09:00:00Z" },
    { reference: "C2G-9K2WZT", stage: "delivered", timestamp: "2026-06-02T09:00:00Z" },
  ],
};
