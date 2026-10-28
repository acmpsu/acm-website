import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** Background treatment matching the Figma sections. */
  tone?: "default" | "muted" | "dark";
  /** Vertical rhythm. `none` lets the caller control padding. */
  spacing?: "default" | "tight" | "none";
  width?: "default" | "wide" | "full";
  className?: string;
  /** When true the Container wrapper is omitted (for full-bleed section content). */
  bleed?: boolean;
};

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-transparent text-[var(--foreground)]",
  muted: "bg-[var(--link-water)] text-[var(--foreground)]",
  dark: "bg-[var(--azure-12)] text-white",
};

const SPACING: Record<NonNullable<SectionProps["spacing"]>, string> = {
  default: "py-[var(--section-y)]",
  tight: "py-10 sm:py-14",
  none: "",
};

/**
 * Standard page section wrapper: handles vertical rhythm, background tone, and
 * (optionally) the inner Container so individual pages stop hardcoding spacing.
 */
export function Section({
  children,
  id,
  tone = "default",
  spacing = "default",
  width = "default",
  className = "",
  bleed = false,
}: SectionProps) {
  return (
    <section id={id} className={`${TONES[tone]} ${SPACING[spacing]} ${className}`.trim()}>
      {bleed ? children : <Container width={width}>{children}</Container>}
    </section>
  );
}
