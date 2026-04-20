"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export type ShiftingDropDownItem = {
  /** Stable React key when multiple items share an `href` */
  id?: string;
  label: string;
  href: string;
};

export type ShiftingDropDownLabelLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const defaultLabelLinkClassName =
  "text-sm font-medium text-gray-800 hover:text-gray-600 underline-offset-4 hover:underline";

/** Preset-styled `Link` for dropdown trigger labels; use alone or with `labelHref` on `ShiftingDropDown`. */
export function ShiftingDropDownLabelLink({
  href,
  children,
  className = defaultLabelLinkClassName,
}: ShiftingDropDownLabelLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

type ShiftingDropDownProps<T extends ShiftingDropDownItem = ShiftingDropDownItem> = {
  /** Text on the dropdown trigger */
  label: string;
  /** When set, the label is a link (chevron stays a separate menu button). */
  labelHref?: string;
  /** Classes for the label link when `labelHref` is set; ignored otherwise */
  labelLinkClassName?: string;
  items: readonly T[];
  /** Override default link row; use for icons, badges, or non-link rows */
  renderItem?: (item: T) => ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
  itemClassName?: string;
};

const defaultItemClassName =
  "block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";

const chevronButtonClassName =
  "inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-800 hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function ShiftingDropDown<T extends ShiftingDropDownItem = ShiftingDropDownItem>({
  label,
  labelHref,
  labelLinkClassName,
  items,
  renderItem,
  triggerClassName = "flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-600",
  panelClassName = "absolute left-0 top-[calc(100%+12px)] w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg",
  itemClassName = defaultItemClassName,
}: ShiftingDropDownProps<T>) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdown = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeDropdownWithDelay = () => {
    clearCloseTimer();
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  const handleContainerBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Node && containerRef.current?.contains(next)) {
      return;
    }
    closeDropdownWithDelay();
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  const linkClass = labelLinkClassName ?? defaultLabelLinkClassName;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdownWithDelay}
      onFocusCapture={openDropdown}
      onBlur={handleContainerBlur}
    >
      {labelHref ? (
        <div className={triggerClassName}>
          <ShiftingDropDownLabelLink href={labelHref} className={linkClass}>
            {label}
          </ShiftingDropDownLabelLink>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={`Open ${label} menu`}
            onClick={() => setOpen((prev) => !prev)}
            className={chevronButtonClassName}
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={triggerClassName}
        >
          <span>{label}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}

      <AnimatePresence>
        {open ? (
          <>
            <div className="absolute left-0 top-full h-3 w-48" />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={panelClassName}
            >
              {items.map((item, index) => (
                <div key={item.id ?? item.href ?? index} role="none">
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <Link href={item.href} className={itemClassName}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
