import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/config";
import type { FleetEnquiry } from "@/types";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "China2Ghana Motors <onboarding@resend.dev>";

// Resend blocks unverified accounts from sending to anyone but the account's
// own signup email. Until a sending domain is verified, notifications route
// here instead of siteConfig.contactEmail so they actually get delivered.
const NOTIFY_EMAIL = process.env.FLEET_NOTIFICATION_EMAIL ?? siteConfig.contactEmail;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendFleetEnquiryEmails(
  enquiry: FleetEnquiry,
  reference: string
): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.error(
      "[email] RESEND_API_KEY is not set — fleet enquiry email was not sent.",
      { reference }
    );
    return;
  }

  const notifyResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    replyTo: enquiry.email,
    subject: `New fleet quote request — ${enquiry.companyName} (${reference})`,
    html: `
      <h2>New fleet quote request</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <table cellpadding="4" cellspacing="0">
        <tr><td><strong>Company</strong></td><td>${escapeHtml(enquiry.companyName)}</td></tr>
        <tr><td><strong>Contact name</strong></td><td>${escapeHtml(enquiry.contactName)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(enquiry.phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(enquiry.email ?? "Not provided")}</td></tr>
        <tr><td><strong>Fleet size</strong></td><td>${enquiry.fleetSize}</td></tr>
        <tr><td><strong>Vehicle types needed</strong></td><td>${escapeHtml(enquiry.vehicleTypesNeeded)}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${escapeHtml(enquiry.notes ?? "None")}</td></tr>
      </table>
    `,
  });
  if (notifyResult.error) {
    console.error("[email] Failed to send fleet enquiry notification:", notifyResult.error);
  }

  if (enquiry.email) {
    const confirmResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: enquiry.email,
      subject: `We've received your fleet quote request — ${reference}`,
      html: `
        <p>Hi ${escapeHtml(enquiry.contactName)},</p>
        <p>Thanks for your fleet quote request with ${siteConfig.name}. Your reference number is
        <strong>${reference}</strong>.</p>
        <p>A member of our fleet team will review your request for ${enquiry.fleetSize}
        vehicle(s) and follow up with next steps shortly.</p>
        <p>${siteConfig.name}<br/>${siteConfig.tagline}</p>
      `,
    });
    if (confirmResult.error) {
      console.error("[email] Failed to send fleet enquiry confirmation:", confirmResult.error);
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
