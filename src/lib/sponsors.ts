export type SponsorTier = "platinum" | "gold" | "silver" | "bronze";

export type Sponsor = {
  /** Stable slug, also the file name under /public/sponsors/on-dark. */
  id: string;
  name: string;
  /** Light-on-dark mark, normalized to a 3:1 canvas (2172 × 724), for dark sections. */
  logoOnDark: string;
  /** Original full-color logo for light backgrounds, when we have one. */
  logo?: string;
  website?: string;
  tier?: SponsorTier;
  /** Ascending display order. */
  order: number;
  active: boolean;
};

/** Tiers in display order; a sponsor without a tier sorts after these. */
export const SPONSOR_TIERS: SponsorTier[] = [
  "platinum",
  "gold",
  "silver",
  "bronze",
];

// Logos and order follow the Sponsors carousel (406:72) on the Figma home page.
export const SPONSORS: Sponsor[] = [
  {
    id: "arcelormittal",
    name: "ArcelorMittal",
    logoOnDark: "/sponsors/on-dark/arcelormittal.png",
    logo: "/sponsors/arcelor_mittal.png",
    website: "https://corporate.arcelormittal.com",
    order: 1,
    active: true,
  },
  {
    id: "boeing",
    name: "Boeing",
    logoOnDark: "/sponsors/on-dark/boeing.png",
    logo: "/sponsors/1.jpg",
    website: "https://www.boeing.com",
    order: 2,
    active: true,
  },
  {
    id: "capital-one",
    name: "Capital One",
    logoOnDark: "/sponsors/on-dark/capital-one.png",
    logo: "/sponsors/cap1.jpg",
    website: "https://www.capitalone.com",
    order: 3,
    active: true,
  },
  {
    id: "capital-one-tech",
    name: "Capital One Tech",
    logoOnDark: "/sponsors/on-dark/capital-one-tech.png",
    website: "https://www.capitalone.com/tech/",
    order: 4,
    active: true,
  },
  {
    id: "kattis",
    name: "Kattis",
    logoOnDark: "/sponsors/on-dark/kattis.png",
    logo: "/sponsors/kattis.png",
    website: "https://open.kattis.com",
    order: 5,
    active: true,
  },
  {
    id: "lockheed-martin",
    name: "Lockheed Martin",
    logoOnDark: "/sponsors/on-dark/lockheed-martin.png",
    logo: "/sponsors/Lockheed.webp",
    website: "https://www.lockheedmartin.com",
    order: 6,
    active: true,
  },
  {
    id: "mathworks",
    name: "MathWorks",
    logoOnDark: "/sponsors/on-dark/mathworks.png",
    logo: "/sponsors/MathWorks-Logo-square-e1661708582572.jpg",
    website: "https://www.mathworks.com",
    order: 7,
    active: true,
  },
  {
    id: "nittany-ai",
    name: "Nittany AI Alliance",
    logoOnDark: "/sponsors/on-dark/nittany-ai.png",
    logo: "/sponsors/nittanyai.jpg",
    website: "https://nittanyai.psu.edu",
    order: 8,
    active: true,
  },
  {
    id: "optum",
    name: "Optum",
    logoOnDark: "/sponsors/on-dark/optum.png",
    logo: "/sponsors/optum.png",
    website: "https://www.optum.com",
    order: 9,
    active: true,
  },
  {
    id: "penn-state-eecs",
    name: "Penn State School of EECS",
    logoOnDark: "/sponsors/on-dark/penn-state-eecs.png",
    logo: "/sponsors/EECS-header-mobile.png",
    website: "https://www.eecs.psu.edu",
    order: 10,
    active: true,
  },
  {
    id: "rockwell-automation",
    name: "Rockwell Automation",
    logoOnDark: "/sponsors/on-dark/rockwell-automation.png",
    logo: "/sponsors/rockwell.png",
    website: "https://www.rockwellautomation.com",
    order: 11,
    active: true,
  },
  {
    id: "textron",
    name: "Textron",
    logoOnDark: "/sponsors/on-dark/textron.png",
    logo: "/sponsors/textron.png",
    website: "https://www.textron.com",
    order: 12,
    active: true,
  },
];

/** Active sponsors, by tier (when set) and then display order. */
export function activeSponsors(sponsors: Sponsor[] = SPONSORS) {
  const rank = (s: Sponsor) =>
    s.tier ? SPONSOR_TIERS.indexOf(s.tier) : SPONSOR_TIERS.length;
  return sponsors
    .filter((s) => s.active)
    .sort((a, b) => rank(a) - rank(b) || a.order - b.order);
}
