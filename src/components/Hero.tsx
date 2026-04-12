import { HERO_TITLE, HERO_DESCRIPTION } from "@/lib/constants";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { ThreeHeroScene } from "@/components/ThreeHeroScene";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-12 pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl md:text-6xl">
              {HERO_TITLE}
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-700">{HERO_DESCRIPTION}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex h-11 items-center rounded-full bg-blue-900 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-950"
              >
                Learn More
              </Link>
              <Link
                href="/events"
                className="inline-flex h-11 items-center rounded-full border border-blue-200 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
              >
                See What&apos;s Next
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.14} className="relative z-10">
          <div className="relative h-[24rem] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-2 shadow-[0_24px_45px_-30px_rgba(15,23,42,0.6)]">
            <ThreeHeroScene />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
