import Image from "next/image";
import Link from "next/link";

import { ticketMono } from "@/components/tickets/typography";
import { activeSponsors } from "@/lib/sponsors";
import { SponsorLogo } from "./SponsorLogo";
import styles from "./sponsors.module.css";

/** Home-page sponsors band: Figma "Sponsors Section" (50:493). */
export function SponsorsSection() {
  const sponsors = activeSponsors();

  return (
    <section id="sponsors" aria-labelledby="sponsors-heading" className={`${styles.section} ${ticketMono.variable}`}>
      <Image src="/resources/committees/clouds.png" alt="" width={2172} height={724} sizes="64vw" className={styles.clouds} />

      <div className={styles.content}>
        <h2 id="sponsors-heading" className={styles.heading}>
          Our Sponsors <span className={styles.flourish} aria-hidden="true">ᯓ★ˎˊ˗</span>
        </h2>
      </div>

      {/* The logo set is rendered twice so the rail loops seamlessly; the copy is hidden from assistive tech. */}
      <div className={styles.carousel}>
        <ul className={styles.rail}>
          {sponsors.map((sponsor) => (
            <li key={sponsor.id}>
              <SponsorLogo sponsor={sponsor} surface="dark" sizes="(min-width: 1280px) 540px, 36vw" className={styles.logo} />
            </li>
          ))}
          {sponsors.map((sponsor) => (
            <li key={`${sponsor.id}-loop`} aria-hidden="true" className={styles.loopCopy}>
              <SponsorLogo sponsor={sponsor} surface="dark" sizes="(min-width: 1280px) 540px, 36vw" className={styles.logo} decorative />
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.content}>
        <div className={styles.cta}>
          <div>
            <p className={styles.ctaHeading}>Sponsor ACM 2026.</p>
            <p className={styles.ctaText}>Get in touch with 1,000+ technical students from across the country</p>
          </div>
          <Link href="/sponsor" className={styles.ctaButton}>Interested in sponsoring? Contact us</Link>
        </div>
      </div>
    </section>
  );
}
