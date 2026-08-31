# UI / DESIGN SYSTEM RULES

You are building a production-grade professional application.

The UI must NOT look AI-generated, template-generated,
or visually over-designed.

## DESIGN PRINCIPLES

- Prioritize clarity, hierarchy and usability over visual effects.
- Use a restrained, professional visual language.
- Every visual element must have a functional reason.
- Avoid decorative UI that does not improve usability.
- Prefer whitespace, typography and alignment over gradients.
- Use consistent spacing throughout the application.
- Use a consistent design system across every page.

## COMPONENT SYSTEM

Use:
- shadcn/ui as the base component system
- Origin UI for application components
- Lucide icons
- Tailwind CSS

Do not invent a new component when an existing component
can be reused.

## REFERENCE COMPONENT & DESIGN SOURCES

Not installed until an app is actually scaffolded — check here first before
building a custom component from scratch, and wire in via the shadcn CLI
(`npx shadcn add <registry-url>`) once a project exists.

- shadcn/ui — base component system. https://github.com/shadcn-ui/ui
- Origin UI — application-level components (source for the "Origin UI" rule
  above). https://github.com/origin-space/ui-experiments
- Magic UI — animated/marketing components. Use sparingly and only where
  animation is purposeful (see ANIMATION rules below) — most of its effects
  (glows, gradients, blobs) conflict with the "DO NOT USE BY DEFAULT" list
  and should be the exception, not the default.
  https://github.com/magicuidesign/magicui

## INSTALLED SKILLS

- `emilkowalski/skills` is installed in `.agents/skills/` (via
  `npx skills add emilkowalski/skills`), symlinked for Claude Code. Includes
  `pick-ui-library`, `animate`, `review-animations`, `improve-animations`,
  and others relevant to the rules in this file — consult them for
  UI/animation decisions before improvising.

## DO NOT USE BY DEFAULT

Avoid:

- Purple-to-blue gradients
- Gradient text
- Excessive glassmorphism
- Excessive shadows
- Excessive rounded cards
- Grain/noise textures
- Floating decorative blobs
- Cursor-following effects
- Scroll-triggered animations everywhere
- Excessive glowing effects
- Emoji in headings
- Generic "AI" visual effects
- Excessive badges
- Excessive pill-shaped UI
- Random colored borders
- Huge hero headings
- Unnecessary serif/italic typography
- Excessive use of Inter
- Three identical cards simply because there are three columns

## TYPOGRAPHY

Use a clear type hierarchy.

Headings:
- strong
- concise
- readable

Body:
- comfortable line height
- high readability
- appropriate contrast

Do not use typography as decoration.

## COLOR

Use a restrained color palette.

Define:
- background
- foreground
- primary
- secondary
- muted
- border
- destructive
- success
- warning

Use accent colors primarily to communicate meaning or hierarchy.

Do not make every component colorful.

## SPACING

Use a consistent spacing scale.

Do not randomly mix:
- 17px
- 23px
- 31px
- 37px

Prefer the design system spacing tokens.

## CARDS

Do not put every piece of content inside a card.

Use cards only when they create meaningful grouping.

Prefer:
- sections
- tables
- lists
- whitespace
- dividers

when a card is unnecessary.

## ANIMATION

Animation must be purposeful.

Default:
- subtle
- fast
- functional

Use animation to communicate:
- state changes
- loading
- navigation
- feedback
- hierarchy

Do not animate every element.

## DASHBOARDS

Prioritize:
1. Information hierarchy
2. Important metrics
3. Recent activity
4. Tables
5. Filters
6. Actions
7. Search
8. Navigation

Do not create a dashboard consisting primarily of colorful metric cards.

## RESPONSIVENESS

Design mobile-first.

Every page must work properly on:
- mobile
- tablet
- desktop

Do not simply shrink the desktop layout.

## ACCESSIBILITY

Use:
- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- sufficient contrast
- appropriate ARIA attributes

## CODE QUALITY

Components should be:
- reusable
- composable
- maintainable
- typed
- accessible

Before creating a new UI component, check whether
shadcn/ui or Origin UI already provides an appropriate one.

## IMPORTANT

Do not make the website "look impressive".

Make it look like a professional product that has been
designed by an experienced product designer.
