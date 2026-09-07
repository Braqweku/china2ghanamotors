import type { SourcingRequest } from "@/types";

const SOURCING_NOTIFY_EMAIL = "jacob.knorr@ev3africa.com";

export async function submitSourcingRequest(
  request: SourcingRequest
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const response = await fetch(`https://formsubmit.co/ajax/${SOURCING_NOTIFY_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New sourcing request — ${request.customer.name} (${reference})`,
      _template: "table",
      _captcha: "false",
      reference,
      vehicleQuery: request.vehicleQuery,
      budget: `$${request.budgetUsd.min.toLocaleString()} – $${request.budgetUsd.max.toLocaleString()}`,
      specifications:
        request.specifications.length > 0 ? request.specifications.join(", ") : "None specified",
      quantity: request.quantity,
      name: request.customer.name,
      phone: request.customer.phone,
      email: request.customer.email ?? "Not provided",
      whatsapp: request.customer.whatsapp ?? "Not provided",
      location: request.customer.location ?? "Not provided",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit sourcing request");
  }

  return { reference };
}
