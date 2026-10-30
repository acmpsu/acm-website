# ACM Website Rules (AI Prompt)

Penn State ACM site. Next.js App Router, TypeScript, Tailwind.
Design source: Figma `HFRT30R89UUHyUL5GaTfSh` ("ACM — New Page"). Where this file and the Figma disagree, the Figma wins.
Tokens: `--ds-*` in `src/app/globals.css` · Constants: `src/lib/constants.ts` · Shared components: `src/components/ui/` · Shell: `src/components/site/`

## Laws
1. Reuse before create. Search codebase first.
2. Tokens only — no magic numbers, no inline styles.
3. One pattern per problem. No duplicate variants.
4. Mobile-first. WCAG 2.2 AA minimum.
5. If a pattern repeats 3×, extract to `components/ui/`.

## Tokens

Use the `--ds-*` variables (or their Tailwind utilities: `bg-azure-25`, `text-grey-92`, `font-display`, `rounded-pill`, `shadow-lift`, `ease-ds`). Don't add page-local copies.

**Colors (Figma azure scale):** `--ds-azure-12` #00243f (text, dark buttons), `--ds-azure-16` #002052 (night sections), `--ds-azure-25` #1c4866 (panel text, borders), `--ds-azure-36` #1f6a9b (muted labels), `--ds-azure-38` #1077b1 (primary button), `--ds-azure-75` #80c8fe (accent on dark), `--ds-grey-92` #e1eaf2 (text on dark), `--ds-grey-95` #e8f4fa (panels), `--ds-grey-95-2` #e8f2fa (pills, secondary button). Status: `--emerald-600`, `--amber-500`, `--rose-600`. Committee pane palettes live in `committees.module.css`.

**Fonts:** `--ds-font-display` (Instrument Serif: headings), `--ds-font-body` (Red Hat Display: UI and copy), `--ds-font-mono` (Red Hat Mono: eyebrows, labels).

**Layout:** container `--ds-container` (1612.8px = 84% of 1920; `<Container>`), panels `--ds-panel`, section spacing `--ds-section-space`, gaps `--ds-gap-sm|md|lg`. Clear the floating header with `--site-header-height` (contained pages get it from `SiteShell`; full-bleed first blocks add `var(--page-top, 0px)`).

**Radius:** `--ds-radius-sm` 8 (buttons), `-md` 12 (inputs, menu items), `-lg` 16 (windows), `-xl` 28 (panels), `-section` 48 (stacked section tops), `-pill`.

**Shadows:** `--ds-shadow-pill`, `-lift` (hover), `-menu`, `-panel`. Glass: `--ds-glass` + `--ds-glass-border` + 13px backdrop blur.

**Motion:** `--ds-duration-micro` 150ms, `--ds-duration` 200ms, `--ds-duration-layout` 300ms, `--ds-ease`. Hover lift max `translateY(-2px)`. Respect `prefers-reduced-motion`. Write `backdrop-filter` without the `-webkit-` copy (the build adds it; listing both drops the standard one).

## Typography

One H1 per page. Never skip levels.

| Level | Font | Mobile | Desktop (1920) | Weight |
|---|---|---|---|---|
| Page title (H1) | Instrument Serif italic | 48px | 112px | 400 |
| Section title (H2) | Instrument Serif | 36px | 48px | 400 |
| Card/window title (H3) | Instrument Serif or Red Hat Display | 20px | 24–40px | 400–500 |
| Body | Red Hat Display | 16px | 18–21px | 400 |
| Small | Red Hat Display | 14px | 14–15px | 400 |
| Eyebrow / label | Red Hat Mono, uppercase | 12px | 12px | 400 |

Use `clamp()` between the mobile and 1920 sizes. Mono labels may go to 11–12px as in the Figma; keep running text at 14px or more.

Body line-height ≥1.5, heading ≥1.2. Line length 45–75ch (`max-w-prose`). No text <14px. No font families beyond the three above.

## Buttons — use `<Button>` / `<IconButton>` from `src/components/ui/`

- **primary:** denim, white text; hovers pale with a lift. Max one per section.
- **secondary:** pale blue; hovers white with a lift.
- **pill:** nav pill (header utilities, dropdown triggers); white when current or open.
- **ghost / onDark:** transparent pill links for glass/light and dark surfaces (header center pill, footer).

Shared: 44px minimum height, 200ms transitions, visible focus outline. Labels verb-first, ≤3 words where possible. Disabled: `opacity-50 cursor-not-allowed`.

## Components

**Shell:** every route group renders `SiteShell` (floating `Header` + `Footer`). Nav links come from `PRIMARY_NAV` and `FOOTER_NAV` in `constants.ts`; the home sections are anchors (`/#about`, `/#contact`, …).

**Building blocks:** `Container`, `Section`, `SectionHeader`, `PageHeading`, `Card` (`Layout.tsx`), `Clouds`, `BackdropScene`, `ScrollStack` + `StackAnchor` (the stacked "scrolling panes" used on Home and Committees; put anchors on `StackAnchor`, never on a stacked section).

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