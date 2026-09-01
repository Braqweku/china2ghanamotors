import type { FleetEnquiry } from "@/types";

export async function submitFleetEnquiry(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- enquiry payload is intentionally unused by this mock stub; a future task wires it to a real submission handler.
  _enquiry: FleetEnquiry
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
