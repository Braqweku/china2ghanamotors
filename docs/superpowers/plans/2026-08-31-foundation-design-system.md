# Foundation & Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js application shell, design-token system, shared TypeScript data contracts, and site layout (header/footer) that every subsequent China2Ghana Motors page (Homepage, Marketplace, Vehicle Detail, Sourcing wizard, Tracking, Fleet, EV, Insights) will build on.

**Architecture:** Next.js 15 App Router project with Server Components by default, Tailwind CSS + shadcn/ui (Radix primitives, Lucide icons) for the component system, and a repository/service layer (`lib/data/*`) that exposes async functions over local mock data now so a real backend can replace the internals later without touching any component.

**Tech Stack:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v4, shadcn/ui, Radix primitives, Lucide icons, Geist font, npm.

## Global Constraints

(Copied from `docs/design-spec.md`, approved 2026-08-31.)

- Stack is fixed: Next.js 15 App Router + TypeScript strict + Tailwind + shadcn/ui + Radix + Lucide + npm. Do not introduce another component/icon/animation library.
- Server Components by default; add `"use client"` only where a component genuinely needs interactivity/state.
- No dark mode in this plan — not a stated requirement.
- Color tokens (final values, derived from the provided logo — navy + controlled red):
  - `background` `hsl(40 20% 98%)` — warm off-white
  - `foreground` / `primary` `hsl(213 63% 14%)` — deep navy (`#0B1F3A`)
  - `primary-foreground` `hsl(40 20% 98%)` — off-white on navy
  - `accent` `hsl(358 70% 50%)` — controlled red (`#D6262C`), used sparingly for CTAs/price emphasis, never as a full-section background
  - `muted` `hsl(40 9% 94%)`, `muted-foreground` `hsl(220 9% 46%)`
  - `border` `hsl(40 10% 88%)`
  - `success` `hsl(152 63% 33%)`
  - `warning` `hsl(35 82% 42%)`
  - `destructive` `hsl(0 74% 42%)` — deliberately distinct from `accent` so "brand CTA red" and "error red" never read as the same signal
- Radius scale: `sm` 6px, `md` 10px, `lg` 14px — restrained, no oversized rounding.
- Motion: duration tokens `fast` 150ms / `base` 250ms / `slow` 400ms, easing `cubic-bezier(0.22, 1, 0.36, 1)` (not the generic `cubic-bezier(0.4,0,0.2,1)`). Every animation must serve comprehension, hierarchy, feedback, spatial relationship, or responsiveness — otherwise it doesn't ship. Hover effects gated behind `@media (hover: hover) and (pointer: fine)`. `prefers-reduced-motion` handled at the token layer.
- Typography: Geist Sans for all UI/body text; Geist Mono reserved for tracking reference codes only (not used in this plan yet — no tracking UI here).
- No fabricated testimonials, certifications, reviews, or supplier claims anywhere in mock data or copy.
- No hardcoded business contact info (WhatsApp number, phone, email) — environment variable placeholders only.
- Responsive breakpoints to verify at the end: 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920px.
- **No automated test framework in this plan** (approved in the spec — Foundation has no real business logic yet; TDD unit-test steps are replaced below with `tsc --noEmit`, `next lint`, `next build`, and explicit dev-server verification steps that serve the same "verify before commit" purpose).

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create (via `create-next-app`, then moved into place): `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/*` (default assets, replaced later)
- Do not touch: `CLAUDE.md`, `docs/`, `.agents/`, `.claude/`, `skills-lock.json`, `.git/`

**Interfaces:**
- Produces: a working `npm run build` / `npm run dev` Next.js app that later tasks add to.

- [ ] **Step 1: Scaffold into a temporary directory (the project root already has non-scaffold files, so we scaffold elsewhere and merge)**

Run:
```bash
cd /c/src
npx create-next-app@latest c2g-scaffold-tmp --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --turbopack=false --yes
```
Expected: command completes, `c2g-scaffold-tmp/` exists with `package.json`, `app/`, `public/`, `tsconfig.json`, `next.config.ts`, `.gitignore`.

