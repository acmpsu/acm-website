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
  const source =
    fullName?.trim() || email.split("@")[0].replace(/[._-]+/g, " ");
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
        className="flex size-11 items-center justify-center rounded-full bg-azure-12 font-body text-[14px] font-semibold text-white shadow-lift transition duration-200 ease-ds hover:bg-azure-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-12 xl:size-[55px] xl:text-[16px]"
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
            className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-[20px] border border-azure-12/12 bg-grey-95-2 p-3 font-body text-azure-12 shadow-[var(--ds-shadow-menu)]"
          >
            <div className="mb-1 border-b border-azure-12/10 px-4 pb-3 pt-1">
              {fullName && (
                <p className="truncate text-[15px] font-semibold">{fullName}</p>
              )}
              <p className="truncate text-[13px] text-azure-36">{email}</p>
            </div>

            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-4 text-[15px] font-medium transition duration-150 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-12"
            >
              My membership
            </Link>

            <Link
              href="/my-events"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-4 text-[15px] font-medium transition duration-150 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-12"
            >
              My events
            </Link>

            <form
              action={signOut}
              className="mt-1 border-t border-azure-12/10 pt-1"
            >
              <button
                type="submit"
                role="menuitem"
                className="flex min-h-11 w-full items-center rounded-xl px-4 text-left text-[15px] font-medium transition duration-150 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-12"
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
