import Image from "next/image";
import styles from "./tickets.module.css";

export function StampSeal({
  label,
  date,
}: {
  label: "SEEN" | "RSVP" | "VOID";
  date: string;
}) {
  return (
    <div className={styles.seal} aria-label={`${label} · ${date}`}>
      <Image
        src="/resources/tickets/stamp-outer.svg"
        alt=""
        width={180}
        height={180}
        className={styles.sealOuter}
      />
      <Image
        src="/resources/tickets/stamp-inner.svg"
        alt=""
        width={164}
        height={164}
        className={styles.sealInner}
      />
      <span className={styles.sealBrand}>ACM · PSU</span>
      <span className={styles.sealLabel}>{label}</span>
      <span className={styles.sealDate}>{date}</span>
    </div>
  );
}
