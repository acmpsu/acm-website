import type { ElementType, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** `glass` matches the Figma translucent surfaces; `solid` is an opaque panel. */
  tone?: "solid" | "muted" | "glass";
  /** Adds the hover lift (shadow + translate) used by interactive cards. */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  as?: ElementType;
};

type PolymorphicTag = ElementType<{ className?: string; children?: ReactNode }>;

const TONES: Record<NonNullable<CardProps["tone"]>, string> = {
  solid: "bg-white border border-[var(--catskill)] shadow-[var(--shadow-card)]",
  muted: "bg-[var(--link-water)] border border-transparent",
  glass:
    "nav-glass", // translucent Link Water + blur + white hairline
};

const PADDING: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Reusable card shell — the base surface for content cards across the site.
 * Use `interactive` for hoverable cards (committees, events, etc.).
 */
export function Card({
  children,
  tone = "solid",
  interactive = false,
  padding = "md",
  className = "",
  as = "div",
}: CardProps) {
  const Tag = as as PolymorphicTag;
  const hover = interactive
    ? "transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
    : "";
  return (
    <Tag
      className={`rounded-[var(--radius-md)] ${TONES[tone]} ${PADDING[padding]} ${hover} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
