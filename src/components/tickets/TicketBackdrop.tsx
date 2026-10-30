import Image from "next/image";
import { ticketMono } from "./typography";
import styles from "./tickets.module.css";

export function TicketBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <section className={`${styles.scene} ${ticketMono.variable}`}>
      <Image
        src="/resources/tickets/meadow.png"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        loading="eager"
        className={styles.meadow}
      />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.sceneContent}>{children}</div>
    </section>
  );
}
