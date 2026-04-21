"use client";

import Image from "next/image";
import { CountdownTimer } from "@/components/icpc/CountdownTimer";

export default function ICPCPage() {
  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl md:text-6xl">ICPC</h1>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">About</p>
          <p className="mt-2 max-w-xl text-lg leading-relaxed text-slate-700">
            Compete with the best student programmers in the world.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_45px_-30px_rgba(15,23,42,0.35)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/logos/icpc.png"
              alt="ICPC team photo"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Countdown</p>
        <p className="text-gray-400 text-sm">ICPC Mid-Atlantic Regional 2026 - November 7, 2026</p>
        <CountdownTimer />
      </section>

      {/* Stats Section */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Stats</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">[X] Teams</p>
            <p className="text-sm text-gray-600">Competed</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">[X] Years</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">[X] Placements</p>
            <p className="text-sm text-gray-600">Regional</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">[X] Students</p>
            <p className="text-sm text-gray-600">Participated</p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">What is ICPC</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          ICPC offers students the chance to collaborate with peers from universities worldwide, sharpening
          their problem-solving, programming, and teamwork abilities. The contest serves as a platform for
          industry and academia to celebrate the next generation of computing professionals as they strive for
          excellence.
        </p>
      </section>

      {/* How to Join */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">How to Join</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          Join our ICPC team to compete at the regional level and potentially advance to the world finals.
        </p>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Eligibility</p>
          <ul className="mt-2 space-y-1 text-gray-600 list-disc pl-5">
            <li>Current Penn State student</li>
            <li>Interest in competitive programming</li>
            <li>Basic programming knowledge</li>
          </ul>
        </div>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Next Steps</p>
          <ol className="mt-2 space-y-1 text-gray-600 list-decimal pl-5">
            <li>Attend tryouts and practice sessions</li>
            <li>Participate in training workshops</li>
            <li>Join the team for regional competition</li>
          </ol>
        </div>
        <div className="mt-6">
          <a
            href="#"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Join ICPC Interest List
          </a>
        </div>
      </section>
    </div>
  );
}
