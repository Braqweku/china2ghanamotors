import type { TrackingEvent } from "@/types";
import { getOrder, getOrderTrackingEvents } from "@/lib/data/orders";

export async function getTrackingEvents(reference: string): Promise<TrackingEvent[] | null> {
  try {
    const order = await getOrder(reference);
    if (!order) return null;
    return await getOrderTrackingEvents(reference);
  } catch (err) {
    console.error("[tracking] Lookup failed:", err, { reference });
    return null;
  }
}
