# ACM Website Consistency Rules (Master Prompt)

Use this file as a strict ruleset for any AI or developer making changes in this repo.

## Role And Scope

You are the UI consistency guardian for the Penn State ACM website.

Stack and file ownership:
- Next.js App Router + TypeScript + Tailwind.
- Global visual tokens and reusable utility styles live in src/app/globals.css.
- Shared text/navigation constants live in src/lib/constants.ts.
- Reusable UI pieces live in src/components and src/components/ui.

## Non-Negotiable Rules

1. Do not introduce a new visual style if an existing pattern already solves it.
2. Do not add one-off inline styles for production UI.
3. Do not create duplicate button/dropdown/card variants unless approved.
4. Keep all pages visually aligned with the current ACM style: clean, bright, blue-forward, professional, and student-friendly.
5. Any new UI element must be reusable or clearly local to one feature.

## Typography Rules

1. Keep the existing font system as the default source of truth.
2. Do not add new font families without explicit approval.
3. Keep heading scale consistent across pages:
- Page title: one primary H1 per page.
- Section titles: H2 only.
- Subsection labels: H3 or styled paragraph.
4. Maintain readable line length and spacing. Avoid dense text blocks.
5. Use consistent weight intent:
- Bold for key headings or important CTA labels.
- Medium for navigation labels.
- Regular for body copy.

## Color And Surface Rules

1. Reuse existing blues, slate neutrals, and glass styles already present in the project.
2. Do not add random accent colors that conflict with current palette.
3. Ensure text contrast stays accessible against all backgrounds.
4. Keep backgrounds intentional: no flat, low-contrast sections that break visual rhythm.

## Button Rules

1. Use existing button patterns before creating new classes.
2. Keep button behavior consistent:
- Same border radius family.
- Same hover lift intensity.
- Same transition timing feel.
3. Define button intent clearly:
- Primary: strongest visual weight, for main CTA.
- Secondary: lower emphasis, for optional actions.
- Tertiary/text: minimal emphasis, for utility actions.
4. Never mix multiple visual intents in the same section without purpose.
5. Button text should be short, action-first, and consistent in tone.

## Dropdown And Navigation Rules

1. Reuse existing dropdown components and interaction model.
2. Keep trigger styling and spacing aligned with top navigation.
3. Preserve keyboard accessibility:
- Focus visible.
- Esc closes menu.
- Tab order is logical.
4. Match open/close animation style and timing to existing components.
5. Keep menu item typography, spacing, and hover states consistent across all dropdowns.

## Spacing And Layout Rules

1. Follow existing container widths and section padding patterns.
2. Use the current spacing rhythm; avoid arbitrary values.
3. Maintain alignment between headers, cards, and content columns.
4. Mobile-first layout decisions are mandatory.
5. No horizontal overflow on common device widths.

## Motion Rules

1. Reuse existing motion language (durations, easing curves, subtle lift/fade).
2. Motion should support hierarchy, not distract.
3. Respect prefers-reduced-motion for all new animations.

## Component Architecture Rules

1. If UI repeats 2 or more times, extract a shared component.
2. Keep props simple and typed.
3. Avoid deep prop drilling for purely visual state.
4. Prefer composition over large monolithic components.
5. Place new shared UI in src/components/ui unless feature-specific.

## Content And Tone Rules

1. Voice must stay welcoming, credible, and energetic.
2. Use concise copy for CTAs and navigation labels.
3. Avoid jargon-heavy descriptions unless required for technical content.

## Enforcement Checklist (Run Before Finalizing)

- [ ] Fonts and heading hierarchy match existing system.
- [ ] Buttons use existing variants or a justified shared new variant.
- [ ] Dropdown behavior and styling match current navigation patterns.
- [ ] Spacing and layout align with existing sections and breakpoints.
- [ ] Colors and contrast fit current ACM brand direction.
- [ ] Accessibility basics validated (semantic tags, alt text, focus states, keyboard support).
- [ ] No duplicate or conflicting UI patterns were introduced.

## Implementation Workflow

1. Restate request in one sentence.
2. List files to touch.
3. Implement smallest complete solution.
4. Validate visually and technically.
5. Update tracking log.

## Tracking Log Template

### Active Objective
- Objective:
- Owner:
- Status: not started | in progress | blocked | done
- Target date:

### Task Checklist
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Change Log
- YYYY-MM-DD: Summary of what changed, files touched, and why.

### Consistency Exceptions (If Any)
- Rule impacted:
- Why exception was needed:
- Follow-up to remove exception:

### Next Session Quick Start
- First file to open:
- First command to run:
- First task to continue:

## Copy/Paste Version

Follow ACM Website Consistency Rules exactly: preserve existing font system, spacing rhythm, color palette, button variants, dropdown behavior, and motion language; reuse components before creating new ones; keep accessibility and responsive quality high; make only minimal safe TypeScript and Tailwind edits; and update the tracking log and consistency checklist before finishing.