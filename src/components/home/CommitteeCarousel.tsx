"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import styles from "./home.module.css";

type Logo = { id: string; href: string; src: string; label: string };

const LOOP_SECONDS = 20;
const STEP_MS = 450;

/**
 * Looping committee-logo rail with previous / pause / next controls. The set is rendered
 * twice so the loop is seamless; the copy is hidden from assistive tech. Pauses while
 * hovered or focused, and starts paused when the visitor prefers reduced motion.
 */
export function CommitteeCarousel({ logos }: { logos: Logo[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pausedRef = useRef(false);
  const offset = useRef(0);
  const step = useRef<{ from: number; to: number; start: number } | null>(null);

  useEffect(() => {
    pausedRef.current = paused || hovered;
  }, [paused, hovered]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pausedRef.current = true;
      queueMicrotask(() => setPaused(true));
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const rail = railRef.current;
      const dt = Math.min(now - last, 64);
      last = now;
      if (rail) {
        const setWidth = rail.scrollWidth / 2;
        if (step.current) {
          const t = Math.min(1, (now - step.current.start) / STEP_MS);
          const eased = 1 - (1 - t) ** 3;
          offset.current =
            step.current.from + (step.current.to - step.current.from) * eased;
          if (t === 1) step.current = null;
        } else if (!pausedRef.current && setWidth > 0) {
          offset.current += (setWidth / (LOOP_SECONDS * 1000)) * dt;
        }
        const wrapped =
          setWidth > 0
            ? ((offset.current % setWidth) + setWidth) % setWidth
            : 0;
        rail.style.transform = `translateX(${-wrapped}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const move = (direction: 1 | -1) => {
    const first = railRef.current?.querySelector("li");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(railRef.current!).columnGap) || 0;
    const distance = first.getBoundingClientRect().width + gap;
    step.current = {
      from: offset.current,
      to: offset.current + direction * distance,
      start: performance.now(),
    };
  };

  return (
    <div className={styles.carouselWrap}>
      <div
        className={styles.logoCarousel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <ul ref={railRef} className={styles.logoRail}>
          {[false, true].map((copy) =>
            logos.map((logo) => (
              <li
                key={`${logo.id}${copy ? "-loop" : ""}`}
                aria-hidden={copy || undefined}
              >
                <a
                  href={logo.href}
                  tabIndex={copy ? -1 : undefined}
                  className={styles.logoLink}
                >
                  <Image
                    src={logo.src}
                    alt={copy ? "" : logo.label}
                    width={2880}
                    height={724}
                    sizes="(min-width: 1280px) 480px, 45vw"
                  />
                </a>
              </li>
            )),
          )}
        </ul>
      </div>

      <div className={styles.carouselControls}>
        <button
          type="button"
          className={styles.carouselButton}
          aria-label="Previous committee"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.carouselButton}
          aria-label={paused ? "Play carousel" : "Pause carousel"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className={styles.carouselButton}
          aria-label="Next committee"
          onClick={() => move(1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
