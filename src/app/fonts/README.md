# Fonts

Self-hosted copies of the site's Google Fonts (Latin subset, variable where available),
loaded with `next/font/local` in `src/app/layout.tsx` and `src/components/tickets/typography.ts`.

We don't use `next/font/google`: it downloads font CSS from Google at build time, and
Google sometimes answers with `fonts.gstatic.com/l/font?kit=…` URLs that Turbopack fails
to resolve ("next/font/google queries have exactly one entry"), which broke builds at random.

| File                                                      | Family            | Weights              |
| --------------------------------------------------------- | ----------------- | -------------------- |
| `plus-jakarta-sans.woff2`                                 | Plus Jakarta Sans | 400–800              |
| `geist-mono.woff2`                                        | Geist Mono        | 100–900              |
| `red-hat-display.woff2`                                   | Red Hat Display   | 400–700              |
| `red-hat-mono.woff2`                                      | Red Hat Mono      | 400–500              |
| `instrument-serif.woff2`, `instrument-serif-italic.woff2` | Instrument Serif  | 400, normal + italic |
| `ibm-plex-mono.woff2`                                     | IBM Plex Mono     | 400                  |

All are licensed under the SIL Open Font License 1.1, which allows bundling them with the site.
To add a weight or subset, download it from fonts.google.com and add it here.
