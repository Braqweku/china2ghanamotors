import type { SourcingRequest } from "@/types";

export async function submitSourcingRequest(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- request payload is intentionally unused by this mock stub; a future task wires it to a real submission handler.
  _req: SourcingRequest
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
