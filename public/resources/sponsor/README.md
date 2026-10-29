# Sponsor artwork

Exported from the ACM Figma file `HFRT30R89UUHyUL5GaTfSh` on October 29, 2026
using Figma MCP design context.

- `section-texture.png`: Sponsors Section fill (`50:498`), a 96 × 96 tile laid
  over `#004175` on the home-page sponsors band.
- `windmill.png`: Background poster beneath the sponsor motion loop (`495:176`),
  1344 × 768, shown blurred behind the Sponsor ACM inquiry panel (`494:169`).
  The Figma file has no video for the motion loop, so the poster is used alone.
- `../../sponsors/on-dark/*.png`: carousel logos (`406:75`–`406:86`), light-on-dark
  marks normalized to a 2172 × 724 (3:1) canvas so every logo sits at the same
  visual size. The originals in `../../sponsors/` stay in use on light backgrounds.

The sponsors band reuses `../committees/clouds.png` (identical Figma export).
Sponsor names, links, order and status live in `src/lib/sponsors.ts`.
