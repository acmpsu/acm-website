import Image from "next/image";

import type { Sponsor } from "@/lib/sponsors";

type SponsorLogoProps = {
  sponsor: Sponsor;
  /** `dark` uses the normalized light-on-dark mark; `light` the original logo. */
  surface: "dark" | "light";
  className?: string;
  sizes: string;
  /** Decorative copies (e.g. the carousel's loop) render without a link or name. */
  decorative?: boolean;
};

/** A sponsor's logo, linked to its website (in a new tab) when there is one. */
export function SponsorLogo({ sponsor, surface, className, sizes, decorative = false }: SponsorLogoProps) {
  // The light-on-dark mark would vanish on a light surface, so fall back to the name.
  const src = surface === "dark" ? sponsor.logoOnDark : sponsor.logo;
  const image = src ? (
    <Image src={src} alt={decorative ? "" : sponsor.name} fill sizes={sizes} className="object-contain" />
  ) : (
    <span className="grid h-full place-items-center text-center font-semibold" aria-hidden={decorative}>{sponsor.name}</span>
  );

  if (decorative || !sponsor.website) {
    return <span className={className}>{image}</span>;
  }
  return (
    <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={className}>
      {image}
    </a>
  );
}
