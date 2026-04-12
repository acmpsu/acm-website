import { Reveal } from "@/components/ui/reveal";

export function JoinUs() {
  return (
    <section className="bg-white px-6 py-16 text-center" id="about">
      <Reveal>
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-12 sm:px-10">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Join Us</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Meet builders, sharpen your technical skills, and contribute to projects that matter with one of the largest tech communities on campus
          </p>
        </div>
      </Reveal>
    </section>
  );
}
