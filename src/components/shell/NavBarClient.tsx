"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { NavDropdown, type NavDropdownItem } from "./NavDropdown";

export type NavLink = { label: string; href: string };

type NavBarClientProps = {
  primary: NavLink[];
  utility: NavLink[];
  committees: NavDropdownItem[];
  /** Server-rendered auth slot (Login button or account menu). */
  authSlot: ReactNode;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Primary nav link rendered inside the glass pill, with active + hover state. */
function PillLink({
  link,
  pathname,
  onClick,
}: {
  link: NavLink;
  pathname: string;
  onClick?: () => void;
}) {
  const active = isActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative rounded-[var(--radius-pill)] px-3 py-2 text-[15px] font-medium font-[family-name:var(--font-red-hat)] transition-colors duration-[var(--dur-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2 ${
        active
          ? "text-[var(--azure-12)]"
          : "text-[var(--azure-25)] hover:text-[var(--azure-12)]"
      }`}
    >
      {link.label}
      {active ? (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--azure-36)]"
        />
      ) : null}
    </Link>
  );
}

export function NavBarClient({ primary, utility, committees, authSlot }: NavBarClientProps) {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const reduce = useReducedMotion();

  // Close the mobile menu whenever the route changes (navigation completed).
  // Adjusting state during render is React's recommended pattern for resetting
  // state in response to a prop/derived-value change — no effect needed.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  // Lock scroll + Escape-to-close while the mobile panel is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Penn State ACM — home"
          className="flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2"
        >
          <Image
            src="/logos/acm.png"
            alt="ACM"
            width={48}
            height={48}
            priority
            className="h-11 w-11 drop-shadow-[0_1px_3px_rgba(255,219,192,0.45)]"
          />
          <span className="sr-only">Penn State ACM</span>
        </Link>

        {/* Centered glass pill — primary links (desktop only) */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="nav-glass nav-glass-emboss flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-1.5">
            {primary.map((link) => (
              <li key={link.href}>
                <PillLink link={link} pathname={pathname} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Right utility cluster (desktop) */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <NavDropdown label="Committees" items={committees} />
          {utility.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className="pill-surface inline-flex h-11 items-center rounded-[var(--radius-pill)] px-5 text-[15px] font-medium font-[family-name:var(--font-red-hat)] text-[var(--azure-12)] transition-[background,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-white hover:shadow-[var(--shadow-pill)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-6 w-px bg-[var(--azure-25)]/25" />
          {authSlot}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          className="pill-surface inline-flex size-11 items-center justify-center rounded-[var(--radius-pill)] text-[var(--azure-12)] transition-[background,box-shadow] duration-[var(--dur-base)] hover:bg-white hover:shadow-[var(--shadow-pill)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2 lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-nav-panel"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="mx-4 mb-3 rounded-[var(--radius-md)] nav-glass p-3 sm:mx-6"
            >
              <ul className="flex flex-col gap-1">
                {primary.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className={`block rounded-[10px] px-4 py-3 text-base font-medium font-[family-name:var(--font-red-hat)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] ${
                        isActive(pathname, link.href)
                          ? "bg-white/70 text-[var(--azure-12)]"
                          : "text-[var(--azure-25)] hover:bg-white/60 hover:text-[var(--azure-12)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-2 h-px bg-[var(--azure-25)]/15" />

              <div className="px-1">
                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--azure-36)] font-[family-name:var(--font-red-hat-mono)]">
                  Committees
                </p>
                <ul className="grid grid-cols-2 gap-1">
                  {committees.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-[10px] px-3 py-2 text-sm font-medium text-[var(--azure-25)] transition-colors hover:bg-white/60 hover:text-[var(--azure-12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)]"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-2 h-px bg-[var(--azure-25)]/15" />

              <div className="flex flex-col gap-2 px-1 pt-1">
                {utility.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-[10px] px-4 py-3 text-base font-medium text-[var(--azure-25)] transition-colors hover:bg-white/60 hover:text-[var(--azure-12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)]"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-1">{authSlot}</div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
