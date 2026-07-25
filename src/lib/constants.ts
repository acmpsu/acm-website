export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Committees", href: "/committees" },
  { label: "Initiatives", href: "/dev-team" },
  { label: "ICPC", href: "/icpc" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
];

export const HERO_TITLE = "Excellence in Computing, Together.";
export const HERO_DESCRIPTION =
  "ACM at Penn State is the largest computer science and engineering student organization on campus. We welcome all majors and experience levels to learn, build, and connect through workshops, projects, and events.";

export type Committee = {
  /** Fragment id used on /committees — also the dropdown/menu anchor target. */
  id: string;
  /** Full name, e.g. `acm.icpc`. */
  name: string;
  /** Compact label for grids and menus, e.g. `ICPC`. */
  shortName: string;
  logo: string;
  description: string;
};

export const COMMITTEES: Committee[] = [
  {
    id: "acm-icpc",
    name: "acm.icpc",
    shortName: "ICPC",
    logo: "/logos/icpc.png",
    description:
      "Prepares members for competitive programming and ICPC-style contests with structured practice, algorithms deep dives, and team problem-solving sessions",
  },
  {
    id: "acm-web",
    name: "acm.web",
    shortName: "Web & Design",
    logo: "/logos/web.png",
    description:
      "Pairs full-stack web development with product and visual design—accessible front ends, APIs, and deployment alongside UX fundamentals and design systems, so technical work ships with interfaces people actually want to use",
  },
  {
    id: "acm-ai",
    name: "acm.ai",
    shortName: "AI",
    logo: "/logos/ai.png",
    description:
      "Explores machine learning, modern AI tooling, and responsible applications through workshops, reading groups, and hands-on projects that meet members where they are",
  },
  {
    id: "acm-hack",
    name: "acm.hack",
    shortName: "Hackathon",
    logo: "/logos/hack.png",
    description:
      "Runs and prepares members for hackathons—rapid prototyping, team formation, and demo-ready builds, plus the workshops that get first-timers shipping their first project",
  },
  {
    id: "acm-data",
    name: "acm.data",
    shortName: "Data",
    logo: "/logos/data.png",
    description:
      "Focuses on data engineering, analytics, and visualization—turning raw information into clear stories and reliable pipelines with practical, industry-relevant skills",
  },
  {
    id: "acm-quantum",
    name: "acm.quantum",
    shortName: "Quantum",
    logo: "/logos/quantum.png",
    description:
      "Introduces quantum computing concepts, tools, and research directions—bridging linear algebra and programming with curiosity-first learning",
  },
];

export const INITIATIVES = [{ label: "Dev Team", href: "/dev-team" }];

export type ContactLink = {
  label: string;
  href: string;
  /** Shown on /resources#contact; the footer renders labels only. */
  description: string;
  group: "social" | "official";
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Discord",
    href: "https://discord.gg/zkqYjGxVsh",
    description: "Committee channels and day-to-day chat",
    group: "official",
  },
  {
    label: "GroupMe",
    href: "https://groupme.com/join_group/113864937/hfRpqc64",
    description: "Announcements and reminders",
    group: "official",
  },
  {
    label: "Org Page",
    href: "https://discover.psu.edu/organization/acmpsu",
    description: "Official Penn State listing",
    group: "official",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pennstateacm/",
    description: "Event flyers and photos",
    group: "social",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/acmpsu/",
    description: "Org updates and alumni",
    group: "social",
  },
];

export const NEWS_COUNT = 4;
