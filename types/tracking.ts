export type TrackingStage =
  | "received"
  | "sourcing"
  | "selected"
  | "verification"
  | "inspection"
  | "purchased"
  | "ready_to_ship"
  | "in_transit"
  | "arrived_ghana"
  | "clearing"
  | "ready_for_delivery"
  | "delivered";

export type TrackingEvent = {
  reference: string;
  stage: TrackingStage;
  timestamp: string;
  note?: string;
};
