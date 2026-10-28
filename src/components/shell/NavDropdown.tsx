"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

export type NavDropdownItem = {
  label: string;
  href: string;
};

type NavDropdownProps = {
  label: string;
  items: NavDropdownItem[];
  /** Called when a menu item is chosen (e.g. to close an enclosing mobile menu). */
  onNavigate?: () => void;
  className?: string;
};

/**
 * Accessible dropdown pill matching the Figma "Committees" trigger:
 * light Link Water pill + chevron, light menu card listing choices.
 *
 * Opens on hover (pointer) and on click/Enter (keyboard); closes on Escape,
 * outside click, and blur. The chevron flips when open.
 */
export function NavDropdown({ label, items, onNavigate, className = "" }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const reduce = useReducedMotion();

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    clearTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  // Close on Escape and on outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => () => clearTimer(), []);

  const choose = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`.trim()}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="pill-surface inline-flex h-11 items-center gap-2 rounded-[var(--radius-pill)] px-5 text-[15px] font-medium font-[family-name:var(--font-red-hat)] text-[var(--azure-12)] transition-[background,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-white hover:shadow-[var(--shadow-pill)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-[var(--dur-base)] ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={label}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+10px)] z-50 min-w-[220px] overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-pill)] p-2 shadow-[var(--shadow-float)]"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={choose}
                className="block rounded-[10px] px-4 py-2.5 text-[15px] font-medium font-[family-name:var(--font-red-hat)] text-[var(--azure-12)] transition-colors duration-[var(--dur-fast)] hover:bg-white/70 focus-visible:bg-white/70 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
