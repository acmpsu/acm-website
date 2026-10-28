import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** `default` ≈ 1180px content width, `wide` ≈ 1440px. */
  width?: "default" | "wide" | "full";
  className?: string;
  as?: ElementType;
};

type PolymorphicTag = ElementType<{ className?: string; children?: ReactNode }>;

const WIDTHS: Record<NonNullable<ContainerProps["width"]>, string> = {
  default: "max-w-[var(--container-max)]",
  wide: "max-w-[var(--container-wide)]",
  full: "max-w-none",
};

/**
 * Horizontal page container with the shared max width and responsive gutters.
 * Gutters scale down on small screens to avoid horizontal overflow at 320px.
 */
export function Container({ children, width = "default", className = "", as = "div" }: ContainerProps) {
  const Tag = as as PolymorphicTag;
  return (
    <Tag className={`mx-auto w-full px-5 sm:px-8 ${WIDTHS[width]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
