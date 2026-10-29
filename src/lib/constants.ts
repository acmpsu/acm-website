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

/** Color palette for a committee's pane on /committees (see committees.module.css). */
export type CommitteeTheme = "icpc" | "web" | "ai" | "quantum" | "dev" | "data";

/** Illustrative mockup inside a committee's sample-project window. */
export type CommitteePreview =
  | { kind: "checklist"; items: { label: string; tag: string }[] }
  | { kind: "wireframe"; headline: string }
  | { kind: "qa"; question: string; answer: string; sources: string[] }
  | {
      kind: "circuit";
      qubits: number;
      /** `at` is the gate's position along the wires, 0–1; `link` draws a wire between two qubits. */
      gates: { label: string; qubit: number; at: number; link?: [number, number] }[];
    }
  | { kind: "steps"; items: string[]; caption: string }
  | { kind: "chart"; label: string; values: number[] };

export type Committee = {
  /** Fragment id used on /committees — also the dropdown/menu anchor target. */
  id: string;
  /** Full name, e.g. `acm.icpc`. */
  name: string;
  /** Compact label for grids, menus and the committee pane title, e.g. `ICPC`. */
  shortName: string;
  logo: string;
  description: string;
  tagline: string;
  /** Optional when/where line, e.g. `Tuesdays 7 PM · Westgate E201`. */
  meeting?: string;
  /** What members can expect to find, e.g. problem sets or notebooks. */
  resources: string[];
  theme: CommitteeTheme;
  project?: { title: string; preview: CommitteePreview };
};

// Pane order, palettes and sample projects follow the Committees frame (478:597) in Figma.
export const COMMITTEES: Committee[] = [
  {
    id: "acm-icpc",
    name: "acm.icpc",
    shortName: "ICPC",
    logo: "/logos/icpc.png",
    description:
      "Prepares members for competitive programming and ICPC-style contests with structured practice, algorithms deep dives, and team problem-solving sessions",
    tagline: "Think clearly. Solve together.",
    resources: ["Problem sets", "contest notes", "solutions"],
    theme: "icpc",
    project: {
      title: "Practice tracker",
      preview: {
        kind: "checklist",
        items: [
          { label: "Graph traversal", tag: "practice" },
          { label: "Dynamic programming", tag: "discuss" },
          { label: "Greedy strategies", tag: "compare" },
        ],
      },
    },
  },
  {
    id: "acm-web",
    name: "acm.web",
    shortName: "Web",
    logo: "/logos/web.png",
    description:
      "Pairs full-stack web development with product and visual design—accessible front ends, APIs, and deployment alongside UX fundamentals and design systems, so technical work ships with interfaces people actually want to use",
    tagline: "From first sketch to working page.",
    resources: ["Figma explorations", "components", "source code"],
    theme: "web",
    project: { title: "ACM website refresh", preview: { kind: "wireframe", headline: "A place to belong." } },
  },
  {
    id: "acm-ai",
    name: "acm.ai",
    shortName: "AI",
    logo: "/logos/ai.png",
    description:
      "Explores machine learning, modern AI tooling, and responsible applications through workshops, reading groups, and hands-on projects that meet members where they are",
    tagline: "Ask questions. Run experiments.",
    resources: ["Repository", "evaluation notes", "demo"],
    theme: "ai",
    project: {
      title: "Campus Copilot",
      preview: {
        kind: "qa",
        question: "Where can I find ACM workshop materials?",
        answer: "A useful starting point, with clear source links.",
        sources: ["Source 01", "Source 02", "Source 03"],
      },
    },
  },
  {
    id: "acm-quantum",
    name: "acm.quantum",
    shortName: "Quantum",
    logo: "/logos/quantum.png",
    description:
      "Introduces quantum computing concepts, tools, and research directions—bridging linear algebra and programming with curiosity-first learning",
    tagline: "Explore a different kind of computing.",
    resources: ["Circuit files", "reading lists", "workshop slides"],
    theme: "quantum",
    project: {
      title: "Quantum circuit playground",
      preview: {
        kind: "circuit",
        qubits: 3,
        gates: [
          { label: "H", qubit: 0, at: 0.21 },
          { label: "X", qubit: 1, at: 0.52, link: [0, 2] },
          { label: "H", qubit: 2, at: 0.81 },
        ],
      },
    },
  },
  {
    id: "acm-dev",
    name: "acm.dev",
    shortName: "Dev",
    logo: "/logos/dev.png",
    description:
      "Builds real software as a team—members pick up project briefs, work in a shared repository, and ship tools for ACM and the campus, with onboarding guides for first-time contributors",
    tagline: "Build things that matter.",
    resources: ["Repository", "project briefs", "onboarding guides"],
    theme: "dev",
    project: {
      title: "Developer workspace",
      preview: { kind: "steps", items: ["Plan", "Build", "Ship"], caption: "Demo slot" },
    },
  },
  {
    id: "acm-data",
    name: "acm.data",
    shortName: "Data",
    logo: "/logos/data.png",
    description:
      "Focuses on data engineering, analytics, and visualization—turning raw information into clear stories and reliable pipelines with practical, industry-relevant skills",
    tagline: "Find the story in the data.",
    resources: ["Datasets", "notebooks", "visualizations"],
    theme: "data",
    project: {
      title: "Campus data explorer",
      preview: { kind: "chart", label: "Illustrative visualization", values: [70, 108, 84, 145, 124, 170] },
    },
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
