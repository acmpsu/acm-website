export const NAV_ITEMS = [
  { label: "ICPC", href: "/icpc" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];

export const HERO_TITLE = "Excellence in Computing, Together.";
export const HERO_DESCRIPTION =
  "ACM at Penn State is the largest computer science and engineering student organization on campus. We welcome all majors and experience levels to learn, build, and connect through workshops, projects, and events.";

export const COMMITTEES = [
  { name: "AI", logo: "/logos/ai.png" },
  { name: "Data", logo: "/logos/data.png" },
  { name: "Design", logo: "/logos/design.png" },
  { name: "Hack", logo: "/logos/hack.png" },
  { name: "ICPC", logo: "/logos/icpc.png" },
  { name: "Quantum", logo: "/logos/quantum.png" },
  { name: "Web", logo: "/logos/web.png" },
];

/** Same as `id` on /committees articles — use for `href` hashes from short names (`AI`) or full names (`acm.ai`). */
export function committeePageFragmentId(name: string) {
  const normalized = name.includes(".") ? name : `acm.${name.toLowerCase()}`;
  return normalized.replace(/\./g, "-").toLowerCase();
}

export const NEWS_COUNT = 4;
