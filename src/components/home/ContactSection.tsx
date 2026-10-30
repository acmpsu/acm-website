import Image from "next/image";

import { CONTACT_LINKS } from "@/lib/constants";
import styles from "./home.module.css";

// Window order and cloud logos from the Figma "Contact windows" (361:98).
const WINDOWS = [
  { label: "LinkedIn", cloud: "/resources/home/contact/cloud-linkedin.png" },
  { label: "GroupMe", cloud: "/resources/home/contact/cloud-groupme.png" },
  { label: "Instagram", cloud: "/resources/home/contact/cloud-instagram.png" },
  { label: "Discord", cloud: "/resources/home/contact/cloud-discord.png" },
] as const;

/**
 * Figma "Contact Section" (50:649): airplane windows whose shades lift on hover or focus
 * (and stay up on touch screens) to reveal each platform drawn in clouds.
 */
export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className={styles.contact}>
      <div className={styles.skyGrid} aria-hidden="true" />
      <Image
        src="/resources/home/contact/clouds-left.png"
        alt=""
        width={1448}
        height={1086}
        sizes="38vw"
        className={styles.cloudsLeft}
      />
      <Image
        src="/resources/home/contact/clouds-right.png"
        alt=""
        width={1448}
        height={1086}
        sizes="38vw"
        className={styles.cloudsRight}
      />

      <header className={styles.contactHeader}>
        <h2 id="contact-heading" className={styles.contactTitle}>
          Contact Us
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
          <img
            src="/resources/home/contact/plane-trail.svg"
            alt=""
            width={220}
            height={70}
            className={styles.planeTrail}
          />
        </h2>
      </header>

      <ul className={styles.windows}>
        {WINDOWS.map((window) => {
          const href = CONTACT_LINKS.find(
            (link) => link.label === window.label,
          )?.href;
          if (!href) return null;
          return (
            <li key={window.label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ACM on ${window.label} (opens in a new tab)`}
                className={styles.window}
              >
                <span className={styles.windowSky}>
                  <Image
                    src="/resources/home/contact/window-sky.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, 45vw"
                    className={styles.windowSkyArt}
                  />
                  <span className={styles.bleedHole} />
                </span>
                <Image
                  src={window.cloud}
                  alt=""
                  width={440}
                  height={430}
                  sizes="160px"
                  className={styles.cloudLogo}
                />
                <Image
                  src="/resources/home/contact/window-frame.png"
                  alt=""
                  width={1028}
                  height={1530}
                  sizes="(min-width: 1024px) 380px, 45vw"
                  className={styles.windowFrame}
                />
                {/* The shade sits above the frame and covers its rolled-up blind until it lifts. */}
                <span className={styles.aperture}>
                  <Image
                    src="/resources/home/contact/window-shade.png"
                    alt=""
                    width={430}
                    height={640}
                    sizes="(min-width: 1024px) 380px, 45vw"
                    className={styles.shade}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
