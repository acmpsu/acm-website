import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Accessible label — required, since the button has no visible text. */
  label: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  size?: "sm" | "md";
};

const SIZES = {
  sm: "size-9",
  md: "size-11",
};

const VARIANTS = {
  solid: "pill-surface hover:bg-white hover:shadow-[var(--shadow-pill)]",
  ghost: "bg-transparent text-[var(--azure-12)] hover:bg-[var(--surface-pill)]",
};

/** Square/round icon-only button with a mandatory aria-label and focus ring. */
export function IconButton({
  label,
  children,
  variant = "ghost",
  size = "md",
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-[var(--radius-pill)] transition-[background,color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2 ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
