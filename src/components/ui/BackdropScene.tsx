import Image from "next/image";

import { ticketMono } from "@/components/tickets/typography";
import styles from "./backdrop.module.css";

type BackdropSceneProps = {
  /** Photo under /public, shown blurred behind the panel. */
  image: string;
  /** Page-specific panel sizing (width, padding, gap). */
  panelClassName?: string;
  children: React.ReactNode;
};

/**
 * Full-bleed blurred photo with a blue tint and a centered frosted panel, shared by the
 * Figma "Meet Us" (466:83) and "Sponsors / Contact Us" (494:169) frames.
 */
export function BackdropScene({
  image,
  panelClassName,
  children,
}: BackdropSceneProps) {
  return (
    <section className={`${styles.scene} ${ticketMono.variable}`}>
      <Image
        src={image}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        loading="eager"
        className={styles.photo}
      />
      <div className={styles.tint} aria-hidden="true" />
      <div className={`${styles.panel} ${panelClassName ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
