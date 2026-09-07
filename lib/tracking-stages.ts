import type { TrackingStage } from "@/types";

export const stageOrder: TrackingStage[] = [
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

export const stageLabels: Record<TrackingStage, string> = {
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
