"use client";

import { useEffect, useRef } from "react";

import styles from "./committees.module.css";

/**
 * Stacks the committee panes: each pane pins once its bottom reaches the bottom of the
 * viewport, and the next pane slides over it. Sets two CSS variables per pane:
 * --stick-top (negative for panes taller than the viewport, so their bottom stays readable)
 * and --cover (0–1, how far the next pane has covered this one).
 * Without JavaScript the panes simply scroll.
 */
export function CommitteeStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const panes = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
    let frame = 0;

    const measure = () => {
      for (const pane of panes) {
        pane.style.setProperty("--stick-top", `${Math.min(0, window.innerHeight - pane.offsetHeight)}px`);
      }
      update();
    };

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      panes.forEach((pane, index) => {
        const next = panes[index + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const cover = Math.min(1, Math.max(0, (viewport - top) / viewport));
        pane.style.setProperty("--cover", cover.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(measure);
    panes.forEach((pane) => observer.observe(pane));
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.classList.add(styles.stacked);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      root.classList.remove(styles.stacked);
    };
  }, []);

  return (
    <div ref={ref} className={styles.stack}>
      {children}
    </div>
  );
}
