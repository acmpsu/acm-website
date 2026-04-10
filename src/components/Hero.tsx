import { HERO_TITLE, HERO_DESCRIPTION } from "@/lib/constants";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid gap-8 items-center lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold mb-4 leading-tight text-black">{HERO_TITLE}</h1>
          <p className="text-black text-lg mb-6 leading-relaxed">{HERO_DESCRIPTION}</p>
          <div className="flex gap-3">
            <Link
              href="/about"
              className="inline-flex h-9 items-center rounded-full bg-blue-900 px-5 text-sm font-semibold text-white transition hover:bg-blue-950"
            >
              Learn More
            </Link>
            <Link
              href="/events"
              className="inline-flex h-9 items-center rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              See What&apos;s Next
            </Link>
          </div>
        </div>
        <div className="h-80 rounded border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200 p-5"></div>
      </div>
    </section>
  );
}
