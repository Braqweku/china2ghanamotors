# Multilingual Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the public site in English, French, Portuguese and Chinese, picking the first-visit language from the visitor's browser language, then country, with a switcher that remembers their choice.

**Architecture:** `next-intl` v4 with `localePrefix: "as-needed"`. Public routes move under `app/[locale]/`; `/admin` stays outside and English-only. A pure `detectLocale()` decides first-visit language; middleware combines it with the existing admin session check. All UI text lives in `messages/<locale>.json`; article bodies live in `lib/mock/articles/<locale>.ts`.

**Tech Stack:** Next.js 15.5 App Router, React 19, next-intl 4.x, Tailwind v4, shadcn/ui, Node built-in test runner.

Spec: `docs/superpowers/specs/2026-10-30-multilingual-site-design.md`

## Global Constraints

- Locales exactly `["en", "fr", "pt", "zh"]`; default `en`; English URLs unprefixed.
- Cookie name `NEXT_LOCALE`.
- Detection order: cookie → Accept-Language → `x-vercel-ip-country` → `en`.
- `/admin/*` is never localized, keeps `lang="en"` and the existing HMAC session check.
- Make, model and trim strings are never translated.
- Every messages file has the same key set; no empty strings.
- Photos stay `object-contain` in 4:3 frames (existing rule).
- No secrets, prices or seller notes committed (public repo).

---

### Task 1: Locale detection (pure, TDD)

**Files:**
- Create: `lib/i18n/locales.ts`, `lib/i18n/detect.ts`
- Test: `tests/i18n-detect.test.ts`

**Interfaces:**
- Produces: `locales`, `type Locale`, `defaultLocale`, `localeNames: Record<Locale,string>`, `isLocale(x): x is Locale`, `detectLocale({ cookie?, acceptLanguage?, country? }): Locale`

- [ ] **Step 1: Write the failing test** (`tests/i18n-detect.test.ts`)

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectLocale } from "../lib/i18n/detect.ts";

