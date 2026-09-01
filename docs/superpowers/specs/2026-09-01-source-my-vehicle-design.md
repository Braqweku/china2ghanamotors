# Source My Vehicle Wizard — Design Spec

Status: Approved. Route: `/source`.

Builds on `docs/design-spec.md` (tokens) and the existing `SourcingRequest` type / `submitSourcingRequest` repository function from Foundation.

---

## 1. Structure

A single client component (`app/source/page.tsx` renders a client wizard component) with local state for the current step and accumulated form data — not routed sub-pages. Seven steps, matching the master brief §17:

1. **What vehicle?** — free-text query, maps to `SourcingRequest.vehicleQuery`.
2. **Budget** — min/max USD number inputs, maps to `budgetUsd: { min, max }`.
3. **Specifications** — a `Textarea`; on submit, split by commas/newlines into `specifications: string[]`.
4. **Quantity** — number input, default 1, maps to `quantity` (serves individual and fleet/bulk buyers alike).
5. **Customer details** — name + phone (required), email/WhatsApp/location (optional), maps to `customer`.
6. **Review** — read-only summary of every field, with an "Edit" link per section that jumps back to that step without losing other entered data.
7. **Confirmation** — calls `submitSourcingRequest(request)`, displays the returned reference (e.g. `C2G-8K3F2Q`) and next-steps copy. No fabricated "we'll contact you within X hours" promise — the brief prohibits fabricated claims, and no such SLA has been established.

## 2. Validation

Per-step, blocking "Next" until satisfied — plain field checks, not a form library (confirmed: no new test framework or validation library for this):
- Step 1: `vehicleQuery` non-empty.
- Step 2: both min and max are positive numbers, min ≤ max.
- Step 3: none required (specifications are optional detail).
- Step 4: quantity ≥ 1.
- Step 5: name non-empty, phone non-empty (a loose format check — digits/spaces/+/- only, not a strict international-format validator).

Inline error text under the relevant field, using the `destructive` token — not a toast, not a silent block.

## 3. Progress Indicator

"Step N of 7" label plus a thin progress bar, built from existing tokens (no new shadcn `Progress` dependency — a styled `div` with a width percentage is sufficient).

## 4. New Components

`components/ui/label.tsx`, `components/ui/textarea.tsx` (shadcn, Radix-backed — verify `-b radix` if `init` defaults resurface, per the Foundation lesson). Everything else (`Input`, `Button`) already exists.

## 5. Out of Scope

No persistence beyond the mock `submitSourcingRequest` stub (no real backend yet, consistent with the whole site). No file/photo upload. No account creation. No email/SMS confirmation (no real email service wired up).
