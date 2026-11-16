# SEO and AEO for "shipping cars from China to Ghana" — design

Date: 2026-11-16
Status: approved by owner ("go ahead")

## Goal

Make china2ghana-motors.com the clearest answer to searches about shipping and
importing cars from China to Ghana, on Google and in AI assistants (ChatGPT,
Claude, Perplexity, Google AI Overviews). Rankings cannot be guaranteed; this
work removes every on-site reason not to rank or be quoted.

## Scope decisions (from the owner)

- Vehicles only. No general cargo, freight or spare-parts keywords.
- Publishable facts: vehicles are shipped to **Tema Port**, Ghana.
- Not published (unconfirmed): transit times, office address, phone, delivery
  to neighbouring countries, prices.

## Target searches

Primary: ship car from China to Ghana; shipping cars from China to Ghana;
import car from China to Ghana; car import China to Ghana; China to Ghana car
shipping. Secondary: RoRo China to Tema; used cars from China in Ghana;
electric cars from China to Ghana; customs clearing car Ghana. Equivalent
phrasing in French, Portuguese and Chinese.

## Changes

### 1. Shipping landing page

`/shipping-cars-from-china-to-ghana` (and `/fr/…`, `/pt/…`, `/zh/…`, same slug).

Answer-first structure:
- H1 + one-paragraph direct answer (what we do, from China to Tema Port).
- "How it works" — 6 numbered steps (request → options → inspection →
  purchase → shipping to Tema → clearing and delivery).
- "RoRo or container" — two short definitions.
- "What affects the total cost" — vehicle price, shipping method, inspection,
  import duties and fees set by Ghanaian customs, exchange rates. No figures.
- "Clearing at Tema Port" — we handle documents and clearing.
- FAQ (8 questions in search wording) as an accordion.
- Call to action: request a vehicle / browse vehicles.

All text in `messages/*.json` under `shipping`. The FAQ accordion becomes a
shared `FaqList` component used by `/faq` and this page.

### 2. Titles and descriptions

Rewrite site title, homepage, vehicles, EV, source, FAQ, insights titles and
descriptions around the target searches, in all four languages. Titles stay
under ~60 characters before the "| China2Ghana Motors" suffix; descriptions
under ~160.

### 3. Structured data

- `lib/seo/json-ld.tsx`: builders + `JsonLd` component; output escapes `<` so
  content can never break out of the script tag.
- Site-wide: `Organization` (areaServed Ghana, knowsAbout vehicle import and
  shipping, contact points) and `WebSite` (inLanguage).
- Shipping page: `Service` (provider, areaServed Ghana, serviceType),
  `FAQPage`, `BreadcrumbList`.
- Insights article: `Article` (headline, datePublished, inLanguage, publisher)
  and `BreadcrumbList`.
- Existing vehicle `Car` and FAQ `FAQPage` move to the shared component.

### 4. AI search readiness

- `/llms.txt`: plain-text summary — who we are, what we ship, Tema Port,
  languages, key page URLs.
- `robots.txt`: explicit allow for GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot;
  `/admin` disallowed for all.

### 5. Internal links

Footer "Explore" gains "Shipping to Ghana"; homepage "How it works" links to
the shipping page; FAQ shipping-time answer links to it; sitemap lists it at
priority 0.9 in all languages.

## Testing

- `tests/seo.test.ts`: JSON-LD output escapes `<`; `llms.txt` text lists the
  shipping page and every language; robots rules allow the AI crawlers and
  disallow `/admin`.
- Existing translation tests cover the new `shipping` messages in fr/pt/zh.
- Build passes; live check of titles, JSON-LD (parsed as JSON), llms.txt,
  robots.txt after deploy.

## Owner checklist after launch (not code)

Submit sitemap in Search Console; Google Business Profile; ask customers for
Google reviews; list on Ghanaian car/business directories; share social
profile links so they can be added as `sameAs`.
