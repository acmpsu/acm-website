import localFont from "next/font/local";

// Self-hosted like the fonts in src/app/layout.tsx (see src/app/fonts/README.md).
export const ticketMono = localFont({
  variable: "--font-ticket-mono",
  src: "../../app/fonts/red-hat-mono.woff2",
  weight: "400 500",
});
