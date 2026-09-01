"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFleetEnquiry } from "@/lib/data/fleet";
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

function validate(form: FormState): string | null {
  if (!form.companyName.trim()) return "Company name is required.";
  if (!form.contactName.trim()) return "Contact name is required.";
  if (!form.phone.trim()) return "A phone number is required.";
  const size = Number(form.fleetSize);
  if (!Number.isInteger(size) || size < 1) return "Fleet size must be at least 1.";
  return null;
}

export function FleetEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

    const enquiry: FleetEnquiry = {
      companyName: form.companyName,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email || undefined,
      fleetSize: Number(form.fleetSize),
      vehicleTypesNeeded: form.vehicleTypesNeeded,
      notes: form.notes || undefined,
      status: "submitted",
    };
    const result = await submitFleetEnquiry(enquiry);
    setReference(result.reference);
    setSubmitting(false);
  }

  if (reference) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="text-h3 font-semibold text-foreground">Enquiry received</p>
        <p className="mt-2 font-mono text-body text-foreground">{reference}</p>
        <p className="mt-4 text-body text-muted-foreground">
          A member of our fleet team will review your enquiry and follow up with next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          value={form.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactName">Contact name</Label>
        <Input
          id="contactName"
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="fleetSize">Fleet size</Label>
        <Input
          id="fleetSize"
          type="number"
          min={1}
          value={form.fleetSize}
          onChange={(e) => update("fleetSize", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehicleTypesNeeded">Vehicle types needed</Label>
        <Input
          id="vehicleTypesNeeded"
          placeholder="e.g. Sedans for ride-hailing, pickups for logistics"
          value={form.vehicleTypesNeeded}
          onChange={(e) => update("vehicleTypesNeeded", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      {error && <p className="text-small text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Request Fleet Quote"}
      </Button>
    </form>
  );
}
