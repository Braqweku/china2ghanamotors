# SEO and AEO for Shipping Cars from China to Ghana — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rank and be quoted for "ship/import car from China to Ghana" searches with a dedicated answer-first page, keyword titles, structured data, `llms.txt` and AI-crawler rules.

**Architecture:** Pure, tested helpers in `lib/seo/` (JSON-LD serialization and schema builders, robots rules, llms.txt text) used by pages and route handlers. Page text lives in `messages/*.json` under `shipping`; a shared `FaqList` renders FAQs on `/faq` and the new page.

**Tech Stack:** Next.js 15 App Router, next-intl 4, Node test runner.

Spec: `docs/superpowers/specs/2026-11-16-seo-aeo-shipping-design.md`

## Global Constraints

- Vehicles only; the only logistics fact published is "shipped to Tema Port, Ghana". No transit times, prices, address or phone.
- Every new message key exists in en, fr, pt, zh (enforced by `tests/i18n-messages.test.ts`).
- JSON-LD is serialized with `<` escaped.
- `lib/seo/*.ts` use relative `.ts` imports so Node tests can load them.
- `/admin` stays disallowed for every crawler.

---

### Task 1: SEO helpers (TDD)

**Files:** Create `lib/seo/json-ld.ts`, `lib/seo/robots.ts`, `lib/seo/llms.ts`, `components/seo/json-ld.tsx`; Test `tests/seo.test.ts`.

**Produces:**
- `serializeJsonLd(data: object): string`
- `organizationSchema()`, `websiteSchema(locale)`, `serviceSchema(locale, url, description)`, `faqSchema(items: {question, answer}[])`, `breadcrumbSchema(items: {name, url}[])`, `articleSchema({...})`
- `robotsConfig(baseUrl): MetadataRoute.Robots`, `AI_CRAWLERS: string[]`
- `buildLlmsTxt(baseUrl): string`
- `<JsonLd data={...} />`

Tests: escaping `</script>`; robots allows each AI crawler and disallows `/admin`; llms text contains the shipping URL in every language and "Tema Port".

### Task 2: Shipping page, shared FAQ list, internal links

Create `app/[locale]/shipping-cars-from-china-to-ghana/page.tsx`, `components/faq/faq-list.tsx`; modify `app/[locale]/faq/page.tsx`, footer, journey, sitemap; add `shipping` messages (en first).

### Task 3: Structured data across pages

Layout (Organization + WebSite), vehicle detail, insights article (Article + Breadcrumb), shipping page (Service + FAQPage + Breadcrumb) via `JsonLd`; `app/robots.ts` and `app/llms.txt/route.ts` use the helpers.

### Task 4: Keyword titles/descriptions + translations

Rewrite meta strings in en/fr/pt/zh; add fr/pt/zh `shipping` messages; tests green.

### Task 5: Verify and ship

`npm test`, lint, build; local curl checks; push; live checks of titles, JSON-LD parse, `/llms.txt`, `/robots.txt`.
