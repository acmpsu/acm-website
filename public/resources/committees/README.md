# Committees artwork

Exported from the ACM Figma file `HFRT30R89UUHyUL5GaTfSh`, frame
`ACM — Committees / Scrolling Panes Prototype` (`478:597`), on October 29, 2026
using Figma MCP design context.

- `clouds.png`: Home theme / iridescent clouds (`478:749`, repeated per pane).
  Native size 2172 × 724; Figma slot 540 × 131 above each project window.
- `grain.png`: Desaturated source grain (`480:155`), a 32 × 32 tile laid over
  every pane with a soft-light blend at 32% opacity.
- `motif-*.svg`: each pane's subtle subject motif — ICPC algorithm grid
  (`480:157`), Web & Design spectral lens (`480:184`), AI neural constellation
  (`480:195`), Quantum orbital interference (`480:351`), Dev circuit traces and
  nodes (`480:220`, `480:225`) and Data flowing dot field (`480:235`).

Pane gradients, blooms and project-window palettes are CSS in
`src/components/committees/committees.module.css`. Sample project previews are
rendered as HTML from `COMMITTEES` in `src/lib/constants.ts`, not images.
