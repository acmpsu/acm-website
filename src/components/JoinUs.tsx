import { CONTACT_LINKS } from "@/lib/constants";

const discordHref = CONTACT_LINKS.find((link) => link.label === "Discord")!.href;
const groupMeHref = CONTACT_LINKS.find((link) => link.label === "GroupMe")!.href;

export function JoinUs() {
  return (
    <section className="border-b border-[var(--border)] px-8 py-[80px]" id="join">
      <div className="mx-auto flex max-w-[1160px] justify-center">
        <div className="max-w-[560px] text-center">
          <h2 className="mb-3.5 text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[var(--navy-dk)]">
            Join Us
          </h2>
          <p className="mb-7 text-[15px] leading-[1.75] text-[var(--slate)]">
            Meet builders, sharpen your technical skills, and contribute to projects that matter with one of the largest tech communities on campus
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <a
              href={discordHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[var(--navy)] px-[22px] py-[10px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
            >
              Join Discord
            </a>
            <a
              href={groupMeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[var(--border)] bg-white px-[22px] py-[10px] text-[13px] font-semibold text-[var(--navy-dk)] transition hover:border-[#b0bdd4] hover:bg-[var(--bg-alt)]"
            >
              Join GroupMe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
