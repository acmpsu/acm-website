"use client";

import Image from "next/image";
import { useState } from "react";

type NewsItem = {
  title: string;
  description: string;
  date: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    title: "ACM Relaunch Planning",
    description:
      "We are rebuilding ACM at Penn State with a fresh structure focused on technical growth and student collaboration.",
    date: "Spring 2026",
  },
  {
    title: "Community Channels Open",
    description:
      "Discord and GroupMe are active for updates, planning discussions, and connecting with new members.",
    date: "Spring 2026",
  },
  {
    title: "Workshop Tracks In Progress",
    description:
      "Upcoming content includes web development, AI, data science, and competitive programming fundamentals.",
    date: "Upcoming",
  },
  {
    title: "Community Building",
    description:
      "We are creating more ways for students to connect with peers, alumni, and future collaborators.",
    date: "Upcoming",
  },
];

export function News() {
  const [activeIndex, setActiveIndex] = useState(0);

  function goPrev() {
    setActiveIndex((i) => (i === 0 ? NEWS_ITEMS.length - 1 : i - 1));
  }
  function goNext() {
    setActiveIndex((i) => (i === NEWS_ITEMS.length - 1 ? 0 : i + 1));
  }

  const item = NEWS_ITEMS[activeIndex];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-alt)] px-8 py-[72px]" id="news">
      <div className="mx-auto max-w-[1160px]">

        {/* Top row */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
              Latest
            </p>
            <h2 className="text-[clamp(22px,2.5vw,30px)] font-extrabold tracking-[-0.025em] text-[var(--navy-dk)]">
              News &amp; Updates
            </h2>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[var(--border)] bg-white text-[14px] text-[var(--slate)] transition hover:border-[#b0bdd4] hover:text-[var(--navy-dk)]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[var(--border)] bg-white text-[14px] text-[var(--slate)] transition hover:border-[#b0bdd4] hover:text-[var(--navy-dk)]"
            >
              →
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="grid overflow-hidden rounded-[10px] border border-[var(--border)] bg-white md:grid-cols-[320px_1fr]">
          {/* Image */}
          <div className="relative min-h-[240px] flex-col items-center justify-center gap-2 border-b border-[var(--border)] bg-[#f1f4f8] p-0 md:border-b-0 md:border-r">
            <Image
              src="/nvidiags.jpeg"
              alt="NVIDIA GPU"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col justify-center gap-2.5 px-9 py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--navy)]">
              {item.date}
            </p>
            <h3 className="text-[20px] font-extrabold leading-[1.25] tracking-[-0.02em] text-[var(--navy-dk)]">
              {item.title}
            </h3>
            <p className="text-[14px] leading-[1.72] text-[var(--slate)]">
              {item.description}
            </p>
            <a
              href="#"
              className="mt-1 inline-flex w-fit items-center gap-1 text-[12px] font-bold text-[var(--navy)] no-underline"
            >
              Read more →
            </a>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-4 flex gap-1.5">
          {NEWS_ITEMS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`News item ${i + 1}`}
              className={`h-1 rounded-full border-none transition-all ${
                i === activeIndex
                  ? "w-6 bg-[var(--navy)]"
                  : "w-1 bg-[#d1d9e8] hover:bg-[#b0bdd4]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
