import Image from "next/image";

import { COMMITTEES } from "@/lib/constants";
import { CommitteeCarousel } from "./CommitteeCarousel";
import styles from "./home.module.css";

/** Figma "About Section" (50:424): vine garland, intro copy, looping committee logos. */
export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className={styles.about}>
      <Image
        src="/resources/home/about-garland.png"
        alt=""
        width={2172}
        height={724}
        sizes="108vw"
        className={styles.garland}
      />

      <div className={styles.aboutIntro}>
        <h2 id="about-heading" className={styles.aboutTitle}>
          About ACM{" "}
          <span className={styles.flourish} aria-hidden="true">
            ⋆｡°
          </span>
        </h2>
        <p className={styles.aboutCopy}>
          <span>
            ACM at Penn State is the largest computer science and engineering
            student organization on campus, welcoming students of all majors and
            experience levels.
          </span>{" "}
          <span>
            Our six committees span ICPC, web, AI, quantum, dev, and data
            through workshops, projects, and events.
          </span>{" "}
          <span>
            We also run initiatives like the Dev Team and host competitions,
            hackathons, and speaker panels.
          </span>
        </p>
      </div>

      <CommitteeCarousel
        logos={COMMITTEES.map((committee) => ({
          id: committee.id,
          href: `/committees#${committee.id}`,
          src: `/resources/home/logos/${committee.theme}.png`,
          label: `${committee.name} committee`,
        }))}
      />
    </section>
  );
}
