import Image from "next/image";

import { COMMITTEES } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import { SectionAccent3D } from "@/components/SectionAccent3D";

export function Committees() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-14" id="committees">
      <div className="absolute -right-12 top-2 h-36 w-56 opacity-35 sm:h-44 sm:w-64">
        <SectionAccent3D variant="committees" />
      </div>
      <Reveal>
        <div className="relative mx-auto max-w-6xl p-2 sm:p-0">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Committees
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COMMITTEES.map((committee) => (
              <div
                key={committee.name}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 text-center"
              >
                <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                  <Image
                    src={committee.logo}
                    alt={committee.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-semibold tracking-wide text-slate-700 sm:text-[0.95rem]">
                  {committee.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
