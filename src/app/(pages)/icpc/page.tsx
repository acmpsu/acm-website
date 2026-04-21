"use client";

import { CountdownTimer } from "@/components/icpc/CountdownTimer";

export default function ICPCPage() {
  return (
    <div className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px] space-y-16">
        {/* Hero Section */}
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
              ICPC
            </h1>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
              About
            </p>
            <p className="mt-2 max-w-xl text-[15px] leading-[1.75] text-[var(--slate)]">
              Compete with the best student programmers in the world
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] aspect-[16/9]"></div>
        </section>

        {/* Countdown */}
        <section className="text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Countdown
          </p>
          <p className="text-[14px] text-[var(--slate)]">ICPC Mid-Atlantic Regional 2026 - November 7, 2026</p>
          <CountdownTimer />
        </section>

        {/* Stats Section */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-8">
            Stats
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--navy-dk)]">[X] Teams</p>
              <p className="text-[14px] text-[var(--slate)] mt-2">Competed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--navy-dk)]">[X] Years</p>
              <p className="text-[14px] text-[var(--slate)] mt-2">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--navy-dk)]">[X] Placements</p>
              <p className="text-[14px] text-[var(--slate)] mt-2">Regional</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--navy-dk)]">[X] Students</p>
              <p className="text-[14px] text-[var(--slate)] mt-2">Participated</p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-4">
            What is ICPC
          </p>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            ICPC offers students the chance to collaborate with peers from universities worldwide, sharpening
            their problem-solving, programming, and teamwork abilities. The contest serves as a platform for
            industry and academia to celebrate the next generation of computing professionals as they strive for
            excellence
          </p>
        </section>

        {/* How to Join */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-4">
            How to Join
          </p>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)] mb-6">
            Join our ICPC team to compete at the regional level and potentially advance to the world finals
          </p>
          
          <div className="max-w-3xl mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-3">
              Eligibility
            </p>
            <ul className="space-y-2 text-[15px] text-[var(--slate)] list-disc pl-5">
              <li>Current Penn State student</li>
              <li>Interest in competitive programming</li>
              <li>Basic programming knowledge</li>
            </ul>
          </div>

          <div className="max-w-3xl mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-3">
              Next Steps
            </p>
            <ol className="space-y-2 text-[15px] text-[var(--slate)] list-decimal pl-5">
              <li>Attend tryouts and practice sessions</li>
              <li>Participate in training workshops</li>
              <li>Join the team for regional competition</li>
            </ol>
          </div>

          <a
            href="#"
            className="inline-block rounded-md bg-[var(--navy)] px-[18px] py-[7px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
          >
            Join ICPC Interest List
          </a>
        </section>
      </div>
    </div>
  );
}
