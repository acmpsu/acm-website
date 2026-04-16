"use client";

import { CountdownTimer } from "@/components/icpc/CountdownTimer";
import { SampleProblem } from "@/components/icpc/SampleProblem";

/* ═══════════ PAGE ═══════════ */
export default function ICPCPage() {
  return (
    <div className="icpc-page -mx-8 -mt-12 text-gray-900">
      {/* ── Soft animated background — white / light blue ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/60 to-white" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pb-24 space-y-28 pt-8">
        {/* ═══════════ HERO ═══════════ */}
        <section className="pt-12 sm:pt-20 text-center space-y-6">
          <p className="uppercase tracking-[0.3em] text-blue-400 text-xs font-semibold">
            Penn State ACM
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] shimmer-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto]">
            ICPC
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Compete with the best student programmers in the world.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a href="#join" className="glass-btn-primary">
              Join the ICPC Team
            </a>
            <a href="#resources" className="glass-btn">
              Practice Problems
            </a>
            <a href="#about" className="glass-btn">
              Learn More
            </a>
          </div>
        </section>

        {/* ═══════════ COUNTDOWN ═══════════ */}
        <section className="text-center space-y-4">
          <p className="uppercase tracking-[0.25em] text-xs font-semibold text-blue-500">
            ICPC Mid-Atlantic Regional 2026
          </p>
          <p className="text-gray-400 text-sm">November 7, 2026</p>
          <CountdownTimer />
        </section>

        {/* ═══════════ ABOUT THE ACM ICPC ═══════════ */}
        <section id="about" className="scroll-mt-24 space-y-6">
          <SectionLabel>About</SectionLabel>
          <h2 className="section-heading">About the ACM ICPC</h2>
          <div className="glass-card p-8 space-y-4 text-gray-600 leading-relaxed">
            <p>
              The International Collegiate Programming Contest (ICPC) is the world&apos;s most prestigious
              competitive programming competition, attracting talented problem solvers and coding
              enthusiasts from universities across the globe. It&apos;s not just a contest — it&apos;s an
              opportunity to sharpen your coding skills, tackle real-world problems, and compete on an
              international stage.
            </p>
          </div>

          {/* Key facts — floating */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: "👥", text: "Teams of 3, 1 computer" },
              { icon: "⏱", text: "5-hour contest" },
              { icon: "🧩", text: "Algorithmic problems" },
              { icon: "🌍", text: "Global competition" },
              { icon: "🏆", text: "→ World Finals" },
            ].map((f) => (
              <div
                key={f.text}
                className="glass-card float-card px-4 py-4 text-center space-y-1.5"
              >
                <span className="text-2xl">{f.icon}</span>
                <p className="text-xs text-gray-500 leading-snug">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Focus areas pills */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[
              "Graph Algorithms",
              "Dynamic Programming",
              "Greedy Optimization",
              "Geometry",
              "Data Structures",
              "Number Theory",
            ].map((t) => (
              <span key={t} className="glass-pill">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ═══════════ SELECTION PROCESS ═══════════ */}
        <section className="space-y-6">
          <SectionLabel>Selection</SectionLabel>
          <h2 className="section-heading">Selection Process</h2>
          <div className="glass-card p-8 text-gray-600 leading-relaxed">
            <p>
              Our ACM chapter at Penn State holds tryouts to identify and select top programming talent
              for the ICPC. These tryouts help us identify students with exceptional problem-solving
              abilities and coding proficiency. If you&apos;re selected, you&apos;ll join a team
              representing PSU at ICPC&apos;s regional competition, giving you the chance to showcase your
              skills among the best in the region.
            </p>
            <p className="mt-4 text-blue-600 font-medium text-sm">
              If you are selected, we will take care of:
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "Training & Coaching",
                body: "Expert coaching led by Professor Blanca and our dedicated team of graduate student coaches. With intensive practice sessions, you'll learn advanced techniques and collaborate with teammates to tackle challenging problems.",
                icon: "🎯",
              },
              {
                title: "Practice & Support",
                body: "Regular practice sessions to simulate competition scenarios and refine problem-solving strategies, helping each participant reach their full potential.",
                icon: "💻",
              },
              {
                title: "Travel & Expenses",
                body: "ACM at Penn State takes care of all travel arrangements, accommodation, and expenses associated with the trip — so you can focus on performing your best.",
                icon: "✈️",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="glass-card p-6 space-y-3"
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="text-gray-900 font-bold">{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ COMPETITION FORMAT ═══════════ */}
        <section className="space-y-6">
          <SectionLabel>Format</SectionLabel>
          <h2 className="section-heading">Competition Format</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Team Format",
                items: ["3 students", "1 computer", "Collaboration required"],
                accent: "from-blue-400/15 to-transparent",
              },
              {
                title: "Contest Length",
                items: ["5 hours", "Continuous solving", "Strategic time mgmt"],
                accent: "from-sky-400/15 to-transparent",
              },
              {
                title: "Scoring",
                items: ["Problems solved = rank", "Penalty for wrong subs", "Ties by penalty"],
                accent: "from-blue-300/15 to-transparent",
              },
              {
                title: "Advancement",
                items: ["Local qualifiers", "Regional contests", "→ World Finals"],
                accent: "from-indigo-400/15 to-transparent",
              },
            ].map((b) => (
              <div key={b.title} className={`glass-card p-5 bg-gradient-to-b ${b.accent}`}>
                <h3 className="text-gray-900 font-bold mb-3 text-sm">{b.title}</h3>
                <ul className="space-y-1.5">
                  {b.items.map((item) => (
                    <li key={item} className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TIMELINE ═══════════ */}
        <section className="space-y-6">
          <SectionLabel>Journey</SectionLabel>
          <h2 className="section-heading">Your ICPC Journey</h2>
          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200" />
            {[
              { step: "01", title: "Tryouts", desc: "Show your skills in our competitive tryout rounds", side: "left" },
              { step: "02", title: "Training", desc: "Intensive algorithm training & mock contests", side: "right" },
              { step: "03", title: "Regional", desc: "Compete at the ICPC Mid-Atlantic Regional", side: "left" },
              { step: "04", title: "World Finals", desc: "Top teams advance to the ICPC World Finals", side: "right" },
            ].map((s) => (
              <div
                key={s.step}
                className={`relative flex items-center py-6 ${
                  s.side === "right" ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-full sm:w-[calc(50%-2rem)] ${
                    s.side === "right" ? "sm:text-left sm:pl-12" : "sm:text-right sm:pr-12"
                  } pl-16 sm:pl-0`}
                >
                  <div className="glass-card p-5 inline-block text-left">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      Step {s.step}
                    </span>
                    <h4 className="text-gray-900 font-bold mt-1">{s.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                  </div>
                </div>
                {/* pulsing node */}
                <div className="timeline-node absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-300" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ SAMPLE PROBLEM ═══════════ */}
        <section className="space-y-6">
          <SectionLabel>Challenge</SectionLabel>
          <h2 className="section-heading">Try an ICPC-style Problem</h2>
          <p className="text-gray-500 -mt-2 max-w-2xl">
            Write your solution, run the tests, and see if you can pass all cases.
          </p>
          <SampleProblem />
        </section>

        {/* ═══════════ PRACTICE RESOURCES ═══════════ */}
        <section id="resources" className="scroll-mt-24 space-y-6">
          <SectionLabel>Resources</SectionLabel>
          <h2 className="section-heading">Practice Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Codeforces",
                url: "https://codeforces.com",
                desc: "Rated contests & problem archive",
              },
              {
                name: "LeetCode",
                url: "https://leetcode.com",
                desc: "Interview prep & weekly contests",
              },
              {
                name: "AtCoder",
                url: "https://atcoder.jp",
                desc: "High-quality algorithmic contests",
              },
              {
                name: "Kattis",
                url: "https://open.kattis.com",
                desc: "ICPC-style past regionals",
              },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 group"
              >
                <h3 className="text-gray-900 font-bold text-sm group-hover:text-blue-600 transition-colors">
                  {p.name} <span className="text-blue-400">↗</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1">{p.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ═══════════ READY TO JOIN / CTA ═══════════ */}
        <section id="join" className="scroll-mt-24 space-y-8">
          <div className="glass-card p-10 sm:p-14 text-center space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <h2 className="text-3xl sm:text-4xl font-extrabold shimmer-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto]">
              Ready to Join?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
              If you&apos;re passionate about coding and ready to compete, we&apos;d love to see you in
              our tryouts! This is an incredible opportunity to hone your skills, gain experience, and
              connect with like-minded peers — all while representing Penn State on an international
              level.
            </p>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              We are a computer science and engineering club, but we welcome everyone from IST, to EE,
              and math majors. Everyone is welcome no matter their level of experience.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href="#signup" className="glass-btn-primary">
                Join ICPC Interest List
              </a>
              <a href="#resources" className="glass-btn">
                Start Practicing
              </a>
            </div>
          </div>

          {/* Google Form embed */}
          <div id="signup" className="scroll-mt-24">
            <div className="glass-card p-1 overflow-hidden">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfHypGRpsMi-YB-kQlz5QW8Ktu5FhW7EWBxJP1IW-x2gRg3Ag/viewform?embedded=true"
                width="100%"
                height="800"
                className="w-full rounded-xl bg-white"
                title="ICPC Interest Form"
                loading="lazy"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </section>

        {/* ═══════════ SOCIALS ═══════════ */}
        <section className="text-center space-y-4 pb-8">
          <p className="text-gray-400 text-sm">
            Check out our Discord for meeting times and more info.
          </p>
          <div className="flex justify-center gap-4">
            {[
              { label: "Discord", href: "#" },
              { label: "Instagram", href: "#" },
              { label: "LinkedIn", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="glass-pill"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── tiny section label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase tracking-[0.3em] text-blue-400 text-[10px] font-semibold">
      {children}
    </p>
  );
}
