"use client";

import { useEffect, useRef } from "react";

import styles from "./scrollStack.module.css";

type ScrollStackProps = {
  children: React.ReactNode;
  /** How far each section's rounded top overlaps the one before it (Figma: 80px). */
  overlap?: "none" | "figma";
  /** Make every section at least one screen tall (sections may set --pane-h for more), like the full-screen panes in the design. */
  fullScreen?: boolean;
  className?: string;
};

/**
 * The Figma "scrolling panes" stack: each direct `<section>` child pins once its bottom
 * reaches the bottom of the viewport, and the next one slides over it. Sets --stick-top
 * per section (negative for sections taller than the viewport, so their bottom stays
 * readable). Without JavaScript the
 * sections simply scroll. Put in-page anchors on a <StackAnchor> before a section, not on
 * the section itself: browsers scroll to a pinned section's pinned position.
 */
export function ScrollStack({
  children,
  overlap = "none",
  fullScreen = false,
  className,
}: ScrollStackProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(":scope > section, :scope > footer"),
    );

    const measure = () => {
      for (const section of sections) {
        section.style.setProperty(
          "--stick-top",
          `${Math.min(0, window.innerHeight - section.offsetHeight)}px`,
        );
      }
    };

    const observer = new ResizeObserver(measure);
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("resize", measure);
    root.classList.add(styles.stacked);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      root.classList.remove(styles.stacked);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[
        styles.stack,
        overlap === "figma" && styles.overlap,
        fullScreen && styles.fullScreen,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

/** In-flow anchor target placed just before a stacked section. */
export function StackAnchor({ id }: { id: string }) {
  return <span id={id} className={styles.anchor} />;
}
