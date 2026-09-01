import type { FleetEnquiry } from "@/types";

export async function submitFleetEnquiry(
  _enquiry: FleetEnquiry
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
