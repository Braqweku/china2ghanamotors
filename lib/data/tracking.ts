import type { TrackingEvent } from "@/types";
import { mockTrackingEvents } from "@/lib/mock/tracking";

export async function getTrackingEvents(reference: string): Promise<TrackingEvent[] | null> {
  if (!(reference in mockTrackingEvents)) {
    return null;
  }
  return mockTrackingEvents[reference];
}
