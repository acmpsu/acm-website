import Image from "next/image";
import type { CSSProperties } from "react";

import { PARTNERS, PARTNER_EMAIL } from "@/lib/partners";
import styles from "./home.module.css";

/** Figma "Partners Section" (50:744): windmill, partner logos, partner email. */
export function PartnersSection() {
  return (
    <section aria-labelledby="partners-heading" className={styles.partners}>
      {/* 52-frame turning windmill from the Figma video frames (410:57); still frame for reduced motion. */}
      <picture className={styles.windmill}>
        <source
          srcSet="/resources/home/windmill-still.png"
          media="(prefers-reduced-motion: reduce)"
        />
        {/* A plain <img>: the image optimizer would flatten the animated WebP. */}
        <img
          src="/resources/home/windmill.webp"
          alt=""
          width={920}
          height={1148}
          loading="lazy"
        />
      </picture>

      <h2 id="partners-heading" className={styles.partnersTitle}>
        Our Partners{" "}
        <span className={styles.flourish} aria-hidden="true">
          ⋆｡°
        </span>
      </h2>

      <ul className={styles.partnerLogos}>
        {PARTNERS.map((partner) => (
          <li
            key={partner.id}
            className={styles.partnerLogo}
            style={
              {
                "--logo-w": partner.box.width,
                "--logo-h": partner.box.height,
              } as CSSProperties
            }
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              sizes="(min-width: 1024px) 280px, 40vw"
            />
          </li>
        ))}
      </ul>

      <p className={styles.partnersNote}>
        Looking to become a partner? Email us at
        <br />
        <a href={`mailto:${PARTNER_EMAIL}`}>{PARTNER_EMAIL}</a>
      </p>
    </section>
  );
}
