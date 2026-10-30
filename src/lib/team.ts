export type TeamGroup = "eboard" | "directors";

export type TeamMember = {
  /** Stable slug, unique per role: someone holding two roles has two entries. */
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  /** Committee this person directs — an id from COMMITTEES in src/lib/constants.ts. */
  committee?: string;
  /** Square-ish headshot under /public; the card falls back to initials without one. */
  photo?: string;
  description?: string;
  links?: { linkedin?: string; github?: string; email?: string };
};

/** Section order on /meet-us. */
export const TEAM_GROUPS: { id: TeamGroup; title: string }[] = [
  { id: "eboard", title: "Eboard" },
  { id: "directors", title: "Directors" },
];

// Layout and order follow the Meet Us frame (466:83) in Figma; the roster is the
// current one (Design merged into Web, Hackathon retired, Relations became Outreach).
export const TEAM: TeamMember[] = [
  { id: "david-youm", name: "David Youm", role: "President", group: "eboard" },
  {
    id: "coen-mcferson",
    name: "Coen McFerson",
    role: "Vice President",
    group: "eboard",
  },
  { id: "rishi-raj", name: "Rishi Raj", role: "Secretary", group: "eboard" },
  { id: "ayan-ospan", name: "Ayan Ospan", role: "Treasurer", group: "eboard" },
  {
    id: "khai-ta-publicity",
    name: "Khai Ta",
    role: "Publicity",
    group: "eboard",
  },
  {
    id: "ethan-elemento",
    name: "Ethan Elemento",
    role: "Outreach",
    group: "eboard",
  },
  {
    id: "khai-ta",
    name: "Khai Ta",
    role: "Dev Team Director",
    group: "directors",
    committee: "acm-dev",
  },
  {
    id: "ben-nguyen",
    name: "Ben Nguyen",
    role: "Quantum Director",
    group: "directors",
    committee: "acm-quantum",
  },
  {
    id: "nikita-kiselov",
    name: "Nikita Kiselov",
    role: "ICPC Director",
    group: "directors",
    committee: "acm-icpc",
  },
  {
    id: "younsoo-park",
    name: "Younsoo Park",
    role: "Web Director",
    group: "directors",
    committee: "acm-web",
  },
  {
    id: "sri-nikhil-bandi",
    name: "Sri Nikhil Bandi",
    role: "AI Director",
    group: "directors",
    committee: "acm-ai",
  },
  {
    id: "aryaman-ajmera",
    name: "Aryaman Ajmera",
    role: "Data Director",
    group: "directors",
    committee: "acm-data",
  },
];

export function committeeDirector(committeeId: string) {
  return TEAM.find((member) => member.committee === committeeId);
}

/** First letters of the first two name parts: `Mohammad Yafi Akhtar` → `MY`. */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
