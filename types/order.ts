import type { TrackingStage } from "@/types/tracking";

export type OrderSource = "sourcing" | "fleet";

export type Order = {
  reference: string;
  source: OrderSource;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  summary: string;
  currentStage: TrackingStage;
  createdAt: string;
  updatedAt: string;
};

export type NewOrderInput = {
  reference: string;
  source: OrderSource;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  summary: string;
};
