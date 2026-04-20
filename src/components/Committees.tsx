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
          <div className="mt-8 flex w-full flex-nowrap items-start justify-center gap-1 sm:gap-2 md:gap-3">
            {COMMITTEES.map((committee, index) => (
              <div
                key={committee.name}
                className="committee-item flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1.5 px-0.5 py-2 text-center sm:gap-2 sm:px-1"
              >
                <div className="committee-3d-wrap relative mx-auto h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16">
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
                <span className="text-xs font-semibold tracking-wide text-slate-700 sm:text-sm md:text-[0.95rem]">
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
