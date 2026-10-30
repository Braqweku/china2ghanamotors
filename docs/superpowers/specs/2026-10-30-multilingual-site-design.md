# Multilingual public site — design

Date: 2026-10-30
Status: approved by owner ("go ahead")

## Goal

Foreign customers can read the whole public site in their own language. The
first visit picks the language automatically from what the visitor speaks and
where they are; after that, their own choice always wins.

## Languages

| Code | Language   | Native label | URL prefix |
| ---- | ---------- | ------------ | ---------- |
| en   | English    | English      | none (default) |
| fr   | French     | Français     | `/fr` |
| pt   | Portuguese | Português    | `/pt` |
| zh   | Chinese (Simplified) | 中文 | `/zh` |

Adding a language later = one entry in the locale list + one messages file +
article translations.

## Scope

Translated: every public page, header, footer, menus, forms and their
validation messages, FAQ, tracking stage names, vehicle labels (body type,
fuel, gearbox, spec names, colours, registration month), Insights articles,
page titles and descriptions, image alt text, the customer auto-reply email.

Not translated:
- `/admin` — staff only, stays English.
- Make, model and trim names (manufacturer edition names such as "Elite",
  "240TURBO").
- What customers type into forms.
- Emails sent to our team (they get an added "Language" field instead).

## Routing

- `next-intl` (v4) with `localePrefix: "as-needed"`: English stays at
  `/vehicles`, other languages at `/fr/vehicles`, `/pt/...`, `/zh/...`.
- Public routes move from `app/*` to `app/[locale]/*`.
- `/admin`, `/api`, `/_next`, and files with an extension (images, sitemap,
  robots, icons) are not localized.
- Every page is still statically generated per locale where it is today.

## Language detection (first visit only)

Order, first match wins:

1. `NEXT_LOCALE` cookie (set when the visitor picks a language or opens a
   localized URL).
2. Browser/phone language (`Accept-Language`), the language they speak.
3. Country from Vercel's `x-vercel-ip-country` header:
   - French: CI, SN, TG, BJ, BF, ML, NE, GN, CM, CD, CG, GA, TD, CF, MG, FR,
     BE, LU, MC, CH… (francophone Africa + Europe)
   - Portuguese: AO, MZ, GW, CV, ST, BR, PT, TL
   - Chinese: CN, HK, MO, TW, SG
4. English.

Implementation: a pure, unit-tested `detectLocale({ cookie, acceptLanguage,
country })` in `lib/i18n/detect.ts`. Middleware uses it only when the path has
no locale prefix and there is no cookie; then redirects to the detected
prefix (or serves English). A visitor who explicitly opens `/fr/...` gets
French regardless of detection.

Browser language comes before country on purpose: a Chinese speaker living in
Accra should get Chinese; a Ghanaian whose phone is in English gets English.

## Language switcher

- Header (desktop: compact select next to the CTA; mobile: inside the menu
  sheet) and footer.
- Shows each language in its own name; a globe icon (Lucide `Languages`).
- Switching keeps the current page and query string, sets the cookie.
- Not shown on `/admin`.

## Structure

- `i18n/routing.ts` — locales, default, prefix mode.
- `i18n/navigation.ts` — locale-aware `Link`, `useRouter`, `usePathname`,
  `redirect`, `getPathname`.
- `i18n/request.ts` — loads `messages/<locale>.json`.
- `messages/en.json`, `fr.json`, `pt.json`, `zh.json` — all UI text, grouped
  by area (`nav`, `home`, `vehicles`, `vehicle`, `source`, `fleet`, `track`,
  `faq`, `ev`, `insights`, `stages`, `labels`, `meta`, `common`).
- Articles: `lib/mock/articles.ts` keeps the shared fields (slug, category,
  date, read time); per-locale text lives in `lib/mock/articles/<locale>.ts`.
  `getArticles(locale)` merges them.
- `lib/vehicle-format.ts` label maps become translation keys; mileage and
  dates formatted with the active locale.
- `middleware.ts` runs both the admin session check (`/admin/*`) and locale
  handling (everything else public).
- `app/layout.tsx` becomes a pass-through; `app/[locale]/layout.tsx` and
  `app/admin/layout.tsx` each render `<html>` (admin with `lang="en"`).
- `<html lang>` set per locale; Chinese gets a CJK-capable font stack
  fallback (system fonts; Geist has no CJK glyphs).

## SEO

- Each page's metadata includes `alternates.languages` (hreflang for en, fr,
  pt, zh and `x-default` → English) and a canonical for its own locale.
- Sitemap lists every URL per locale with the same alternates.
- Open Graph `locale` set per language.

## Error handling

- Unknown locale prefix → 404.
- A missing message key fails the key-parity test (below) rather than showing
  a raw key in production.
- If geolocation/Accept-Language headers are missing, detection falls through
  to English.

## Testing

- `tests/i18n-detect.test.ts`: cookie wins; Accept-Language with q-values;
  regional tags (`fr-CI`, `pt-BR`, `zh-Hant-TW`) map to base locale;
  unsupported language falls through to country; no headers → English.
- `tests/i18n-messages.test.ts`: all four messages files have identical key
  sets and no empty strings; article translations exist for every slug in
  every locale with the same paragraph count.
- Existing 16 tests keep passing; `next build` passes.
- Screenshots of home, vehicles, vehicle detail, source and track in each
  language at 390px and desktop to check text length and CJK rendering.

## Translation quality

Translations are written by Claude. Recommend a native speaker skim fr, pt
and zh before heavy promotion in those markets.
