import type { SourcingRequest } from "@/types";
import { siteConfig } from "@/lib/config";

export type SubmissionLocale = {
  /** Language name shown to our team, e.g. "Français". */
  language: string;
  /** Auto-reply sent to the customer, in their language. */
  autoReply: (reference: string) => string;
};

export async function submitSourcingRequest(
  request: SourcingRequest,
  { language, autoReply }: SubmissionLocale
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const response = await fetch(`https://formsubmit.co/ajax/${siteConfig.infoEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New sourcing request — ${request.customer.name} (${reference})`,
      _template: "table",
      _captcha: "false",
      ...(request.customer.email ? { _autoresponse: autoReply(reference) } : {}),
      reference,
      language,
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
