# ACM Website Rules (AI Prompt)

Penn State ACM site. Next.js App Router, TypeScript, Tailwind.
Tokens: `src/app/globals.css` · Constants: `src/lib/constants.ts` · Components: `src/components/`, `src/components/ui/`

## Laws
1. Reuse before create. Search codebase first.
2. Tokens only — no magic numbers, no inline styles.
3. One pattern per problem. No duplicate variants.
4. Mobile-first. WCAG 2.2 AA minimum.
5. If a pattern repeats 3×, extract to `components/ui/`.

## Tokens

**Colors:** `--acm-blue-600` (primary), `--acm-blue-800` (hover), `--acm-blue-100` (soft bg), `--slate-900` (text), `--slate-600` (muted), `--slate-200` (border), `--slate-50`/`--white` (surface). Status: `--emerald-600`, `--amber-500`, `--rose-600`. No new colors.

**Spacing:** Tailwind `1,2,3,4,6,8,12,16,20,24,32` only. Section padding `py-16 md:py-24`. Container `max-w-6xl` (content), `max-w-7xl` (hero).

**Radius:** `rounded-md` (inputs), `rounded-xl` (buttons/cards), `rounded-2xl` (panels/modals), `rounded-full` (pills/avatars). Max two per group.

**Motion:** `150ms` micro, `200ms` standard, `300ms` layout. Easing `cubic-bezier(0.4,0,0.2,1)`. Hover lift max `translateY(-2px)`. Respect `prefers-reduced-motion`.

## Typography

One H1 per page. Never skip levels.

| Level | Mobile | Desktop | Weight |
|---|---|---|---|
| Display | 36px | 56px | 700 |
| H1 | 30px | 40px | 700 |
| H2 | 24px | 30px | 600 |
| H3 | 20px | 22px | 600 |
| Body | 16px | 16px | 400 |
| Small | 14px | 14px | 400 |

Body line-height ≥1.5, heading ≥1.2. Line length 45–75ch (`max-w-prose`). No text <14px. No new font families.

## Buttons — 3 variants only

- **Primary:** solid `--acm-blue-600`, white text. Max one per section.
- **Secondary:** white bg, blue border, blue text.
- **Ghost:** no bg, slate text, underline on hover.

Shared: `rounded-xl`, heights `h-9`/`h-11`/`h-12`, transition `200ms`, focus `ring-2 ring-offset-2 ring-acm-blue-600`. Labels verb-first, ≤3 words. Disabled: `opacity-50 cursor-not-allowed`. Loading: spinner, fixed width.

## Components

**Cards:** border OR shadow, not both. `p-6` standard, `p-8` feature. Hover only if interactive: `translateY(-2px)` + `shadow-md`.

**Dropdowns:** reuse existing. `200ms` fade + 4px slide. Esc closes, arrows navigate, Tab exits, focus returns to trigger. Items `h-10 px-3`, hover `bg-slate-100`.

**Forms:** labels above (never placeholder-only). Errors below in `--rose-600` with icon. Focus `ring-2 ring-acm-blue-600`. Required = `*` + `aria-required`.

**Images:** `next/image`, explicit `width`/`height`, required `alt` (`alt=""` if decorative). Ratios: `16/9` hero, `4/3` card, `1/1` avatar.

**Links:** inline = blue, underline on hover. Nav = no underline, color shift on hover.

## Layout

Breakpoints `sm:640 md:768 lg:1024 xl:1280`. Design at 375px first. No horizontal scroll 320–2560px. Tap targets ≥44×44px. Grid gaps `gap-4` dense, `gap-6` cards, `gap-8` features.

## Accessibility

Semantic HTML only — never `<div onClick>`. Keyboard-reachable + visible focus on all interactive elements. Color never the sole signal. Modals trap focus and restore on close. Lighthouse a11y ≥95.

## Architecture

- Server Components default; `"use client"` only for state/effects/browser APIs.
- Props typed, no `any`. Discriminated unions for variants.
- Components <200 lines. Prop drilling ≤2 levels.
- Files: `PascalCase.tsx` components, `camelCase.ts` utilities.

## Voice

Tone: welcoming, confident, student-forward. Headings sentence case ("Upcoming events"). CTAs verb-first, ≤3 words. Hero ≤20 words, section intro ≤40 words, card desc ≤2 lines. Numerals for 10+, spell out 1–9.

## Unknown cases

Match nearest existing pattern → else pick most conservative/accessible/reusable option → log decision.

## Pre-finalize checklist

- [ ] All values from tokens; no inline styles, no new fonts/colors/radii
- [ ] 3-button system respected; ≤1 primary per section
- [ ] Sequential headings, one H1
- [ ] Tested 375/768/1280px, no overflow, tap targets ≥44px
- [ ] Semantic HTML, keyboard nav works, focus visible, contrast 4.5:1 body / 3:1 UI
- [ ] Alt text present; `prefers-reduced-motion` honored
- [ ] No duplicate components; props typed; `"use client"` only if needed
- [ ] Sentence-case headings; verb-first CTAs; copy within length limits