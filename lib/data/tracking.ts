import type { TrackingEvent } from "@/types";
import { getOrder, getOrderTrackingEvents } from "@/lib/data/orders";

export async function getTrackingEvents(reference: string): Promise<TrackingEvent[] | null> {
  const order = await getOrder(reference);
  if (!order) return null;
  return getOrderTrackingEvents(reference);
}
