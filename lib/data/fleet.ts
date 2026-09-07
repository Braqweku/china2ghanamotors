import type { FleetEnquiry } from "@/types";

const FLEET_NOTIFY_EMAIL = "jacob.knorr@ev3africa.com";

export async function submitFleetEnquiry(
  enquiry: FleetEnquiry
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const response = await fetch(`https://formsubmit.co/ajax/${FLEET_NOTIFY_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New fleet quote request — ${enquiry.companyName} (${reference})`,
      _template: "table",
      _captcha: "false",
      ...(enquiry.email
        ? {
            _autoresponse: `Thanks for your fleet quote request with China2Ghana Motors. Your reference number is ${reference} — track its status anytime at https://china2ghana-motors.vercel.app/track?ref=${reference}. Our team will be in touch shortly.`,
          }
        : {}),
      reference,
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
