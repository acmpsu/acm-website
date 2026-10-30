"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { AccountMenu } from "@/components/ui/account-menu";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import {
  COMMITTEES,
  MEET_US_LINK,
  PRIMARY_NAV,
  SPONSOR_US_LINK,
  type NavLink,
} from "@/lib/constants";
import { CommitteesMenu } from "./CommitteesMenu";
import styles from "./site.module.css";

export type NavAccount = { email: string; fullName: string | null };

/** The id of the home section whose anchor was passed most recently while scrolling. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ids = PRIMARY_NAV.filter((link) => link.href.startsWith("/#")).map(
      (link) => link.href.slice(2),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.4;
      let next: string | null = null;
      for (const id of ids) {
        const anchor = document.getElementById(id);
        if (
          anchor &&
          anchor.getBoundingClientRect().top + window.scrollY <= line
        )
          next = id;
      }
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);
  return enabled ? active : null;
}

/** Floating glass navigation. Full layout from 1280px; below that, a menu button opens a sheet. */
export function SiteNav({ account }: { account: NavAccount | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Exact page links are the current page; on the home page, the section in view is the
  // current location (scroll spy), shown as an underline in the glass pill.
  const activeSection = useActiveSection(pathname === "/");
  const current = (href: string): "page" | "location" | undefined => {
    if (href.startsWith("/#"))
      return pathname === "/" && href.slice(2) === activeSection
        ? "location"
        : undefined;
    return href === pathname ? "page" : undefined;
  };

  const closeMenu = (restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return;
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const account_ = account ? (
    <AccountMenu email={account.email} fullName={account.fullName} />
  ) : (
    <Button variant="pill" href="/login" aria-current={current("/login")}>
      Login
    </Button>
  );

  const sheetLinks = (title: string, links: NavLink[], twoColumns = false) => (
    <div className={styles.sheetGroup}>
      <p className={styles.sheetTitle}>{title}</p>
      <ul className={twoColumns ? styles.sheetGrid : styles.sheetList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current(link.href)}
              className={styles.sheetLink}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Penn State ACM home"
        >
          <Image
            src="/logos/acm.png"
            alt=""
            width={80}
            height={80}
            priority
            sizes="80px"
          />
        </Link>

        <nav aria-label="Primary" className={styles.primary}>
          <ul className={styles.glass}>
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Button
                  variant="ghost"
                  href={link.href}
                  aria-current={current(link.href)}
                  className={styles.glassLink}
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.utility}>
          <Button
            variant="pill"
            href={MEET_US_LINK.href}
            aria-current={current(MEET_US_LINK.href)}
          >
            {MEET_US_LINK.label}
          </Button>
          <CommitteesMenu />
          <Button
            variant="pill"
            href={SPONSOR_US_LINK.href}
            aria-current={current(SPONSOR_US_LINK.href)}
          >
            {SPONSOR_US_LINK.label}
          </Button>
          <span className={styles.loginGap} aria-hidden="true" />
          {account_}
        </div>

        <div className={styles.compact}>
          {account_}
          <IconButton
            ref={toggleRef}
            label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            icon={
              menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )
            }
          />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              className={styles.scrim}
              aria-hidden="true"
              onClick={() => closeMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              ref={sheetRef}
              id="site-menu"
              className={styles.sheet}
              // Any link click navigates (or scrolls to an anchor), so close the sheet.
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a"))
                  closeMenu(false);
              }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <nav aria-label="Site">
                {sheetLinks(
                  "Explore",
                  [...PRIMARY_NAV, MEET_US_LINK, SPONSOR_US_LINK],
                  true,
                )}
                {sheetLinks(
                  "Committees",
                  COMMITTEES.map((c) => ({
                    label: c.shortName,
                    href: `/committees#${c.id}`,
                  })),
                  true,
                )}
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
