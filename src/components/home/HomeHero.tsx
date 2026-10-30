import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";

import { HERO_SPARKLES } from "./heroSparkles";
import styles from "./home.module.css";

/** Figma "Hero Section" (50:336): painted meadow, sparkle overlay, oversized "ACM". */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      {/* Pinned for the first screen so the scene holds still while "ACM" sinks. */}
      <div className={styles.heroBackdrop}>
        {/* The painting (its windmill blades erased) and live blades share one coordinate
            space, so the rotor stays on the tower at any crop. Hub: (812, 163) of 1288 × 714. */}
        <svg
          className={styles.heroArt}
          viewBox="0 0 1288 714"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <image href="/resources/home/hero.png" width="1288" height="714" />
          <g className={styles.rotor}>
            {[0, 120, 240].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle} 812 163)`}
                d="M807 168 Q805 120 810.5 46 L813.5 46 Q819 120 817 168 Z"
              />
            ))}
            <circle cx="812" cy="163" r="7" />
          </g>
        </svg>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.sparkles} aria-hidden="true">
          {HERO_SPARKLES.map(
            ([file, top, right, bottom, left, opacity, bleed], index) => (
              <span
                key={index}
                className={styles.sparkle}
                style={
                  {
                    inset: `${top}% ${right}% ${bottom}% ${left}%`,
                    opacity,
                    "--bleed": `${bleed ?? 0}%`,
                  } as CSSProperties
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative SVGs */}
                <img src={`/resources/home/sparkles/${file}`} alt="" />
              </span>
            ),
          )}
        </div>
      </div>

      <div className={styles.heroContent}>
        <h1 id="hero-title" className={styles.heroTitle}>
          ACM<span className="sr-only"> at Penn State</span>
        </h1>
        <p className={styles.heroTagline}>
          The largest computer science community at Penn State
        </p>
        <a href="#about" className={styles.scrollCue}>
          Scroll to explore
          <ArrowDown
            size={22}
            strokeWidth={1.5}
            aria-hidden="true"
            className={styles.scrollArrow}
          />
        </a>
      </div>
    </section>
  );
}
