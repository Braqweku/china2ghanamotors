import type { SourcingRequest } from "@/types";

export async function submitSourcingRequest(
  _req: SourcingRequest
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
