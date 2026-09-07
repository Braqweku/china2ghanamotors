"use server";

import type { FleetEnquiry } from "@/types";
import { sendFleetEnquiryEmails } from "@/lib/email";

export async function submitFleetEnquiry(
  enquiry: FleetEnquiry
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await sendFleetEnquiryEmails(enquiry, reference);
  return { reference };
}