- [ ] **Step 2: Remove the scaffold's own git repo (we already have one at the project root)**

Run:
```bash
rm -rf "/c/src/c2g-scaffold-tmp/.git"
```
Expected: no output, `.git` no longer exists under `c2g-scaffold-tmp`.

- [ ] **Step 3: Move all scaffold files into the project root**

Run:
```bash
cd "/c/src/c2g-scaffold-tmp"
cp -r . "/c/src/china2ghana motors/"
cd "/c/src"
rm -rf "/c/src/c2g-scaffold-tmp"
```
Expected: no output. `ls "/c/src/china2ghana motors"` now shows both the original files (`CLAUDE.md`, `docs/`, `.agents/`, `.claude/`, `skills-lock.json`, `.git/`) and the new Next.js files (`app/`, `public/`, `package.json`, etc.).

- [ ] **Step 4: Install dependencies**

Run:
```bash
cd "/c/src/china2ghana motors"
npm install
```
Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 5: Add a project `.gitignore` entry check and verify the build**

Run:
```bash
cd "/c/src/china2ghana motors"
cat .gitignore
npm run build
```
Expected: `.gitignore` includes `node_modules`, `.next`, `.env*.local` (create-next-app's default already covers these — if any are missing, add them). `npm run build` exits 0 with a `.next` production build produced.

- [ ] **Step 6: Commit**

```bash
cd "/c/src/china2ghana motors"
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs .gitignore app public next-env.d.ts
git commit -m "chore: scaffold Next.js 15 app (TypeScript, Tailwind, App Router, ESLint)"
```

---

### Task 2: Install and initialize shadcn/ui

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/badge.tsx`, `components/ui/separator.tsx`, `components/ui/skeleton.tsx`, `components/ui/sheet.tsx`
- Modify: `app/globals.css` (shadcn init injects its own base tokens here — Task 3 immediately overwrites the color values with the palette above)

**Interfaces:**
- Produces: `cn()` from `lib/utils.ts` (used by every component going forward), and the six shadcn primitives listed above importable from `@/components/ui/*`.

- [ ] **Step 1: Run shadcn init**

Run:
```bash
cd "/c/src/china2ghana motors"
npx shadcn@latest init -d
```
Expected: exits 0, creates `components.json` and `lib/utils.ts`, adds base CSS variables to `app/globals.css`.

- [ ] **Step 2: Add the six Foundation components**

Run:
```bash
npx shadcn@latest add button card badge separator skeleton sheet
```
Expected: exits 0, creates the six files listed above under `components/ui/`.

- [ ] **Step 3: Verify it builds**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add components.json lib/utils.ts components/ui app/globals.css package.json package-lock.json
git commit -m "chore: initialize shadcn/ui with button, card, badge, separator, skeleton, sheet"
```

---

### Task 3: Design tokens — color, radius, shadow, motion

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS custom properties (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--accent`, `--accent-foreground`, `--muted`, `--muted-foreground`, `--border`, `--success`, `--warning`, `--destructive`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-ease`) that every later task's Tailwind classes (`bg-background`, `text-primary`, `rounded-md`, etc.) resolve against.

- [ ] **Step 1: Open `app/globals.css` and locate the `:root` block shadcn's init generated**

Read the file first to see the exact variable names `shadcn init` produced (they follow the pattern below, but confirm before editing):

```bash
cat "app/globals.css"
```

- [ ] **Step 2: Replace the color variables in `:root` with the approved palette**

Edit `app/globals.css` so the `:root` block contains (keep any structural CSS shadcn generated around it, such as `@theme inline` mappings — only the values change):

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 0.875rem;

  --background: hsl(40 20% 98%);
  --foreground: hsl(213 63% 14%);

  --primary: hsl(213 63% 14%);
  --primary-foreground: hsl(40 20% 98%);

  --secondary: hsl(40 9% 94%);
  --secondary-foreground: hsl(213 63% 14%);

  --accent: hsl(358 70% 50%);
  --accent-foreground: hsl(40 20% 98%);

  --muted: hsl(40 9% 94%);
  --muted-foreground: hsl(220 9% 46%);

  --border: hsl(40 10% 88%);
  --input: hsl(40 10% 88%);
  --ring: hsl(213 63% 14%);

  --success: hsl(152 63% 33%);
  --warning: hsl(35 82% 42%);
  --destructive: hsl(0 74% 42%);
  --destructive-foreground: hsl(40 20% 98%);

  --card: hsl(0 0% 100%);
  --card-foreground: hsl(213 63% 14%);

  --shadow-sm: 0 1px 2px hsl(213 63% 14% / 0.06);
  --shadow-md: 0 4px 10px hsl(213 63% 14% / 0.08);
  --shadow-lg: 0 12px 24px hsl(213 63% 14% / 0.10);

  --motion-fast: 150ms;
  --motion-base: 250ms;
  --motion-slow: 400ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

- [ ] **Step 3: Add a `prefers-reduced-motion` block at the bottom of `app/globals.css`**

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Verify the app builds and the tokens apply**

Run:
```bash
npm run build
npm run dev
```
Expected: build exits 0. With `npm run dev` running, open `http://localhost:3000` — the default scaffold page background should now read as warm off-white rather than the create-next-app default, confirming the CSS variables are wired through Tailwind's `@theme` mapping. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply China2Ghana Motors design tokens (color, radius, shadow, motion)"
```

---

### Task 4: Geist font wiring

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `font-sans` (Geist Sans) applied globally via a `<body>` class; `--font-geist-mono` CSS variable available for later tasks (tracking references) even though nothing consumes it yet.

- [ ] **Step 1: Read the current `app/layout.tsx`**

```bash
cat "app/layout.tsx"
```

- [ ] **Step 2: Replace its font setup to use Geist Sans and Geist Mono from `next/font/google`**

Edit `app/layout.tsx` so the top imports and the `<body>` tag read:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "China2Ghana Motors",
  description: "China to Ghana. Driven by Trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Map `font-sans` to the Geist variable in `app/globals.css`**

Add to the `:root` block (or the `@theme inline` block if shadcn's init created one — put it wherever the other `--font-*` mappings live):

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

- [ ] **Step 4: Verify**

Run:
```bash
npm run build
```
Expected: exits 0. `npm run dev`, open `http://localhost:3000`, confirm body text visibly renders in Geist (not the browser default serif/sans) via DevTools "Computed" font-family check. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: wire up Geist Sans/Mono as the site typeface"
```

---

### Task 5: Shared TypeScript types

**Files:**
- Create: `types/vehicle.ts`, `types/sourcing.ts`, `types/tracking.ts`, `types/index.ts`

**Interfaces:**
- Produces: `Vehicle`, `VehicleType`, `FuelType`, `Transmission`, `Condition`, `Availability` (from `types/vehicle.ts`); `SourcingRequest`, `SourcingRequestStatus` (from `types/sourcing.ts`); `TrackingEvent`, `TrackingStage` (from `types/tracking.ts`) — all re-exported from `types/index.ts`. Task 6 imports all of these.

- [ ] **Step 1: Create `types/vehicle.ts`**

```ts
export type VehicleType = "sedan" | "suv" | "pickup" | "van" | "hatchback" | "truck";
export type FuelType = "petrol" | "hybrid" | "electric" | "diesel";
export type Transmission = "automatic" | "manual";
export type Condition = "new" | "used";
export type Availability = "available" | "sourcing" | "sold";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  transmission: Transmission;
  mileageKm: number;
  condition: Condition;
  priceUsd: number;
  images: string[];
  availability: Availability;
  supplierId: string;
  specs: Record<string, string>;
};
```

- [ ] **Step 2: Create `types/sourcing.ts`**

```ts
export type SourcingRequestStatus = "submitted" | "reviewing" | "quoted";

export type SourcingRequest = {
  vehicleQuery: string;
  budgetUsd: { min: number; max: number };
  specifications: string[];
  quantity: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    whatsapp?: string;
    location?: string;
  };
  status: SourcingRequestStatus;
};
```

- [ ] **Step 3: Create `types/tracking.ts`**

```ts
export type TrackingStage =
  | "received"
  | "sourcing"
  | "selected"
  | "verification"
  | "inspection"
  | "purchased"
  | "ready_to_ship"
  | "in_transit"
  | "arrived_ghana"
  | "clearing"
  | "ready_for_delivery"
  | "delivered";

export type TrackingEvent = {
  reference: string;
  stage: TrackingStage;
  timestamp: string;
  note?: string;
};
```

- [ ] **Step 4: Create `types/index.ts`**

```ts
export * from "./vehicle";
export * from "./sourcing";
export * from "./tracking";
```

- [ ] **Step 5: Verify**

Run:
```bash
npx tsc --noEmit
```
Expected: exits 0, no type errors.

- [ ] **Step 6: Commit**

```bash
git add types
git commit -m "feat: add shared Vehicle, SourcingRequest, and TrackingEvent types"
```

---

### Task 6: Mock data and repository functions

**Files:**
- Create: `lib/mock/vehicles.ts`, `lib/mock/tracking.ts`, `lib/data/vehicles.ts`, `lib/data/tracking.ts`, `lib/data/sourcing.ts`

**Interfaces:**
- Consumes: `Vehicle`, `TrackingEvent`, `TrackingStage`, `SourcingRequest` from `@/types` (Task 5).
- Produces:
  - `getVehicles(): Promise<Vehicle[]>` and `getVehicleById(id: string): Promise<Vehicle | null>` from `@/lib/data/vehicles`
  - `getTrackingEvents(reference: string): Promise<TrackingEvent[]>` from `@/lib/data/tracking`
  - `submitSourcingRequest(req: SourcingRequest): Promise<{ reference: string }>` from `@/lib/data/sourcing`
  - These are what Task 9's placeholder page (and every future sub-project) import — no other module should read `lib/mock/*` directly.

- [ ] **Step 1: Create `lib/mock/vehicles.ts`**

```ts
import type { Vehicle } from "@/types";

export const mockVehicles: Vehicle[] = [
  {
    id: "veh_001",
    make: "BYD",
    model: "Song Plus",
    year: 2024,
    vehicleType: "suv",
    fuelType: "hybrid",
    transmission: "automatic",
    mileageKm: 0,
    condition: "new",
    priceUsd: 24500,
    images: [],
    availability: "sourcing",
    supplierId: "sup_001",
    specs: { engine: "1.5T Hybrid", seats: "5", drivetrain: "FWD" },
  },
  {
    id: "veh_002",
    make: "Wuling",
    model: "Hongguang MINI EV",
    year: 2024,
    vehicleType: "hatchback",
    fuelType: "electric",
    transmission: "automatic",
    mileageKm: 0,
    condition: "new",
    priceUsd: 9800,
    images: [],
    availability: "sourcing",
    supplierId: "sup_002",
    specs: { range: "170km", seats: "4", battery: "17.3kWh" },
  },
  {
    id: "veh_003",
    make: "JAC",
    model: "T8 Pickup",
    year: 2023,
    vehicleType: "pickup",
    fuelType: "diesel",
    transmission: "manual",
    mileageKm: 12000,
    condition: "used",
    priceUsd: 21200,
    images: [],
    availability: "sourcing",
    supplierId: "sup_003",
    specs: { engine: "2.0T Diesel", seats: "5", drivetrain: "4WD" },
  },
];
```

- [ ] **Step 2: Create `lib/mock/tracking.ts`**

```ts
import type { TrackingEvent } from "@/types";

export const mockTrackingEvents: Record<string, TrackingEvent[]> = {
  "C2G-8837XJ": [
    { reference: "C2G-8837XJ", stage: "received", timestamp: "2026-07-01T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "sourcing", timestamp: "2026-07-03T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "selected", timestamp: "2026-07-10T09:00:00Z" },
    { reference: "C2G-8837XJ", stage: "verification", timestamp: "2026-07-14T09:00:00Z" },
  ],
};
```

- [ ] **Step 3: Create `lib/data/vehicles.ts`**

```ts
import type { Vehicle } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";

export async function getVehicles(): Promise<Vehicle[]> {
  return mockVehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}
```

- [ ] **Step 4: Create `lib/data/tracking.ts`**

```ts
import type { TrackingEvent } from "@/types";
import { mockTrackingEvents } from "@/lib/mock/tracking";

export async function getTrackingEvents(reference: string): Promise<TrackingEvent[]> {
  return mockTrackingEvents[reference] ?? [];
}
```

- [ ] **Step 5: Create `lib/data/sourcing.ts`**

```ts
import type { SourcingRequest } from "@/types";

export async function submitSourcingRequest(
  _req: SourcingRequest
): Promise<{ reference: string }> {
  const reference = `C2G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { reference };
}
```

- [ ] **Step 6: Verify types**

Run:
```bash
npx tsc --noEmit
```
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add lib/mock lib/data
git commit -m "feat: add mock data and repository functions for vehicles, tracking, sourcing"
```

---

### Task 7: Config placeholders (WhatsApp / contact env vars)

**Files:**
- Create: `.env.example`, `lib/config.ts`

**Interfaces:**
- Produces: `siteConfig.whatsappNumber`, `siteConfig.contactEmail` from `@/lib/config` — Task 8's Header/Footer import `siteConfig`, nothing else does yet.

- [ ] **Step 1: Create `.env.example`**

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=233000000000
NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
```

- [ ] **Step 2: Create `lib/config.ts`**

```ts
export const siteConfig = {
  name: "China2Ghana Motors",
  tagline: "China to Ghana. Driven by Trust.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233000000000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
};

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
```

- [ ] **Step 3: Verify**

Run:
```bash
npx tsc --noEmit
```
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add .env.example lib/config.ts
git commit -m "feat: add site config with WhatsApp/contact env var placeholders"
```

---

### Task 8: Header and Footer

**Files:**
- Create: `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/layout/logo.tsx`
- Note: `public/logo/china2ghana-logo.png` is a **required manual prerequisite** for this task — the logo image provided in chat could not be extracted to disk automatically. Before running this task, save the logo image to that exact path (create the `public/logo/` folder if needed). `components/layout/logo.tsx` renders it via `next/image` and will fail to build without the file present.

**Interfaces:**
- Consumes: `siteConfig`, `buildWhatsAppLink` from `@/lib/config` (Task 7); `Button`, `Sheet`, `SheetContent`, `SheetTrigger` from `@/components/ui/*` (Task 2).
- Produces: `<Header />` and `<Footer />` from `@/components/layout/header` and `@/components/layout/footer` — Task 9 imports both into `app/layout.tsx`.

- [ ] **Step 1: Create `components/layout/logo.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="China2Ghana Motors home">
      <Image
        src="/logo/china2ghana-logo.png"
        alt="China2Ghana Motors"
        width={160}
        height={160}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
```

- [ ] **Step 2: Create `components/layout/header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig, buildWhatsAppLink } from "@/lib/config";

const navLinks = [
  { href: "/vehicles", label: "Vehicles" },
  { href: "/source", label: "Source My Vehicle" },
  { href: "/track", label: "Track" },
  { href: "/fleet", label: "Fleet" },
  { href: "/ev", label: "EV" },
  { href: "/insights", label: "Insights" },
];

export function Header() {
  const whatsappHref = buildWhatsAppLink(
    `Hi ${siteConfig.name}, I'd like to speak with a sourcing specialist.`
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Chat with a Sourcing Specialist
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-base font-medium">
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
              >
                <Button className="w-full">Chat with a Sourcing Specialist</Button>
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `components/layout/footer.tsx`**

```tsx
import Link from "next/link";
import { siteConfig } from "@/lib/config";

const footerLinks = [
  { href: "/vehicles", label: "Vehicles" },
  { href: "/source", label: "Source My Vehicle" },
  { href: "/track", label: "Track an Order" },
  { href: "/fleet", label: "Corporate & Fleet" },
  { href: "/insights", label: "Insights" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-foreground">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Verify types**

Run:
```bash
npx tsc --noEmit
```
Expected: exits 0. (The build itself is verified in Task 9 once these are wired into `app/layout.tsx` — a header/footer with no page can't be build-verified in isolation.)

- [ ] **Step 5: Commit**

```bash
git add components/layout
git commit -m "feat: add Header and Footer site-shell components"
```

---

### Task 9: Wire the root layout and placeholder home page

**Files:**
- Modify: `app/layout.tsx`, `app/page.tsx`
- Create: `app/error.tsx`, `app/loading.tsx`

**Interfaces:**
- Consumes: `Header`, `Footer` (Task 8); `getVehicles` (Task 6); `Skeleton` (Task 2).
- Produces: a rendering site shell — this is the integration point later sub-projects (starting with Homepage) replace `app/page.tsx`'s body against.

- [ ] **Step 1: Update `app/layout.tsx` to render the site shell**

Edit the `<body>` in `app/layout.tsx` (built on top of Task 4's version) to:

```tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// ...keep the geistSans/geistMono/metadata setup from Task 4 above this...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx` with a placeholder that proves the data layer works end-to-end**

```tsx
import { getVehicles } from "@/lib/data/vehicles";

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">
        China2Ghana Motors — Foundation
      </h1>
      <p className="mt-2 text-muted-foreground">
        Homepage build is the next sub-project. This placeholder confirms the
        design system, layout shell, and data layer are wired up.
      </p>
      <ul className="mt-8 space-y-2">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="rounded-md border border-border p-4">
            {vehicle.year} {vehicle.make} {vehicle.model} — ${vehicle.priceUsd.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-4 h-4 w-full max-w-md" />
      <div className="mt-8 space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `app/error.tsx`**

```tsx
"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground">
        Please try again, or contact us if the problem continues.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
```

- [ ] **Step 5: Verify the full build and dev render**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: all three exit 0.

Then:
```bash
npm run dev
```
Open `http://localhost:3000`. Confirm: Header renders with logo + nav + WhatsApp button, the three mock vehicles list under the placeholder heading, Footer renders at the bottom. Resize the browser to roughly 375px and 1280px widths and confirm the header collapses to the mobile Sheet menu below the `md` breakpoint. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add app
git commit -m "feat: wire root layout (Header/Footer) and placeholder home page"
```

---

### Task 10: Final Foundation quality gate

**Files:** none created — verification only.

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Responsive check**

Run: `npm run dev`, open `http://localhost:3000` in a browser with DevTools responsive mode, and check the header/footer/placeholder content at each of: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px widths. Confirm no horizontal scroll, no overlapping text, and the mobile nav Sheet appears below 768px. Stop the dev server.

- [ ] **Step 5: Confirm no console errors**

While the dev server is running from Step 4, open the browser DevTools console on the home page and confirm there are zero errors or warnings (React hydration warnings included).

- [ ] **Step 6: Commit (only if any fixes were needed in Steps 1–5; otherwise this task produces no new commit)**

```bash
git add -A
git commit -m "fix: address Foundation quality-gate findings"
```

---

## Self-Review Notes

- **Spec coverage:** §1 Brand → informs Task 8 copy (tagline, WhatsApp CTA text). §2 UX (IA/nav) → Task 8 nav links. §3 UI (tokens, components) → Tasks 2–4. §4 Motion → Task 3 tokens (actual animated components arrive with Homepage, which is the next sub-project — nothing in Foundation needs to animate). §5 Responsive → Task 10. §6 Data Architecture → Tasks 5–6. §7 Stack/Structure → Task 1. §9 Config placeholders → Task 7. §8 Roadmap is not implemented here by design — it's the list of future sub-projects.
- **Placeholder scan:** no TBD/TODO left in any step; the one genuine open item (logo file) is called out explicitly as a manual prerequisite in Task 8, not glossed over.
- **Type consistency:** `Vehicle`, `SourcingRequest`, `TrackingEvent`/`TrackingStage` field names match exactly between Task 5 (definition) and Task 6 (mock data + repository functions) and Task 9 (consumption in `app/page.tsx`).