test("cookie wins over everything", () => {
  assert.equal(detectLocale({ cookie: "pt", acceptLanguage: "fr", country: "CN" }), "pt");
});
test("invalid cookie is ignored", () => {
  assert.equal(detectLocale({ cookie: "de", acceptLanguage: "fr-FR" }), "fr");
});
test("accept-language respects q-values and regional tags", () => {
  assert.equal(detectLocale({ acceptLanguage: "de;q=0.9, zh-Hant-TW;q=0.95" }), "zh");
  assert.equal(detectLocale({ acceptLanguage: "pt-BR,en;q=0.8" }), "pt");
});
test("browser language beats country", () => {
  assert.equal(detectLocale({ acceptLanguage: "zh-CN", country: "GH" }), "zh");
  assert.equal(detectLocale({ acceptLanguage: "en-GB", country: "CI" }), "en");
});
test("unsupported browser language falls back to country", () => {
  assert.equal(detectLocale({ acceptLanguage: "wo-SN", country: "SN" }), "fr");
  assert.equal(detectLocale({ acceptLanguage: "ar", country: "AO" }), "pt");
});
test("nothing usable means English", () => {
  assert.equal(detectLocale({}), "en");
  assert.equal(detectLocale({ acceptLanguage: "*", country: "GH" }), "en");
});
```

- [ ] **Step 2:** `npm test` → FAIL (module not found).
- [ ] **Step 3:** Implement `lib/i18n/locales.ts` (constants + `isLocale`) and `lib/i18n/detect.ts` (parse Accept-Language into tags sorted by q desc, map each to its base subtag, first supported wins; else country map; else `en`). Relative imports only (tests run with Node type stripping, no path aliases).
- [ ] **Step 4:** `npm test` → all pass.
- [ ] **Step 5:** Commit `feat(i18n): locale list and first-visit language detection`.

### Task 2: next-intl wiring, middleware, route move

**Files:**
- Create: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `messages/en.json`, `app/[locale]/layout.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx`, `app/admin/error.tsx`, `lib/fonts.ts`
- Move (git mv): `app/{page.tsx,loading.tsx,error.tsx,ev,faq,fleet,insights,source,track,vehicles}` → `app/[locale]/…`
- Modify: `app/layout.tsx` (pass-through + globals.css), `app/admin/layout.tsx` (own `<html lang="en">`, Header/Footer, English provider), `app/not-found.tsx` (own `<html>`), `middleware.ts`, `next.config.ts`, `package.json`

**Interfaces:**
- Produces: `routing`, and `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` from `@/i18n/navigation`; `[locale]` param on every public page.

- [ ] **Step 1:** `npm install next-intl@4.14.9`.
- [ ] **Step 2:** `i18n/routing.ts` uses `locales`/`defaultLocale` from `lib/i18n/locales.ts`, `localePrefix: "as-needed"`, cookie `NEXT_LOCALE` (1 year), `localeDetection: false` (our own detection runs first).
- [ ] **Step 3:** `middleware.ts`: `/admin` → existing session logic. Otherwise: if path has no locale prefix and no `NEXT_LOCALE` cookie, run `detectLocale` with `accept-language` and `x-vercel-ip-country`; if result ≠ `en`, redirect to `/<locale><path><search>` and set the cookie. Then delegate to `createMiddleware(routing)`. Matcher: `["/((?!api|_next|_vercel|.*\\..*).*)"]`.
- [ ] **Step 4:** `app/[locale]/layout.tsx`: `generateStaticParams` over locales, `hasLocale` → `notFound()`, `setRequestLocale(locale)`, `<html lang={locale}>`, `NextIntlClientProvider`, Header, Footer, organization JSON-LD, translated metadata with `openGraph.locale` and `alternates.languages`.
- [ ] **Step 5:** Every moved page calls `setRequestLocale(locale)` and uses `getTranslations`.
- [ ] **Step 6:** `npm run build` passes; curl checks: `/` with `Accept-Language: fr` → 307 `/fr`; with cookie `NEXT_LOCALE=en` → 200; `/admin` → 307 `/admin/login`; `/fr/vehicles` → 200.
- [ ] **Step 7:** Commit.

### Task 3: Extract all English UI text into `messages/en.json`

**Files:** every public page/component in spec scope; `lib/vehicle-format.ts`; `components/insights/article-meta.tsx`; `components/tracking/tracking-timeline.tsx`.

**Interfaces:**
- Message namespaces: `meta, nav, footer, common, home, vehicles, vehicle, labels, ev, source, fleet, track, stages, faq, insights, errors`.
- `lib/vehicle-format.ts` keeps English maps (admin + JSON-LD) and adds `formatMileage(km, locale)` and `formatRegistered(value, locale)`.
- Internal links use `Link` from `@/i18n/navigation`.

- [ ] Convert area by area keeping English wording identical; build; compare English screenshots with production; commit.

### Task 4: Articles per locale

**Files:** `lib/mock/articles.ts` (shared fields), `lib/mock/articles/{en,fr,pt,zh}.ts` (`Record<slug, { title, excerpt, content: string[] }>`), `lib/data/articles.ts` (`getArticles(locale)`, `getArticleBySlug(slug, locale)`).

### Task 5: French, Portuguese, Chinese translations + parity test

**Files:** `messages/{fr,pt,zh}.json`, `lib/mock/articles/{fr,pt,zh}.ts`, `tests/i18n-messages.test.ts` — every locale has the English key set, no empty strings, every article slug in every locale with the same paragraph count.

### Task 6: Language switcher, SEO alternates, sitemap, form auto-reply

**Files:** `components/layout/language-switcher.tsx` (shadcn `Select`, Lucide `Languages`), header/footer, `lib/i18n/alternates.ts`, `app/sitemap.ts`, `lib/data/sourcing.ts`, `lib/data/fleet.ts`, `app/globals.css` (`:lang(zh)` CJK font fallback).

### Task 7: Verify and ship

- [ ] `npm test`, `npm run lint`, `npm run build` pass.
- [ ] Screenshots at 390px and desktop per locale (home, vehicles, detail, source, track).
- [ ] Detection checks against the production build with curl.
- [ ] Push to master; check live `/`, `/fr`, `/zh/vehicles`, `/admin`.
