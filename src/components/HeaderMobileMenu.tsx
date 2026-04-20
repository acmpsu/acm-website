"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import { COMMITTEES, committeePageFragmentId, NAV_ITEMS } from "@/lib/constants";

const INITIATIVES_ITEMS = [{ label: "Dev Team", href: "/dev-team" }] as const;

type MobileNavAccordionProps = {
  menuOpen: boolean;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function MobileNavAccordion({ menuOpen, title, defaultOpen = false, children }: MobileNavAccordionProps) {
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;
  const [expanded, setExpanded] = useState(defaultOpen);

  useEffect(() => {
    if (!menuOpen) setExpanded(false);
  }, [menuOpen]);

  return (
    <div className="border-b border-slate-100 pb-1">
      <button
        type="button"
        id={triggerId}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="min-h-0 overflow-hidden"
        >
          <div className="space-y-0.5 pb-2 pt-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={close}
            />
            <motion.div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20rem)] flex-col border-l border-slate-200 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">Menu</span>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <ChevronRight size={20} strokeWidth={2}/>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 text-sm font-medium text-slate-800">
                <MobileNavAccordion menuOpen={open} title="Committees">
                  <Link
                    href="/committees"
                    className="block rounded-lg px-3 py-2 pl-4 text-slate-800 hover:bg-slate-50"
                    onClick={close}
                  >
                    All committees
                  </Link>
                  <ul>
                    {COMMITTEES.map((c) => (
                      <li key={c.name}>
                        <Link
                          href={`/committees#${committeePageFragmentId(c.name)}`}
                          className="block rounded-lg py-2 pl-6 pr-3 text-slate-700 hover:bg-slate-50"
                          onClick={close}
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </MobileNavAccordion>

                <MobileNavAccordion menuOpen={open} title="Initiatives">
                  <ul>
                    {INITIATIVES_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 pl-4 text-slate-800 hover:bg-slate-50"
                          onClick={close}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </MobileNavAccordion>

                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-slate-800 hover:bg-slate-50"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-auto border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    className="w-full rounded-full bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
                  >
                    Login
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
