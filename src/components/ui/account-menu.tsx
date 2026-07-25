"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { signOut } from "@/app/(pages)/login/actions";

type AccountMenuProps = {
  email: string;
  fullName: string | null;
};

/** Initials from a full name, falling back to the first letters of the email. */
function initialsFor(fullName: string | null, email: string) {
  const source = fullName?.trim() || email.split("@")[0].replace(/[._-]+/g, " ");
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export function AccountMenu({ email, fullName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy)] text-[12px] font-bold text-white transition hover:bg-[var(--navy-dk)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]"
      >
        {initialsFor(fullName, email)}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-lg"
          >
            <div className="border-b border-[var(--border)] px-3 py-2.5">
              {fullName && (
                <p className="truncate text-[13px] font-semibold text-[var(--navy-dk)]">{fullName}</p>
              )}
              <p className="truncate text-[12px] text-[var(--slate)]">{email}</p>
            </div>

            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-[13px] text-[var(--navy-dk)] transition hover:bg-[var(--bg-alt)]"
            >
              My membership
            </Link>

            <form action={signOut} className="border-t border-[var(--border)]">
              <button
                type="submit"
                role="menuitem"
                className="block w-full px-3 py-2.5 text-left text-[13px] text-[var(--navy-dk)] transition hover:bg-[var(--bg-alt)]"
              >
                Sign out
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
