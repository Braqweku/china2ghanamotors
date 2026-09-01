"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitSourcingRequest } from "@/lib/data/sourcing";
import type { SourcingRequest } from "@/types";

const steps = [
  "Vehicle",
  "Budget",
  "Specifications",
  "Quantity",
  "Your Details",
  "Review",
  "Confirmation",
];

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

function validateStep(step: number, form: FormState): string | null {
  switch (step) {
    case 0:
      return form.vehicleQuery.trim() ? null : "Tell us what vehicle you're looking for.";
    case 1: {
      if (!form.minPrice || !form.maxPrice) return "Enter both a minimum and maximum budget.";
      const min = Number(form.minPrice);
      const max = Number(form.maxPrice);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
        return "Budget must be a positive number.";
      }
      if (min > max) return "Minimum budget can't be higher than maximum.";
      return null;
    }
    case 2:
      return null;
    case 3: {
      const qty = Number(form.quantity);
      return Number.isInteger(qty) && qty >= 1 ? null : "Quantity must be at least 1.";
    }
    case 4:
      if (!form.name.trim()) return "Your name is required.";
      if (!form.phone.trim()) return "A phone number is required.";
      return null;
    default:
      return null;
  }
}

export function SourcingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const validationError = validateStep(step, form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
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
    const result = await submitSourcingRequest(request);
    setReference(result.reference);
    setSubmitting(false);
    setStep(6);
  }

  const progressPercent = ((step + 1) / (steps.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Source My Vehicle</h1>
      <p className="mt-2 text-body text-muted-foreground">
        Tell us what you need. We&apos;ll find it, verify it, ship it and deliver it.
      </p>

      {step < 6 && (
        <div className="mt-8">
          <p className="text-label text-muted-foreground">
            Step {step + 1} of {steps.length - 1}: {steps[step]}
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
            <Label htmlFor="vehicleQuery">What vehicle are you looking for?</Label>
            <Input
              id="vehicleQuery"
              placeholder="e.g. BYD Song Plus, or a reliable SUV under $20,000"
              value={form.vehicleQuery}
              onChange={(e) => update("vehicleQuery", e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Minimum budget (USD)</Label>
              <Input
                id="minPrice"
                type="number"
                value={form.minPrice}
                onChange={(e) => update("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximum budget (USD)</Label>
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
            <Label htmlFor="specifications">Specifications (optional)</Label>
            <Textarea
              id="specifications"
              placeholder="e.g. Automatic transmission, sunroof, leather seats"
              value={form.specifications}
              onChange={(e) => update("specifications", e.target.value)}
              rows={4}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <Label htmlFor="quantity">How many vehicles?</Label>
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
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp number (optional)</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-foreground">Vehicle</h3>
                <button type="button" onClick={() => setStep(0)} className="text-small text-accent underline">
                  Edit
                </button>
              </div>
              <p className="mt-1 text-body text-muted-foreground">{form.vehicleQuery}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-foreground">Budget</h3>
                <button type="button" onClick={() => setStep(1)} className="text-small text-accent underline">
                  Edit
                </button>
              </div>
              <p className="mt-1 text-body text-muted-foreground">
                ${Number(form.minPrice).toLocaleString()} – ${Number(form.maxPrice).toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-foreground">Specifications</h3>
                <button type="button" onClick={() => setStep(2)} className="text-small text-accent underline">
                  Edit
                </button>
              </div>
              <p className="mt-1 text-body text-muted-foreground">
                {form.specifications.trim() || "None specified"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-foreground">Quantity</h3>
                <button type="button" onClick={() => setStep(3)} className="text-small text-accent underline">
                  Edit
                </button>
              </div>
              <p className="mt-1 text-body text-muted-foreground">{form.quantity}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-foreground">Your details</h3>
                <button type="button" onClick={() => setStep(4)} className="text-small text-accent underline">
                  Edit
                </button>
              </div>
              <p className="mt-1 text-body text-muted-foreground">
                {form.name} · {form.phone}
                {form.email && ` · ${form.email}`}
              </p>
            </div>
          </div>
        )}

        {step === 6 && reference && (
          <div className="rounded-lg border border-border p-6 text-center">
            <p className="text-h3 font-semibold text-foreground">Request received</p>
            <p className="mt-2 font-mono text-body text-foreground">{reference}</p>
            <p className="mt-4 text-body text-muted-foreground">
              A sourcing specialist will review your request and follow up with options.
              Save your reference to track progress once tracking is available.
            </p>
            <Button asChild className="mt-6">
              <a href="/">Back to homepage</a>
            </Button>
          </div>
        )}

        {error && <p className="mt-4 text-small text-destructive">{error}</p>}
      </div>

      {step < 6 && (
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={step === 0}>
            Back
          </Button>
          {step < 5 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit request"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
