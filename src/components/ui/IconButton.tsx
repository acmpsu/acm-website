import type { ComponentPropsWithRef, ReactNode } from "react";

import styles from "./ds.module.css";

type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  /** Accessible name; icon-only buttons must have one. */
  label: string;
  icon: ReactNode;
  tone?: "light" | "dark";
};

/** 44 × 44 round button for icon-only actions (menu, close, social). */
export function IconButton({
  label,
  icon,
  tone = "light",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={[styles.iconButton, styles[tone], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon}
    </button>
  );
}

/** The same round 44 × 44 look for icon-only links (e.g. social profiles). */
export function iconButtonClass(
  tone: "light" | "dark" = "light",
  className?: string,
) {
  return [styles.iconButton, styles[tone], className].filter(Boolean).join(" ");
}
