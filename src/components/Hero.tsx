import Image from "next/image";
import Link from "next/link";
import { HERO_TITLE, HERO_DESCRIPTION, COMMITTEES } from "@/lib/constants";

export function Hero() {
  return (
    <section className="border-b border-[var(--border)] px-8 pb-[72px] pt-[80px]">
      <div className="mx-auto grid max-w-[1160px] items-center gap-20 lg:grid-cols-2">

        {/* Left — copy */}
        <div>
          <h1 className="mb-[18px] text-[clamp(32px,3.5vw,50px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            {HERO_TITLE}
          </h1>
          <p className="mb-8 max-w-[440px] text-[16px] leading-[1.75] text-[var(--slate)]">
            {HERO_DESCRIPTION}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/about"
              className="rounded-md bg-[var(--navy)] px-[22px] py-[10px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
            >
              Learn More
            </Link>
            <Link
              href="/events"
              className="rounded-md border border-[var(--border)] bg-white px-[22px] py-[10px] text-[13px] font-semibold text-[var(--navy-dk)] transition hover:border-[#b0bdd4] hover:bg-[var(--bg-alt)]"
            >
              See What&apos;s Next
            </Link>
          </div>
        </div>

        {/* Right — image placeholder */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#f1f4f8] aspect-[4/3] flex flex-col items-center justify-center gap-2.5">
          {/* Replace this div with your <Image> once you have the asset */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
            <rect x="3" y="3" width="30" height="30" rx="3" />
            <circle cx="12" cy="13" r="3.5" />
            <path d="M3 26l8-7 6 6 5-4 9 8" />
          </svg>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--slate-lt)]">
            Drop your image here
          </span>
        </div>

      </div>
    </section>
  );
}
