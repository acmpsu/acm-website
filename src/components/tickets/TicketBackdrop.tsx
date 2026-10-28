import Image from "next/image";
import { Red_Hat_Mono } from "next/font/google";
import styles from "./tickets.module.css";

const ticketMono = Red_Hat_Mono({ variable: "--font-ticket-mono", subsets: ["latin"], weight: ["400", "500"] });

export function TicketBackdrop({ children }: { children: React.ReactNode }) {
  return <section className={`${styles.scene} ${ticketMono.variable}`}>
    <Image src="/resources/tickets/meadow.png" alt="" fill unoptimized sizes="100vw" loading="eager" className={styles.meadow} />
    <div className={styles.veil} aria-hidden="true" />
    <div className={styles.sceneContent}>{children}</div>
  </section>;
}
