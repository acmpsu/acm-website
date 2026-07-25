import Image from "next/image";

import { COMMITTEES } from "@/lib/constants";

export default function CommitteesPage() {
  return (
    <div className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
        <section id="committees-intro" className="mb-16">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Committees
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Our Tracks
          </p>
          <p className="mt-2 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            ACM committees are how we organize learning and projects by interest. Our six committees each run
            events, workshops, and mentorship so you can go deep with peers who care about the same problems
          </p>
        </section>

        <section id="committee-list" className="space-y-12">
          {COMMITTEES.map((committee, index) => (
            <article
              key={committee.id}
              id={committee.id}
              className="committee-item grid gap-12 lg:grid-cols-[240px_1fr] lg:items-center"
            >
              <div className="flex justify-center lg:justify-start">
                <div className="committee-3d-wrap relative h-40 w-40">
                  <div
                    className={`committee-spin-3d ${index % 2 === 0 ? "committee-spin-3d-forward" : "committee-spin-3d-backward"}`}
                  >
                    <div className="committee-face committee-face-front">
                      <Image
                        src={committee.logo}
                        alt={`${committee.name} logo`}
                        fill
                        className="committee-logo-img object-contain"
                        sizes="160px"
                      />
                    </div>
                    <div className="committee-face committee-face-back" aria-hidden="true">
                      <Image
                        src={committee.logo}
                        alt=""
                        fill
                        className="committee-logo-img object-contain"
                        sizes="160px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1 text-center lg:text-left">
                <h2 className="text-[clamp(20px,2vw,28px)] font-extrabold tracking-[-0.02em] text-[var(--navy-dk)]">
                  {committee.name}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.75] text-[var(--slate)]">
                  {committee.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
