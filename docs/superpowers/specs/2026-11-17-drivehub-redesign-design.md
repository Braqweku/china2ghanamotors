# DriveHub-style redesign — design

Date: 2026-11-17
Status: approved by owner ("go ahead"). Preview locally before any push.

Reference: https://drivehub-template.framer.website/ (free Framer template).
We match its look (layout, spacing, type, colour, photo treatment, section
patterns) with our own code, content and freely licensed photos. No DriveHub
text, logos or images are copied.

## Decisions (owner)

- Scope: whole public site; admin unchanged.
- Banner photography: free-licence stock photos (Unsplash/Pexels). Vehicle
  listings keep partner photos, uncropped (`object-contain`).
- No customer reviews exist: the review slider becomes a "How it works" slider
  with the same look.
- No prices, phone number or address are shown (unconfirmed / policy).

## Visual system

- Colours: background `#FFFFFF`, foreground `#070707`, muted panel `#F2F2F2`,
  border `#E1E1E1`, secondary text `#464646`, tertiary `#9E9E9E`. Primary
  buttons near-black; on photos, white buttons. Brand red only as a small
  accent (section-label dot).
- Radius 6–8px. Shadows none or hairline.
- Type: Geist (already loaded). Headings large with tight tracking
  (`-0.03em`), medium weight like DriveHub; body 16px/1.6.
- Section opener: "• Label" (13px, muted) above an H2 (40–48px desktop,
  30–32px mobile).
- Motion: slider scrolling with arrow buttons (scroll-snap), hover states,
  nothing scroll-triggered. Honour `prefers-reduced-motion`.

## Shared shell

- Contact bar (dark, 13px): quotes email · WhatsApp · "Vehicles shipped to
  Tema Port, Ghana". On small screens only email and WhatsApp.
- Header: on the homepage it overlays the hero (transparent, white text); on
  other pages solid white with bottom border. Centred nav, language select,
  "Request a vehicle" button; mobile sheet menu kept.
- Footer: near-black; brand + tagline + language; columns Explore / Company /
  Contact; giant faded "China2Ghana" wordmark at the bottom (aria-hidden).

## Homepage sections (in order)

1. Hero — full-bleed stock photo, dark gradient for legibility, H1 + intro +
   two buttons (Explore vehicles, Request a vehicle).
2. Browse by vehicle type — horizontal slider of tall photo cards (All,
   Sedan, SUV, MPV, Electric & hybrid, Pickup) → `/vehicles?vehicleType=…`
   (Electric & hybrid → `/ev`). Arrow buttons + keyboard/touch scroll.
3. Featured vehicles — centred heading, 3-up grid of restyled `VehicleCard`.
4. Services — 3 columns with hairline dividers: Vehicle sourcing, Shipping to
   Tema Port, Fleet & business; icon tile, title, text, "Explore more →".
5. Photo band — full-bleed stock photo (car carrier / port).
6. Brands we ship — hairline grid of the stocked brands with logos.
7. About band — full-bleed photo, "Get to know China2Ghana Motors", button to
   the shipping page.
8. How it works slider — photo cards with overlay text (Source, Inspect,
   Ship to Tema Port, Clear & deliver).
9. Final CTA — full-bleed photo, "Ready to find your next vehicle?", button.

All new copy in `messages/*.json` (en, fr, pt, zh).

## Other pages

Vehicles, vehicle detail, EV, shipping, source, fleet, track, FAQ, insights,
article: new page header pattern (label + large H1), restyled cards, buttons,
filters and form panels. Content, translations and SEO unchanged.

## Photos

`public/stock/*.jpg`, ~12 images, resized to ≤2000px wide, ~80% JPEG; source
URL and licence recorded in `public/stock/CREDITS.md`.

## Verification

Tests, lint, build; desktop and 390px screenshots of every page in en, fr and
zh; side-by-side with DriveHub; keyboard check of sliders and menu. Local
preview for the owner before pushing.
