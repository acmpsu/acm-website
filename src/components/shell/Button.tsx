import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-[family-name:var(--font-red-hat)] font-medium " +
  "rounded-[var(--radius-pill)] transition-[background,color,box-shadow,transform] duration-[var(--dur-base)] " +
  "ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  // Deep navy fill — the main call to action.
  primary:
    "bg-[var(--azure-12)] text-white shadow-[var(--shadow-card)] hover:bg-[var(--azure-16)] active:translate-y-px",
  // Light Link Water pill — the Figma utility-nav style.
  secondary:
    "pill-surface hover:bg-white hover:shadow-[var(--shadow-pill)] active:translate-y-px",
  // Transparent, for low-emphasis actions.
  ghost:
    "bg-transparent text-[var(--azure-12)] hover:bg-[var(--surface-pill)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-[55px] px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Shared primary / secondary / ghost button, rendered as a button or a link. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    const isExternal = external ?? /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
