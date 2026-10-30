import Image from "next/image";

import { ticketMono } from "@/components/tickets/typography";
import styles from "./backdrop.module.css";

type BackdropSceneProps = {
  /** Photo under /public, shown blurred behind the panel. */
  image: string;
  /** Page-specific panel sizing (width, padding, gap). */
  panelClassName?: string;
  /** Slowly drift the background and float the panel in (the Figma "motion loop" pages). */
  motion?: boolean;
  /**
   * Spin a windmill rotor over the photo. The photo must have its painted blades removed.
   * Sizes are in the photo's own pixels; `plane` is the 2×2 matrix [a, b, c, d] that maps
   * the unit rotor disc onto the photo, so the blades turn in the tower's tilted plane.
   */
  rotor?: {
    width: number;
    height: number;
    cx: number;
    cy: number;
    plane: [number, number, number, number];
  };
  children: React.ReactNode;
};

/**
 * Full-bleed blurred photo with a blue tint and a centered frosted panel, shared by the
 * Figma "Meet Us" (466:83) and "Sponsors / Contact Us" (494:169) frames.
 */
export function BackdropScene({
  image,
  panelClassName,
  motion = false,
  rotor,
  children,
}: BackdropSceneProps) {
  return (
    <section
      className={`${styles.scene} ${motion ? styles.moving : ""} ${ticketMono.variable}`}
    >
      {rotor ? (
        // Photo and blades share one coordinate space, so the rotor stays on the tower at any crop.
        <svg
          className={`${styles.photo} ${styles.photoSvg}`}
          viewBox={`0 0 ${rotor.width} ${rotor.height}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <image href={image} width={rotor.width} height={rotor.height} />
          <defs>
            {/* Only the middle of each blade shows: faded at the hub and toward the tip. */}
            <radialGradient
              id="rotor-fade"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.12" stopColor="#eeeefa" stopOpacity="0" />
              <stop offset="0.45" stopColor="#eeeefa" stopOpacity="1" />
              <stop offset="0.95" stopColor="#eeeefa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g
            transform={`matrix(${rotor.plane.join(" ")} ${rotor.cx} ${rotor.cy})`}
          >
            <g className={styles.rotor} fill="url(#rotor-fade)">
              {[0, 120, 240].map((angle) => (
                <path
                  key={angle}
                  transform={`rotate(${angle})`}
                  d="M-0.05 0 Q-0.06 -0.4 -0.012 -1 L0.012 -1 Q0.06 -0.4 0.05 0 Z"
                />
              ))}
            </g>
          </g>
        </svg>
      ) : (
        <Image
          src={image}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          loading="eager"
          className={styles.photo}
        />
      )}
      <div className={styles.tint} aria-hidden="true" />
      <div className={`${styles.panel} ${panelClassName ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
