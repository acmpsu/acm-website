# Home page artwork

Exported from the ACM Figma file `HFRT30R89UUHyUL5GaTfSh`, frame
`ACM 2026 Website Frame` (`50:325`), on October 29, 2026 using Figma MCP.

- `hero.png`: hero painting (`50:336` image fill, 1288 × 714 source), shown with a 6px blur to match Figma's render.
- `hero-grain.png`: "Snowflake overlay" 3 × 3 tile (`63:2`), repeated at its native size for a fine dot grain (screen blend).
- `sparkles/*.svg`: the 33 sparkle shapes of `122:64`; their 51 positions and
  opacities live in `src/components/home/heroSparkles.ts`.
- `about-garland.png`: vine garland above About (`462:85`).
- `logos/*.png`: committee wordmarks from the About carousel (`50:483`). Only the six
  current committees are used (the Figma also shows retired ones).
- `partners/*.png`: partner marks (`160:61`–`160:65`).
- `windmill.webp`: the 52 transparent frames of `410:57`, exported at 2× and scaled to 920 × 1148 (transparency from the 1× frames), encoded as a
  looping animated WebP at 20 fps; `windmill-still.png` is frame 0, used under
  `prefers-reduced-motion`.
- `contact/`: airplane window parts from `358:66` (sky, frame, bleed-hole crop,
  shade frame `431:82`), the four cloud logos, both cloud banks (`385:102–103`) and
  the plane trail (`394:63`).

Not used: the hero's 87-frame cloud-parting GIF (no placement or timing in the
design data).
