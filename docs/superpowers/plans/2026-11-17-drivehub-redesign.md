# DriveHub-style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the public site DriveHub's monochrome, photo-led look while keeping all content, translations and SEO.

**Architecture:** Theme tokens in `app/globals.css` drive colours/radius/type; shared primitives (`SectionHeading`, `PhotoBand`, `Slider`) under `components/site/`; homepage rebuilt from section components in `components/home/`; other pages restyled through shared header/card/heading components.

**Tech Stack:** Next.js 15, Tailwind v4, shadcn/ui, next-intl, lucide-react.

Spec: `docs/superpowers/specs/2026-11-17-drivehub-redesign-design.md`

## Global Constraints

- No push/deploy until the owner has previewed locally.
- Vehicle photos stay `object-contain`; stock photos may use `object-cover`.
- No prices, phone number, address or invented reviews.
- Every new string in en, fr, pt, zh (tests enforce key parity).
- No scroll-triggered animation; respect `prefers-reduced-motion`.

---

### Task 1: Stock photos
Download ~12 free-licence photos to `public/stock/`, resize ≤2000px, record sources in `public/stock/CREDITS.md`.

### Task 2: Theme tokens and primitives
`app/globals.css` tokens (colours, radius, heading tracking); `components/site/section-heading.tsx` (label + H2, align), `components/site/photo-band.tsx` (full-bleed image + overlay + children), `components/site/slider.tsx` (scroll-snap row + arrow buttons, client).

### Task 3: Shell
`components/layout/contact-bar.tsx`; header variants (`overlay` on home, `solid` elsewhere) chosen by pathname; footer with giant wordmark.

### Task 4: Homepage sections
Hero, vehicle types slider, featured vehicles, services, photo band, brands grid, about band, how-it-works slider, CTA. Messages in 4 languages.

### Task 5: Shared card and page headers
`VehicleCard` restyle (spec icons, hairline card); `PageHeader` gains label; restyle filters and form panels.

### Task 6: Page passes
Vehicles, detail, EV, shipping, source, fleet, track, FAQ, insights, article.

### Task 7: Verify and preview
Tests, lint, build; screenshots en/fr/zh desktop + 390px; side-by-side with DriveHub; run local preview for the owner. No push.
