import Image from "next/image";

import { COMMITTEES } from "@/lib/constants";

export function Committees() {
  return (
    <section className="bg-white px-6 py-12" id="committees">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Committees
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-5">
          {COMMITTEES.map((committee) => (
            <div
              key={committee.name}
              className="flex flex-col items-center justify-center gap-1.5 px-1 py-1 text-center"
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
              <span className="text-sm font-medium tracking-wide text-slate-700 sm:text-[0.95rem]">
                {committee.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
