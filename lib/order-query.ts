import type { Order, OrderSource, TrackingStage } from "@/types";

export type OrderFilters = {
  q?: string;
  stage?: TrackingStage;
  source?: OrderSource;
};

export type StagePhase = "early" | "shipping" | "done";

const shippingStages: TrackingStage[] = [
  "ready_to_ship",
  "in_transit",
  "arrived_ghana",
  "clearing",
  "ready_for_delivery",
];

export function stagePhase(stage: TrackingStage): StagePhase {
  if (stage === "delivered") return "done";
  if (shippingStages.includes(stage)) return "shipping";
  return "early";
}

export function filterOrders(orders: Order[], filters: OrderFilters = {}): Order[] {
  let results = orders;
  if (filters.q) {
    const q = filters.q.trim().toLowerCase();
    results = results.filter((o) =>
      `${o.reference} ${o.customerName} ${o.summary}`.toLowerCase().includes(q)
    );
  }
  if (filters.stage) results = results.filter((o) => o.currentStage === filters.stage);
  if (filters.source) results = results.filter((o) => o.source === filters.source);
  return results;
}

export function orderStats(orders: Order[]) {
  const delivered = orders.filter((o) => o.currentStage === "delivered").length;
  const shipping = orders.filter((o) => stagePhase(o.currentStage) === "shipping").length;
  return { total: orders.length, inProgress: orders.length - delivered, shipping, delivered };
}

/** Phone number in wa.me format (country code, digits only); assumes Ghana for local numbers. */
export function whatsappNumber(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) digits = `233${digits.slice(1)}`;
  return digits.length >= 11 ? digits : null;
}
