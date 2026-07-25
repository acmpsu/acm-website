import Image from "next/image";
import Link from "next/link";
import { HERO_TITLE, HERO_DESCRIPTION } from "@/lib/constants";

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

        {/* Right — image */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#f1f4f8] aspect-[4/3] relative">
          <Image src="/team.png" alt="Team" fill className="object-cover" />
        </div>

      </div>
    </section>
  );
}
