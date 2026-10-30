export type Partner = {
  id: string;
  name: string;
  /** Light-on-dark mark exported from the Figma Partners section. */
  logo: string;
  /** Logo box from the Figma at 1920 wide; logos are fitted (never stretched) inside it. */
  box: { width: number; height: number };
  website?: string;
};

// Campus partners and order from the Figma "Partners Section" (50:744): three on the first row, two on the second.
export const PARTNERS: Partner[] = [
  {
    id: "nittany-ai",
    name: "Nittany AI Alliance",
    logo: "/resources/home/partners/nittany-ai.png",
    box: { width: 246, height: 220 },
  },
  {
    id: "sase",
    name: "SASE at Penn State",
    logo: "/resources/home/partners/sase.png",
    box: { width: 220, height: 212 },
  },
  {
    id: "girls-who-code",
    name: "Girls Who Code at Penn State",
    logo: "/resources/home/partners/girls-who-code.png",
    box: { width: 264, height: 176 },
  },
  {
    id: "qss",
    name: "QSS",
    logo: "/resources/home/partners/qss.png",
    box: { width: 220, height: 220 },
  },
  {
    id: "aws-cloud-clubs",
    name: "AWS Cloud Club at Penn State",
    logo: "/resources/home/partners/aws-cloud-clubs.png",
    box: { width: 260, height: 230 },
  },
];

/** Shown under the partner logos. The Figma's address; confirm before launch. */
export const PARTNER_EMAIL = "help@acm.edu";
