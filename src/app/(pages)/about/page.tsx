import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
        <section className="mb-12">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            About
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Who we are
          </p>
        </section>

        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="space-y-12">
            <section>
              <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">What is ACM</h2>
              <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
                ACM at Penn State is the largest computer science and engineering student organization on campus. We welcome all majors and experience levels to learn, build, and connect through workshops, projects, and events
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">What Do We Do</h2>
              <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
                We run nine committees focused on different areas of computing—from AI and data to web development and game design. Each committee meets regularly for workshops, collaborative projects, and skill-building sessions. We also host larger events like hackathons, guest speaker panels, and competitions to bring the community together
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">How Do I Get Involved</h2>
              <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
                Join any committee that interests you—no experience necessary. Attend events, follow along on Discord, and connect with peers who share your interests. We welcome all Penn State students, regardless of major or background
              </p>
            </section>
          </div>

          <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] aspect-[3/4]">
            <Image src="/resources/about/about-hero.png" alt="About Hero" width={1000} height={1000} />
          </div>
        </div>
      </div>
    </div>
  );
}
