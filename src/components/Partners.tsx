import { Reveal } from "@/components/ui/reveal";

export function Partners() {
  const sponsorPlaceholders = [
    "Sponsor 1",
    "Sponsor 2",
    "Sponsor 3",
    "Sponsor 4",
    "Sponsor 5",
    "Sponsor 6",
  ];

  return (
    <section className="border-t border-slate-200 bg-white px-6 py-12" id="partners">
      <Reveal>
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Working with the best</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sponsorPlaceholders.map((sponsor) => (
              <div
                key={sponsor}
                className="flex h-20 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold tracking-wide text-slate-600 transition hover:border-slate-300"
              >
                {sponsor}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
