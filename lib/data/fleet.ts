import type { FleetEnquiry } from "@/types";
import { siteConfig } from "@/lib/config";
import type { SubmissionLocale } from "@/lib/data/sourcing";

export async function submitFleetEnquiry(
  enquiry: FleetEnquiry,
  { language, autoReply }: SubmissionLocale
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const response = await fetch(`https://formsubmit.co/ajax/${siteConfig.infoEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New fleet quote request — ${enquiry.companyName} (${reference})`,
      _template: "table",
      _captcha: "false",
      ...(enquiry.email ? { _autoresponse: autoReply(reference) } : {}),
      reference,
      language,
      companyName: enquiry.companyName,
      contactName: enquiry.contactName,
      phone: enquiry.phone,
      email: enquiry.email ?? "Not provided",
      fleetSize: enquiry.fleetSize,
      vehicleTypesNeeded: enquiry.vehicleTypesNeeded,
      notes: enquiry.notes ?? "None",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit fleet enquiry");
  }

  return { reference };
}
