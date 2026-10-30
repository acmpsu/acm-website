"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { buttonClass } from "@/components/ui/Button";
import { COMMITTEES } from "@/lib/constants";
import styles from "./site.module.css";

/**
 * Figma "Navigation / Committees dropdown" (505:1178): a pill that toggles six committee
 * links. Click toggles; Escape, Tab-out and outside clicks close; arrow keys move between items.
 */
export function CommitteesMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const items = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLAnchorElement>(
        "[data-menu-item]",
      ) ?? [],
    );

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      requestAnimationFrame(() => items()[0]?.focus());
      return;
    }
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLAnchorElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    list[(index + step + list.length) % list.length]?.focus();
  }

  return (
    <div
      ref={rootRef}
      className={styles.menuRoot}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={buttonClass("pill")}
      >
        Committees
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={menuId}
            className={styles.menu}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {COMMITTEES.map((committee) => (
              <li key={committee.id}>
                <Link
                  href={`/committees#${committee.id}`}
                  data-menu-item
                  className={styles.menuItem}
                  onClick={() => setOpen(false)}
                >
                  {committee.shortName}
                </Link>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
