import { CommitteePane } from "@/components/committees/CommitteePane";
import styles from "@/components/committees/committees.module.css";
import { ticketMono } from "@/components/tickets/typography";
import { COMMITTEES } from "@/lib/constants";

export const metadata = { title: "Committees — Penn State ACM" };

export default function CommitteesPage() {
  return (
    <div className={`${styles.page} ${ticketMono.variable}`}>
      <h1 className="sr-only">Committees</h1>
      {COMMITTEES.map((committee, index) => {
        const next = COMMITTEES[index + 1];
        return (
          <CommitteePane
            key={committee.id}
            committee={committee}
            next={next
              ? { href: `#${next.id}`, label: `Next: ${next.shortName}` }
              : { href: `#${COMMITTEES[0].id}`, label: `Back to ${COMMITTEES[0].shortName}`, up: true }}
          />
        );
      })}
    </div>
  );
}
