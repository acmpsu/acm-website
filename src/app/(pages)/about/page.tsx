export default function AboutPage() {
  return (
    <div className="border-b border-[var(--border)] px-8 py-[72px]">
      <div className="mx-auto max-w-[1160px] space-y-10">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-6 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
              About ACM @ Penn State
            </h1>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
              What Is ACM
            </p>
            <p className="mt-2 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
              The Association for Computing Machinery is the world&apos;s largest computing organization.
              At Penn State, ACM is a student community focused on technical excellence, inclusive
              collaboration, and real-world impact through workshops, projects, and competitions.
            </p>
            <p className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
              We help members build strong fundamentals, ship meaningful work, and grow professionally
              through a supportive network of peers, alumni, and industry connections.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#f1f4f8] aspect-[4/3] flex flex-col items-center justify-center gap-2.5">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <rect x="5" y="8" width="30" height="24" rx="2" />
              <line x1="5" y1="15" x2="35" y2="15" />
              <line x1="12" y1="8" x2="12" y2="15" />
              <line x1="28" y1="8" x2="28" y2="15" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--slate-lt)]">
              About Photo
            </span>
          </div>
        </section>

        <section>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            What Do We Do
          </p>
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--navy-dk)]">
            Our Focus
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            We run technical workshops, collaborative project tracks, and competition prep sessions
            that help students apply concepts beyond the classroom.
          </p>
          <ul className="mt-6 space-y-3 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">•</span>
              <span>Hands-on workshops in web, AI, data, and systems</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">•</span>
              <span>Project teams that ship real tools and products</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">•</span>
              <span>ICPC and competitive programming practice</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">•</span>
              <span>Career-focused events with alumni and industry partners</span>
            </li>
          </ul>
        </section>

        <section>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Get Started
          </p>
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--navy-dk)]">
            How Do I Get Involved
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            ACM at Penn State is being rebuilt right now. This is just prep for the future, so the
            best way to get involved is to stay connected and help shape what comes next.
          </p>
          <ol className="mt-6 space-y-3 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">1.</span>
              <span>Follow our official channels for updates and announcements</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--navy)]">2.</span>
              <span>Attend events, workshops, and project tracks</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
