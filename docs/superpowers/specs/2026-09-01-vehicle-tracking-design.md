# Vehicle Tracking — Design Spec

Status: Approved. Route: `/track`.

Builds on `docs/design-spec.md` §2 (12-stage operational timeline is already locked there) and the existing `TrackingEvent`/`TrackingStage` types and `getTrackingEvents` repository function from Foundation.

---

## 1. The 12 Stages (canonical, from `docs/design-spec.md` §2)

`received` → `sourcing` → `selected` → `verification` → `inspection` → `purchased` → `ready_to_ship` → `in_transit` → `arrived_ghana` → `clearing` → `ready_for_delivery` → `delivered`

Display labels: Request received, Vehicle sourcing, Vehicle selected, Verification, Inspection, Purchase, Ready for shipping, In transit, Arrived in Ghana, Clearing, Ready for delivery, Delivered.

## 2. Page Structure (`/track`)

Server Component reading `?ref=` from `searchParams`.
- **Lookup form**: a small client component (`components/tracking/reference-lookup-form.tsx`) — one `Input` + `Button`, on submit navigates to `/track?ref=<value>` via `useRouter().push`.
- **No `ref` param**: show only the lookup form, with brief explanatory copy.
- **`ref` present, valid** (`getTrackingEvents` returns an array): render the 12-stage timeline. For each stage, find the matching event in the returned array (if any); a stage with a match is "complete" (filled marker, timestamp shown), the last stage with a match is "current" (highlighted), stages with no match are "upcoming" (greyed marker, no timestamp).
- **`ref` present, unknown** (`getTrackingEvents` returns `null`): "We couldn't find that reference. Check it and try again." plus the lookup form again, pre-filled with the attempted value.

## 3. Mock Data

Expand `lib/mock/tracking.ts` from one reference to three, each a realistic subset of the 12 stages built in order (no skipped stages, no out-of-order timestamps):
- `C2G-8837XJ` (existing) — early stage, events through `verification` only.
- A second reference — mid-pipeline, events through `in_transit`.
- A third reference — complete, events through `delivered`.

## 4. Visual Treatment

Timeline styling reuses the vertical-line-with-numbered-markers pattern from Homepage's Journey component, but: markers use a checkmark (Lucide `Check`) for complete stages instead of a number, the current stage's marker uses the `accent` color, upcoming stages are `muted`/greyed with no scroll-reveal animation (this is a status view, not a marketing narrative — no motion here per §4's "every animation must serve a purpose" rule; a static list read top-to-bottom already communicates progress clearly). Each completed stage shows its event's `timestamp`, formatted as a readable date. The reference itself renders in `font-mono text-caption` styling per the spec's Geist Mono note.

## 5. Out of Scope

No photos/videos/documents per event (flagged as future in the master brief). No push/email/SMS notifications. No admin interface to create/update tracking events (mock data only, same as everything else on the site).
