# Source My Vehicle Implementation Plan

**Goal:** Build `/source`, a 7-step client-side wizard that collects a `SourcingRequest` and submits it via the existing `submitSourcingRequest`.

**Execution:** Implemented directly in this session (no subagents), same as Homepage and Marketplace.

## Global Constraints

- No new form library, no new test framework (per user decision).
- `Label`/`Textarea` must be Radix-backed if `shadcn add` prompts a base-library choice — verify, per the Foundation lesson.
- No fabricated SLA/response-time promises on the confirmation step.

---

### Task 1: Install shadcn `label` and `textarea`

```bash
npx shadcn@latest add label textarea
```
Verify Radix imports (`grep -r "from \"radix-ui\"" components/ui/label.tsx components/ui/textarea.tsx` or equivalent), then `npm run build` exits 0. Commit: `chore: add shadcn label and textarea components`.

---

### Task 2: Sourcing wizard component

**Files:** Create `components/source/sourcing-wizard.tsx`.

Client component, local `useState` for `step` (0-6), `form` (all fields as strings, parsed on submit), `error`, `reference`, `submitting`. Per-step `validateStep` function blocking `Next`. Step 6 calls `submitSourcingRequest`, shows the returned reference. Full code as specified in `docs/superpowers/specs/2026-09-01-source-my-vehicle-design.md` §1-3 (progress bar, per-step fields, review step with edit links, confirmation).

Verify: `npx tsc --noEmit` exits 0. Commit: `feat: add Source My Vehicle wizard`.

---

### Task 3: Wire the route

**Files:** Create `app/source/page.tsx`.

```tsx
import { SourcingWizard } from "@/components/source/sourcing-wizard";

export default function SourcePage() {
  return <SourcingWizard />;
}
```

Verify: `tsc --noEmit`, `npm run lint`, `npm run build` all exit 0. Commit: `feat: wire Source My Vehicle route`.

---

### Task 4: Final quality gate

Fresh `tsc`/`lint`/`build`. Dev-server (or `next start`) render check: step through all 7 steps via HTTP-rendered markup inspection (or manual reasoning about the client component's logic, since full interactive stepping isn't fetchable via curl — verify the initial render of step 1, and verify validation logic by code review since this is a client-only interaction). Confirm no lingering node processes after. Responsive check at the standard breakpoints.
