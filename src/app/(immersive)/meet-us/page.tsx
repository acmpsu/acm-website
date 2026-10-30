import { PersonCard } from "@/components/team/PersonCard";
import styles from "@/components/team/team.module.css";
import { BackdropScene } from "@/components/ui/BackdropScene";
import { PageHeading } from "@/components/ui/Layout";
import { TEAM, TEAM_GROUPS } from "@/lib/team";

export const metadata = { title: "Meet Us — Penn State ACM" };

const pad = (n: number) => String(n).padStart(2, "0");

export default function MeetUsPage() {
  return (
    // Same meadow fill as the GBM boarding pass (Figma "Meet Us — duplicated stationary background").
    <BackdropScene
      image="/resources/tickets/meadow.png"
      panelClassName={styles.directory}
    >
      <PageHeading
        title="Meet Us"
        subtitle="The people behind ACM at Penn State."
      />

      <hr className={styles.divider} />

      {TEAM_GROUPS.map((group, index) => {
        const members = TEAM.filter((member) => member.group === group.id);
        if (members.length === 0) return null;
        return (
          <section
            key={group.id}
            aria-labelledby={`${group.id}-heading`}
            className={styles.group}
          >
            <div className={styles.groupHeading}>
              <span className={styles.mono} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h2 id={`${group.id}-heading`} className={styles.groupTitle}>
                {group.title}
              </h2>
              <span className={`${styles.mono} ${styles.count}`}>
                {pad(members.length)} members
              </span>
            </div>
            <div className={styles.grid}>
              {members.map((member) => (
                <PersonCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        );
      })}

      <hr className={styles.divider} />
      <p className={`${styles.mono} ${styles.footer}`}>ACM · Penn State</p>
    </BackdropScene>
  );
}
