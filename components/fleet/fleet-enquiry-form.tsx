"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFleetEnquiry } from "@/lib/data/fleet";
import { createOrderAction } from "@/lib/actions/orders";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/lib/i18n/alternates";
import { localeNames, type Locale } from "@/lib/i18n/locales";
import type { FleetEnquiry } from "@/types";

type FormState = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  fleetSize: string;
  vehicleTypesNeeded: string;
  notes: string;
};

const initialState: FormState = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  fleetSize: "",
  vehicleTypesNeeded: "",
  notes: "",
};

/** Returns the message key of the first problem, or null. */
function validate(form: FormState): string | null {
  if (!form.companyName.trim()) return "errCompany";
  if (!form.contactName.trim()) return "errContact";
  if (!form.phone.trim()) return "errPhone";
  if (!form.email.trim()) return "errEmail";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "errEmailInvalid";
  const size = Number(form.fleetSize);
  if (!Number.isInteger(size) || size < 1) return "errFleetSize";
  return null;
}

export function FleetEnquiryForm() {
  const t = useTranslations("fleet");
  const locale = useLocale() as Locale;
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errorKey = validate(form);
    if (errorKey) {
      setError(t(errorKey));
      return;
    }
    setError(null);
    setSubmitting(true);

    const enquiry: FleetEnquiry = {
      companyName: form.companyName,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email,
      fleetSize: Number(form.fleetSize),
      vehicleTypesNeeded: form.vehicleTypesNeeded,
      notes: form.notes || undefined,
      status: "submitted",
    };
    try {
      const result = await submitFleetEnquiry(enquiry, {
        language: localeNames[locale],
        autoReply: (ref) =>
          t("autoReply", {
            reference: ref,
            url: `${siteConfig.url}${localizedPath("/track", locale)}?ref=${ref}`,
          }),
      });
      setReference(result.reference);

      try {
        await createOrderAction({
          reference: result.reference,
          source: "fleet",
          customerName: enquiry.contactName,
          customerPhone: enquiry.phone,
          customerEmail: enquiry.email,
          summary: `${enquiry.companyName} — fleet of ${enquiry.fleetSize}`,
        });
      } catch (err) {
        console.error("Failed to create order for tracking:", err);
      }
    } catch {
      setError(t("errSubmit"));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="text-h3 font-semibold text-foreground">{t("received")}</p>
        <p className="mt-2 font-mono text-body text-foreground">{reference}</p>
        <p className="mt-4 text-body text-muted-foreground">{t("receivedBody")}</p>
        <Button asChild className="mt-6">
          <Link href={`/track?ref=${encodeURIComponent(reference)}`}>{t("trackEnquiry")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">{t("companyName")}</Label>
        <Input
          id="companyName"
          value={form.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactName">{t("contactName")}</Label>
        <Input
          id="contactName"
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fleetSize">{t("fleetSize")}</Label>
        <Input
          id="fleetSize"
          type="number"
          min={1}
          value={form.fleetSize}
          onChange={(e) => update("fleetSize", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehicleTypesNeeded">{t("vehicleTypes")}</Label>
        <Input
          id="vehicleTypesNeeded"
          placeholder={t("vehicleTypesPlaceholder")}
          value={form.vehicleTypesNeeded}
          onChange={(e) => update("vehicleTypesNeeded", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      {error && <p className="text-small text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
