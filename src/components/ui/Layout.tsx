import type { ReactNode } from "react";

import styles from "./ds.module.css";

type WithChildren = { className?: string; children: ReactNode };
const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Centered content column: 84% of the viewport up to the 1612.8px Figma frame, 16px gutters on phones. */
export function Container({ className, children }: WithChildren) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}

type SectionProps = WithChildren & {
  id?: string;
  /** `night` and `sky` are the dark Figma bands; `plain` keeps the page background. */
  tone?: "plain" | "night" | "sky";
  /** Rounded top corners that overlap the section above, as in the Figma scroll stack. */
  rounded?: boolean;
  labelledBy?: string;
};

/** Vertical rhythm + optional dark band for a page section. */
export function Section({ id, tone = "plain", rounded = false, labelledBy, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(styles.section, styles[tone], rounded && styles.rounded, className)}>
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
};

/** Serif section title with an optional mono eyebrow and supporting copy. */
export function SectionHeader({ id, eyebrow, title, description, as: Heading = "h2", className }: SectionHeaderProps) {
  return (
    <header className={cx(styles.sectionHeader, className)}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading id={id} className={styles.sectionTitle}>{title}</Heading>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </header>
  );
}

type PageHeadingProps = { title: ReactNode; subtitle?: ReactNode; eyebrow?: string; className?: string };

/** The one `<h1>` on a page: large italic serif, as on Meet Us and Sponsor ACM. */
export function PageHeading({ title, subtitle, eyebrow, className }: PageHeadingProps) {
  return (
    <header className={cx(styles.pageHeading, className)}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.pageTitle}>{title}</h1>
      {subtitle ? <p className={styles.pageSubtitle}>{subtitle}</p> : null}
    </header>
  );
}

type CardProps = WithChildren & {
  as?: "div" | "article" | "li" | "section";
  /** `outline` = white with an ink border (person cards); `raised` = white with a soft shadow. */
  variant?: "outline" | "raised";
};

/** White card shell; the design uses a border or a shadow, never both. */
export function Card({ as: Tag = "div", variant = "outline", className, children }: CardProps) {
  return <Tag className={cx(styles.card, styles[variant], className)}>{children}</Tag>;
}
