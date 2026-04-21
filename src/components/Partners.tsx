export function Partners() {
  const sponsors = ["Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4", "Sponsor 5", "Sponsor 6"];

  return (
    <section className="border-b border-[var(--border)] px-8 py-9">
      <div className="mx-auto max-w-[1160px]">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--slate-lt)]">
          Sponsors
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {sponsors.map((s) => (
            <div
              key={s}
              className="flex h-12 min-w-[110px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 text-[11px] font-semibold text-[var(--slate-lt)]"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
