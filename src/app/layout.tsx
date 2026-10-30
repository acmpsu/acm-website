import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ticketMono } from "@/components/tickets/typography";

// Fonts are self-hosted (src/app/fonts) rather than loaded with next/font/google, whose
// build-time download intermittently fails under Turbopack. See src/app/fonts/README.md.
const plusJakarta = localFont({
  variable: "--font-sans",
  src: "./fonts/plus-jakarta-sans.woff2",
  weight: "400 800",
});

const geistMono = localFont({
  variable: "--font-mono",
  src: "./fonts/geist-mono.woff2",
  weight: "100 900",
});

// Login/auth typography from the Figma design.
const redHatDisplay = localFont({
  variable: "--font-red-hat",
  src: "./fonts/red-hat-display.woff2",
  weight: "400 700",
});

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  src: [
    { path: "./fonts/instrument-serif.woff2", weight: "400", style: "normal" },
    {
      path: "./fonts/instrument-serif-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
});

// Monospace glyph layer behind the login card (Figma "ASCII Meadow").
const ibmPlexMono = localFont({
  variable: "--font-ibm-plex-mono",
  src: "./fonts/ibm-plex-mono.woff2",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Penn State ACM",
  description:
    "ACM at Penn State — the largest computer science student organization on campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} ${redHatDisplay.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} ${ticketMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
