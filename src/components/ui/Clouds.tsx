import Image from "next/image";

import styles from "./ds.module.css";

const ART = {
  /** Iridescent cloud ribbon used on Committees and the home Sponsors band. */
  ribbon: "/resources/committees/clouds.png",
  /** Cloud bank above the footer. */
  bank: "/resources/footer/clouds.png",
} as const;

type CloudsProps = {
  art?: keyof typeof ART;
  /** Gentle float loop; off under prefers-reduced-motion. */
  drift?: boolean;
  /** Travel right to left as the section scrolls past (where scroll timelines are supported). */
  scroll?: boolean;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Decorative cloud artwork (2172 × 724 exports). Hidden from assistive tech. */
export function Clouds({ art = "ribbon", drift = false, scroll = false, sizes, className, priority }: CloudsProps) {
  return (
    <Image
      src={ART[art]}
      alt=""
      aria-hidden="true"
      width={2172}
      height={724}
      sizes={sizes}
      priority={priority}
      className={[styles.clouds, drift && styles.drift, scroll && styles.scrollDrift, className].filter(Boolean).join(" ")}
    />
  );
}
