"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionAccent3D } from "@/components/SectionAccent3D";

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

  function goPrevious() {
    setActiveIndex((current) => (current === 0 ? NEWS_ITEMS.length - 1 : current - 1));
  }

  function goNext() {
    setActiveIndex((current) => (current === NEWS_ITEMS.length - 1 ? 0 : current + 1));
  }

  const activeItem = NEWS_ITEMS[activeIndex];

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-16" id="events">
      <div className="absolute -left-10 top-2 h-36 w-52 opacity-30 sm:h-44 sm:w-60">
        <SectionAccent3D variant="events" />
      </div>
      <Reveal>
        <div className="relative mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">News</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevious}
                className="h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-700"
                aria-label="Previous news"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-700"
                aria-label="Next news"
              >
                →
              </button>
            </div>
          </div>

          <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  News Photo Placeholder
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{activeItem.date}</p>
                <h3 className="text-xl font-semibold text-slate-900">{activeItem.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{activeItem.description}</p>
              </div>
            </div>
          </article>

          <div className="mt-4 flex items-center gap-2">
            {NEWS_ITEMS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-8 bg-slate-800" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                aria-label={`Show news item ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
