import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./ds.module.css";

/**
 * Figma "Label Components" (50:277) and nav/footer link states (50:317):
 * - primary: denim, hovers to pale with a lift
 * - secondary: pale blue, hovers to white with a lift
 * - pill: nav pill (pale blue, fully rounded), hovers to white
 * - ghost: transparent pill for links on glass or light surfaces, hovers to white
 * - onDark: transparent pill for dark surfaces (footer), hovers to white
 */
export type ButtonVariant =
  "primary" | "secondary" | "pill" | "ghost" | "onDark";

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};
type AsLink = {
  href: string;
  external?: boolean;
  "aria-current"?: "page" | "location";
};
type AsButton = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
> & { href?: undefined };

export function buttonClass(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

/** A link styled as a button when given `href`, otherwise a native `<button>`. */
export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: Common & (AsLink | AsButton)) {
  const classes = buttonClass(variant, className);

  if (props.href !== undefined) {
    const { href, external, "aria-current": current } = props as AsLink;
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} aria-current={current}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as AsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
