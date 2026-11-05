"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitSourcingRequest } from "@/lib/data/sourcing";
import { createOrderAction } from "@/lib/actions/orders";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/lib/i18n/alternates";
import { localeNames, localeTags, type Locale } from "@/lib/i18n/locales";
import type { SourcingRequest } from "@/types";

/** Number of input steps before the review step. */
const REVIEW_STEP = 5;
const CONFIRMATION_STEP = 6;

type FormState = {
  vehicleQuery: string;
  minPrice: string;
  maxPrice: string;
  specifications: string;
  quantity: string;
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  location: string;
};

const initialState: FormState = {
  vehicleQuery: "",
  minPrice: "",
  maxPrice: "",
  specifications: "",
  quantity: "1",
  name: "",
  phone: "",
  email: "",
  whatsapp: "",
  location: "",
};

/** Returns the message key of the first problem on this step, or null. */
function validateStep(step: number, form: FormState): string | null {
  switch (step) {
    case 0:
      return form.vehicleQuery.trim() ? null : "errVehicle";
    case 1: {
      if (!form.minPrice || !form.maxPrice) return "errBudgetBoth";
      const min = Number(form.minPrice);
      const max = Number(form.maxPrice);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
        return "errBudgetPositive";
      }
      if (min > max) return "errBudgetOrder";
      return null;
    }
    case 3: {
      const qty = Number(form.quantity);
      return Number.isInteger(qty) && qty >= 1 ? null : "errQuantity";
    }
    case 4:
      if (!form.name.trim()) return "errName";
      if (!form.phone.trim()) return "errPhone";
      return null;
    default:
      return null;
  }
}

function ReviewItem({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-foreground">{title}</h3>
        <button type="button" onClick={onEdit} className="text-small text-accent underline">
          {editLabel}
        </button>
      </div>
      <p className="mt-1 text-body text-muted-foreground">{children}</p>
    </div>
  );
}

export function SourcingWizard() {
  const t = useTranslations("source");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const steps = t.raw("steps") as string[];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const money = new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const errorKey = validateStep(step, form);
    if (errorKey) {
      setError(t(errorKey));
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, REVIEW_STEP));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const request: SourcingRequest = {
      vehicleQuery: form.vehicleQuery,
      budgetUsd: { min: Number(form.minPrice), max: Number(form.maxPrice) },
      specifications: form.specifications
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      quantity: Number(form.quantity),
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        whatsapp: form.whatsapp || undefined,
        location: form.location || undefined,
      },
      status: "submitted",
    };
    try {
      const result = await submitSourcingRequest(request, {
        language: localeNames[locale],
        autoReply: (ref) =>
          t("autoReply", {
            reference: ref,
            url: `${siteConfig.url}${localizedPath("/track", locale)}?ref=${ref}`,
          }),
      });
      setReference(result.reference);
      setStep(CONFIRMATION_STEP);

      try {
        await createOrderAction({
          reference: result.reference,
          source: "sourcing",
          customerName: request.customer.name,
          customerPhone: request.customer.phone,
          customerEmail: request.customer.email,
          summary: request.vehicleQuery,
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

  const progressPercent = ((step + 1) / steps.length) * 100;

  return (
    <div>
      {step < CONFIRMATION_STEP && (
        <div>
          <p className="text-label text-muted-foreground">
            {t("stepOf", { n: step + 1, total: steps.length, name: steps[step] })}
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-accent transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-2">
            <Label htmlFor="vehicleQuery">{t("vehicleLabel")}</Label>
            <Input
              id="vehicleQuery"
              placeholder={t("vehiclePlaceholder")}
              value={form.vehicleQuery}
              onChange={(e) => update("vehicleQuery", e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">{t("minBudget")}</Label>
              <Input
                id="minPrice"
                type="number"
                value={form.minPrice}
                onChange={(e) => update("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">{t("maxBudget")}</Label>
              <Input
                id="maxPrice"
                type="number"
                value={form.maxPrice}
                onChange={(e) => update("maxPrice", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label htmlFor="specifications">{t("specsLabel")}</Label>
            <Textarea
              id="specifications"
              placeholder={t("specsPlaceholder")}
              value={form.specifications}
              onChange={(e) => update("specifications", e.target.value)}
              rows={4}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <Label htmlFor="quantity">{t("quantityLabel")}</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === REVIEW_STEP && (
          <div className="space-y-4">
            <ReviewItem title={t("reviewVehicle")} editLabel={t("edit")} onEdit={() => setStep(0)}>
              {form.vehicleQuery}
            </ReviewItem>
            <ReviewItem title={t("reviewBudget")} editLabel={t("edit")} onEdit={() => setStep(1)}>
              {money.format(Number(form.minPrice))} – {money.format(Number(form.maxPrice))}
            </ReviewItem>
            <ReviewItem title={t("reviewSpecs")} editLabel={t("edit")} onEdit={() => setStep(2)}>
              {form.specifications.trim() || t("noneSpecified")}
            </ReviewItem>
            <ReviewItem title={t("reviewQuantity")} editLabel={t("edit")} onEdit={() => setStep(3)}>
              {form.quantity}
            </ReviewItem>
            <ReviewItem title={t("reviewDetails")} editLabel={t("edit")} onEdit={() => setStep(4)}>
              {form.name} · {form.phone}
              {form.email && ` · ${form.email}`}
            </ReviewItem>
          </div>
        )}

        {step === CONFIRMATION_STEP && reference && (
          <div className="rounded-lg border border-border p-6 text-center">
            <p className="text-h3 font-semibold text-foreground">{t("received")}</p>
            <p className="mt-2 font-mono text-body text-foreground">{reference}</p>
            <p className="mt-4 text-body text-muted-foreground">{t("receivedBody")}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href={`/track?ref=${encodeURIComponent(reference)}`}>{t("trackRequest")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">{tCommon("backHome")}</Link>
              </Button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-small text-destructive">{error}</p>}
      </div>

      {step < CONFIRMATION_STEP && (
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={step === 0}>
            {t("back")}
          </Button>
          {step < REVIEW_STEP ? (
            <Button onClick={goNext}>{t("next")}</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
