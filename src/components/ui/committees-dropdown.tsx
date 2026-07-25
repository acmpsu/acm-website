"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { COMMITTEES } from "@/lib/constants";

export function CommitteesDropDown() {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdownWithDelay}
    >
      <div className="flex items-center gap-1">
        <Link
          href="/committees"
          className="text-[13px] font-medium text-[var(--navy-dk)] hover:text-[var(--navy)] transition"
        >
          Committees
        </Link>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onFocus={openDropdown}
          onBlur={closeDropdownWithDelay}
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 text-[var(--navy-dk)]"
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className="relative"
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdownWithDelay}
      >
        <AnimatePresence>
        {open ? (
          <>
            <div className="absolute left-0 top-full h-2 w-20" />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 top-[calc(100%+8px)] w-40 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {COMMITTEES.map((committee) => (
                <Link
                  key={committee.id}
                  href={`/committees#${committee.id}`}
                  className="block px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                >
                  {committee.shortName}
                </Link>
              ))}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
      </div>
    </div>
  );
}
