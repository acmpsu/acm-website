import Image from "next/image";

import { committeePageFragmentId } from "@/lib/constants";

type Committee = {
  name: string;
  logo: string;
  description: string;
};

const COMMITTEES: Committee[] = [
  {
    name: "acm.ai",
    logo: "/logos/ai.png",
    description:
      "Explores machine learning, modern AI tooling, and responsible applications through workshops, reading groups, and hands-on projects that meet members where they are.",
  },
  {
    name: "acm.data",
    logo: "/logos/data.png",
    description:
      "Focuses on data engineering, analytics, and visualization—turning raw information into clear stories and reliable pipelines with practical, industry-relevant skills.",
  },
  {
    name: "acm.design",
    logo: "/logos/design.png",
    description:
      "Covers product and visual design, UX fundamentals, and design systems so technical work ships with interfaces people actually want to use.",
  },
  {
    name: "acm.hack",
    logo: "/logos/hack.png",
    description:
      "Builds full-stack web skills from accessible front ends to APIs and deployment, emphasizing real projects, modern frameworks, and clean engineering habits.",
  },
  {
    name: "acm.icpc",
    logo: "/logos/icpc.png",
    description:
      "Prepares members for competitive programming and ICPC-style contests with structured practice, algorithms deep dives, and team problem-solving sessions.",
  },
  {
    name: "acm.quantum",
    logo: "/logos/quantum.png",
    description:
      "Introduces quantum computing concepts, tools, and research directions—bridging linear algebra and programming with curiosity-first learning.",
  },
  {
    name: "acm.web",
    logo: "/logos/web.png",
    description:
      "Builds full-stack web skills from accessible front ends to APIs and deployment, emphasizing real projects, modern frameworks, and clean engineering habits.",
  },
  {
    name: "acm.game",
    logo: "/logos/game.png",
    description:
      "Explores game design, development, and interactive experiences using modern game engines and creative problem-solving.",
  },
  {
    name: "acm.cyber",
    logo: "/logos/cyber.png",
    description:
      "Focuses on cybersecurity fundamentals, ethical hacking, and defensive strategies to protect systems and networks.",
  },
];

export default function CommitteesPage() {
  return (
    <div className="border-b border-[var(--border)] px-8 py-[72px]">
      <div className="mx-auto max-w-[1160px]">
        <section id="committees-intro" className="mb-16">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Committees
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Our Tracks
          </p>
          <p className="mt-2 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            ACM committees are how we organize learning and projects by interest. Each group runs events,
            workshops, and mentorship so you can go deep with peers who care about the same problems.
          </p>
        </section>

        <section id="committee-list" className="space-y-12">
          {COMMITTEES.map((committee, index) => (
            <article
              key={committee.logo}
              id={committeePageFragmentId(committee.name)}
              className="committee-item grid gap-12 lg:grid-cols-[240px_1fr] lg:items-center"
            >
              <div className="flex justify-center lg:justify-start">
                <div className="committee-3d-wrap relative h-40 w-40">
                  <div
                    className={`committee-spin-3d ${index % 2 === 0 ? "committee-spin-3d-forward" : "committee-spin-3d-backward"}`}
                  >
                    <div className="committee-face committee-face-front">
                      <Image
                        src={committee.logo}
                        alt={`${committee.name} logo`}
                        fill
                        className="committee-logo-img object-contain"
                        sizes="160px"
                      />
                    </div>
                    <div className="committee-face committee-face-back" aria-hidden="true">
                      <Image
                        src={committee.logo}
                        alt=""
                        fill
                        className="committee-logo-img object-contain"
                        sizes="160px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1 text-center lg:text-left">
                <h2 className="text-[clamp(20px,2vw,28px)] font-extrabold tracking-[-0.02em] text-[var(--navy-dk)]">
                  {committee.name}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.75] text-[var(--slate)]">
                  {committee.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
