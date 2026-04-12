import Image from "next/image";

import { COMMITTEES } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";

export function Committees() {
  return (
    <section className="snap-section relative overflow-hidden bg-white px-6 py-14" id="committees">
      <Reveal>
        <div className="relative mx-auto max-w-6xl p-2 sm:p-0">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Committees
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COMMITTEES.map((committee, index) => (
              <div
                key={committee.name}
                className="committee-item flex flex-col items-center justify-center gap-2 px-3 py-2 text-center"
              >
                <div className="committee-3d-wrap relative h-14 w-14 sm:h-16 sm:w-16">
                  <div
                    className={`committee-spin-3d ${index % 2 === 0 ? "committee-spin-3d-forward" : "committee-spin-3d-backward"}`}
                  >
                    <div className="committee-face committee-face-front">
                      <Image
                        src={committee.logo}
                        alt={committee.name}
                        fill
                        sizes="64px"
                        className="committee-logo-img object-contain"
                      />
                    </div>
                    <div className="committee-face committee-face-back" aria-hidden="true">
                      <Image
                        src={committee.logo}
                        alt=""
                        fill
                        sizes="64px"
                        className="committee-logo-img object-contain"
                      />
                    </div>
                  </div>
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
