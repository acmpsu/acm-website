import Image from "next/image";
import Link from "next/link";
import { COMMITTEES } from "@/lib/constants";

export function Committees() {
  return (
    <section className="border-b border-[var(--border)] px-8 py-[72px]" id="committees">
      <div className="mx-auto max-w-[1160px]">

        {/* Section header */}
        <div className="mb-9">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Get Involved
          </p>
          <h2 className="text-[clamp(22px,2.5vw,30px)] font-extrabold tracking-[-0.025em] text-[var(--navy-dk)]">
            Our Committees
          </h2>
          <p className="mt-2 text-[15px] leading-[1.65] text-[var(--slate)]">
            Six specialized tracks across AI, data, competitive programming, and more
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-3 gap-12 md:gap-8">
          {COMMITTEES.map((committee, index) => (
            <Link
              key={committee.id}
              href={`/committees#${committee.id}`}
              className="committee-item flex flex-col items-center justify-center gap-3 text-center no-underline"
            >
              <div className="committee-3d-wrap relative h-20 w-20">
                <div
                  className={`committee-spin-3d ${index % 2 === 0 ? "committee-spin-3d-forward" : "committee-spin-3d-backward"}`}
                >
                  <div className="committee-face committee-face-front">
                    <Image
                      src={committee.logo}
                      alt={committee.shortName}
                      fill
                      sizes="80px"
                      className="committee-logo-img object-contain"
                    />
                  </div>
                  <div className="committee-face committee-face-back" aria-hidden="true">
                    <Image
                      src={committee.logo}
                      alt=""
                      fill
                      sizes="80px"
                      className="committee-logo-img object-contain"
                    />
                  </div>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[var(--navy-dk)]">
                {committee.shortName}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
