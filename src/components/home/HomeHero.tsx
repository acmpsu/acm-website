import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";

import { HERO_SPARKLES } from "./heroSparkles";
import styles from "./home.module.css";

/** Figma "Hero Section" (50:336): painted meadow, sparkle overlay, oversized "ACM". */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <Image src="/resources/home/hero.png" alt="" fill priority sizes="100vw" className={styles.heroArt} />
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroGrain} aria-hidden="true" />
      <div className={styles.sparkles} aria-hidden="true">
        {HERO_SPARKLES.map(([file, top, right, bottom, left, opacity, bleed], index) => (
          <span
            key={index}
            className={styles.sparkle}
            style={{ inset: `${top}% ${right}% ${bottom}% ${left}%`, opacity, "--bleed": `${bleed ?? 0}%` } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative SVGs */}
            <img src={`/resources/home/sparkles/${file}`} alt="" />
          </span>
        ))}
      </div>

      <div className={styles.heroContent}>
        <h1 id="hero-title" className={styles.heroTitle}>
          ACM<span className="sr-only"> at Penn State</span>
        </h1>
        <p className={styles.heroTagline}>The largest computer science community at Penn State</p>
      </div>

      <a href="#about" className={styles.scrollCue}>
        Scroll to explore
        <ArrowDown size={22} strokeWidth={1.5} aria-hidden="true" className={styles.scrollArrow} />
      </a>
    </section>
  );
}
