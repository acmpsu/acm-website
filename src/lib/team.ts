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

// Layout follows the Meet Us frame (466:83) in Figma; roster, order and headshots come from
// the 2026–27 officer board. Photos live in /public/team (square crops).
export const TEAM: TeamMember[] = [
  {
    id: "dylan-mcdonnell",
    name: "Dylan McDonnell",
    role: "President",
    group: "eboard",
    photo: "/team/dylan-mcdonnell.jpg",
  },
  {
    id: "coen-mcferson",
    name: "Coen McFerson",
    role: "Vice President",
    group: "eboard",
    photo: "/team/coen-mcferson.jpg",
  },
  {
    id: "rishi-raj",
    name: "Rishi Raj",
    role: "Secretary",
    group: "eboard",
    photo: "/team/rishi-raj.jpg",
  },
  {
    id: "ayan-ospan",
    name: "Ayan Ospan",
    role: "Treasurer",
    group: "eboard",
    photo: "/team/ayan-ospan.jpg",
  },
  {
    id: "khai-ta-publicity",
    name: "Khai Ta",
    role: "Publicity",
    group: "eboard",
    photo: "/team/khai-ta.jpg",
  },
  {
    id: "khai-ta",
    name: "Khai Ta",
    role: "Dev Team Director",
    group: "directors",
    committee: "acm-dev",
    photo: "/team/khai-ta.jpg",
  },
  {
    id: "ben-nguyen",
    name: "Ben Nguyen",
    role: "Quantum Director",
    group: "directors",
    committee: "acm-quantum",
    photo: "/team/ben-nguyen.jpg",
  },
  {
    id: "nikita-kiselov",
    name: "Nikita Kiselov",
    role: "ICPC Director",
    group: "directors",
    committee: "acm-icpc",
    photo: "/team/nikita-kiselov.jpg",
  },
  {
    id: "tejasv-agarwal",
    name: "Tejasv Agarwal",
    role: "Outreach Director",
    group: "directors",
    photo: "/team/tejasv-agarwal.jpg",
  },
  {
    id: "sri-nikhil-bandi",
    name: "Sri Nikhil Bandi",
    role: "AI Director",
    group: "directors",
    committee: "acm-ai",
    photo: "/team/sri-nikhil-bandi.jpg",
  },
  {
    id: "aryaman-ajmera",
    name: "Aryaman Ajmera",
    role: "Data Director",
    group: "directors",
    committee: "acm-data",
    photo: "/team/aryaman-ajmera.jpg",
  },
  {
    id: "ethan-elemento",
    name: "Ethan Elemento",
    role: "Outreach Director",
    group: "directors",
    photo: "/team/ethan-elemento.jpg",
  },
  {
    id: "younsoo-park",
    name: "Younsoo Park",
    role: "Web Director",
    group: "directors",
    committee: "acm-web",
    photo: "/team/younsoo-park.jpg",
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
