import type { ReactNode } from "react";

type PageHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

/**
 * Common page-level heading block (e.g. the "Meet Us" / "The people behind ACM"
 * intro in the Figma). Larger than a SectionHeader; use once per page, up top.
 */
export function PageHeading({ eyebrow, title, description, className = "" }: PageHeadingProps) {
  return (
    <header className={`flex flex-col gap-4 ${className}`.trim()}>
      {eyebrow ? (
        <span className="font-[family-name:var(--font-red-hat-mono)] text-sm font-medium uppercase tracking-[0.18em] text-[var(--azure-36)]">
          {eyebrow}
        </span>
      ) : null}
      <h1 className="font-[family-name:var(--font-red-hat)] text-balance text-4xl font-bold leading-[1.05] text-[var(--azure-12)] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--azure-25)]">{description}</p>
      ) : null}
    </header>
  );
}
