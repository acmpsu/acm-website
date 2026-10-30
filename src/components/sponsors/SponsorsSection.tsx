import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Clouds } from "@/components/ui/Clouds";
import { activeSponsors } from "@/lib/sponsors";
import { SponsorLogo } from "./SponsorLogo";
import styles from "./sponsors.module.css";

/** Home-page sponsors band: Figma "Sponsors Section" (50:493). */
export function SponsorsSection() {
  const sponsors = activeSponsors();

  return (
    <section aria-labelledby="sponsors-heading" className={styles.section}>
      <Clouds drift scroll sizes="72vw" className={styles.clouds} />

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
            <p className={styles.ctaText}>Build connections with the next generation of technical talent.</p>
          </div>
          <Button variant="secondary" href="/sponsor" className={styles.ctaButton}>
            Interested in sponsoring? Contact us <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
