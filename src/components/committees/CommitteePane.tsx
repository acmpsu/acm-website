import Image from "next/image";

import type { Committee } from "@/lib/constants";
import { committeeDirector } from "@/lib/team";
import { CommitteePreview } from "./CommitteePreview";
import styles from "./committees.module.css";

type CommitteePaneProps = {
  committee: Committee;
  /** In-page link to the following pane (or back to the first). */
  next: { href: string; label: string; up?: boolean };
};

/** One full-width committee pane from the Figma Committees frame (478:597). */
export function CommitteePane({ committee, next }: CommitteePaneProps) {
  const { id, shortName, tagline, description, meeting, resources, project } = committee;
  const director = committeeDirector(id)?.name;

  return (
    <>
      {/* The anchor stays in normal flow: a pinned (sticky) pane would be the wrong scroll target. */}
      <span id={id} className={styles.anchor} />
      <section aria-labelledby={`${id}-title`} className={`${styles.pane} ${styles[committee.theme]}`}>
        <div className={styles.atmosphere} aria-hidden="true">
          <span className={styles.aurora} />
          <span className={styles.bloom} />
          <span className={styles.grain} />
          <span className={styles.motif} />
        </div>

        <div className={styles.content}>
          <div className={styles.story}>
            <div className={styles.info}>
              <h2 id={`${id}-title`} className={styles.title}>{shortName}</h2>
              <p className={styles.tagline}>{tagline}</p>
              <p className={styles.description}>{description}</p>
              {director ? <p className={styles.meta}><span className={styles.caps}>Director</span> / {director}</p> : null}
              {meeting ? <p className={styles.meta}><span className={styles.caps}>Meets</span> / {meeting}</p> : null}
            </div>

            <div className={styles.projectColumn}>
              <div className={styles.clouds} aria-hidden="true">
                <Image src="/resources/committees/clouds.png" alt="" width={2172} height={724} sizes="(min-width: 1024px) 21vw, 60vw" />
              </div>
              {project ? (
                <figure className={styles.window}>
                  <div className={styles.toolbar}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={`${styles.label} ${styles.caps}`}>Sample project / {shortName}</span>
                  </div>
                  <h3 className={styles.windowTitle}>{project.title}</h3>
                  <CommitteePreview preview={project.preview} />
                  <figcaption className={styles.disclaimer}>Project titles and previews are illustrative.</figcaption>
                </figure>
              ) : null}
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.resources}>
              <p className={`${styles.label} ${styles.caps}`}>Content &amp; assets</p>
              <p className={styles.resourceList}>{resources.join(" / ")}</p>
            </div>
            <a href={next.href} className={styles.next}>{next.label} <span aria-hidden="true">{next.up ? "↑" : "↓"}</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
