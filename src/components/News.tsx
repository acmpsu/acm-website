"use client";

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

  function goPrevious() {
    setActiveIndex((current) => (current === 0 ? NEWS_ITEMS.length - 1 : current - 1));
  }

  function goNext() {
    setActiveIndex((current) => (current === NEWS_ITEMS.length - 1 ? 0 : current + 1));
  }

  const activeItem = NEWS_ITEMS[activeIndex];

  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-50 py-16 px-6" id="events">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-black">News</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              className="h-9 w-9 rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 hover:shadow-sm"
              aria-label="Previous news"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              className="h-9 w-9 rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 hover:shadow-sm"
              aria-label="Next news"
            >
              →
            </button>
          </div>
        </div>

        <article className="rounded border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="overflow-hidden rounded border border-gray-200 bg-gray-100">
              <div className="aspect-[16/9] flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 text-xs font-medium text-gray-500">
                News Photo Placeholder
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{activeItem.date}</p>
              <h3 className="text-xl font-semibold text-gray-900">{activeItem.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{activeItem.description}</p>
            </div>
          </div>
        </article>

        <div className="mt-4 flex items-center gap-2">
          {NEWS_ITEMS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-8 bg-gray-700" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
              aria-label={`Show news item ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
