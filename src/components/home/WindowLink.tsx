"use client";

import { useState, type ComponentProps, type MouseEvent } from "react";

/** How long the shade takes to lift (matches the .shade transition in home.module.css). */
const LIFT_MS = 600;

/**
 * A contact window link. Touch screens can't hover, so a tap lifts the shade first and
 * opens the link once it's up; mouse, keyboard and reduced-motion users go straight there.
 */
export function WindowLink({
  href,
  ...props
}: ComponentProps<"a"> & { href: string }) {
  const [open, setOpen] = useState(false);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!touch || reduce || event.metaKey || event.ctrlKey) return;

    event.preventDefault();
    if (open) return;
    setOpen(true);
    window.setTimeout(() => {
      // Fall back to this tab if the browser blocks the delayed new tab. ("noopener" would
      // make window.open return null, so the opener is cut by hand instead.)
      const tab = window.open(href, "_blank");
      if (tab) tab.opener = null;
      else window.location.href = href;
      setOpen(false);
    }, LIFT_MS);
  };

  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-open={open || undefined}
      onClick={onClick}
    />
  );
}
