import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** Small monospace eyebrow label above the title (Figma "01 / Eboard" style). */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** `light` for use on the dark navy sections. */
  tone?: "dark-text" | "light-text";
  className?: string;
};

/**
 * Reusable section header: optional mono eyebrow, display title, and lede.
 * Keeps heading typography/spacing consistent across every page section.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark-text",
  className = "",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  const titleColor = tone === "light-text" ? "text-white" : "text-[var(--azure-12)]";
  const descColor = tone === "light-text" ? "text-white/75" : "text-[var(--azure-25)]";
  const eyebrowColor = tone === "light-text" ? "text-[var(--azure-75)]" : "text-[var(--azure-36)]";

  return (
    <div className={`flex flex-col gap-3 ${alignment} ${className}`.trim()}>
      {eyebrow ? (
        <span
          className={`font-[family-name:var(--font-red-hat-mono)] text-xs font-medium uppercase tracking-[0.18em] ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`font-[family-name:var(--font-red-hat)] text-balance text-3xl font-bold leading-tight sm:text-4xl ${titleColor}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-base leading-relaxed ${descColor}`}>{description}</p>
      ) : null}
    </div>
  );
}
