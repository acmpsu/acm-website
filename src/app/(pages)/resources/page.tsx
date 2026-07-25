import Image from "next/image";

import { CONTACT_LINKS } from "@/lib/constants";
import {
  DiscordIcon,
  GroupMeIcon,
  InstagramIcon,
  LinkedinIcon,
  OrgPageIcon,
} from "@/components/ui/brand-icons";

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Discord: DiscordIcon,
  GroupMe: GroupMeIcon,
  "Org Page": OrgPageIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type TeamMember = {
  name: string;
  role: string;
};

type Organization = {
  name: string;
  logo: string;
};

const EBOARD: TeamMember[] = [
  { name: "David Youm", role: "President" },
  { name: "Coen McFerson", role: "Vice President" },
  { name: "Rishi Raj", role: "Secretary" },
  { name: "Ayan Ospan", role: "Treasurer" },
  { name: "Cia Sherpa", role: "Publicity" },
  { name: "Bansari Patel", role: "Relations" },
];

const DIRECTORS: TeamMember[] = [
  { name: "Khai Ta", role: "Dev Team Director" },
  { name: "Ben Nguyen", role: "Quantum Director" },
  { name: "Nikita Kiselov", role: "ICPC Director" },
  { name: "Mohammad Yafi Akhtar", role: "Web Director" },
  { name: "Sri Nikhil Bandi", role: "AI Director" },
  { name: "Aryaman Ajmera", role: "Data Director" },
  { name: "Younsoo Park", role: "Design Director" },
  { name: "Ethan Elemento", role: "Hack Director" },
];

const SPONSORS: Organization[] = [
  { name: "Boeing", logo: "/sponsors/1.jpg" },
  { name: "Capital One", logo: "/sponsors/cap1.jpg" },
  { name: "Lockheed Martin", logo: "/sponsors/Lockheed.webp" },
  { name: "Nittany AI Advance", logo: "/sponsors/nittanyai.jpg" },
  { name: "Textron", logo: "/sponsors/textron.png" },
  { name: "Penn State College of Engineering", logo: "/sponsors/EECS-header-mobile.png" },
  { name: "ArcelorMittal", logo: "/sponsors/arcelor_mittal.png" },
  { name: "Kattis", logo: "/sponsors/kattis.png" },
  { name: "MathWorks", logo: "/sponsors/MathWorks-Logo-square-e1661708582572.jpg" },
  { name: "Optum", logo: "/sponsors/optum.png" },
  { name: "Rockwell Automation", logo: "/sponsors/rockwell.png" },
];

const PARTNERS: Organization[] = [
  { name: "AWS Cloud Club at Penn State", logo: "/partners/awspsu.jpg" },
  { name: "Girls Who Code at Penn State", logo: "/partners/gwcpsu.jpeg" },
  { name: "Nittany AI", logo: "/partners/nittanyai.jpeg" },
  { name: "QSS", logo: "/partners/qss.png" },
  { name: "SASE at Penn State", logo: "/partners/sasepsu.png" },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-lg font-semibold text-[var(--navy-dk)]">
        {getInitials(member.name)}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--navy)]">{member.role}</p>
      <h3 className="mt-1 text-[14px] font-semibold text-[var(--navy-dk)]">{member.name}</h3>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px] space-y-16">
        <section>
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Resources
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Get to know us
          </p>
        </section>

        {/* Meet Us */}
        <section id="meet-us">
          <h2 className="mb-8 text-[18px] font-semibold text-[var(--navy-dk)]">Meet Us</h2>
          
          <div className="mb-12">
            <h3 className="mb-6 text-[14px] font-semibold text-[var(--navy-dk)]">Eboard</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {EBOARD.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[14px] font-semibold text-[var(--navy-dk)]">Directors</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DIRECTORS.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-2">
            Supporting Organizations
          </p>
          <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">Our Sponsors</h2>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)] mb-8">
            We partner with industry leaders to support ACM at Penn State and provide opportunities for our members
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SPONSORS.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center justify-center h-24">
                <div className="relative w-full h-full">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section id="partners">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-2">
            Campus Community
          </p>
          <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">Our Partners</h2>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)] mb-6">
            We collaborate with peer organizations across Penn State to strengthen our campus computing community
          </p>
          <div className="grid grid-cols-5 gap-3 sm:gap-6">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="flex items-center justify-center h-16 sm:h-24">
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="20vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">Contact Us</h2>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)] mb-6">
            Contact us for questions, partnership inquiries, or to get more involved
          </p>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {CONTACT_LINKS.map((link) => {
              const Icon = CONTACT_ICONS[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-5 text-center no-underline transition hover:border-[#b0bdd4] hover:bg-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-white text-[var(--navy)] transition group-hover:border-[#b0bdd4] group-hover:bg-[var(--navy)] group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="mt-3 block text-[13px] font-semibold text-[var(--navy-dk)] group-hover:text-[var(--navy)]">
                    {link.label}
                  </span>
                  <span className="mt-1.5 hidden text-[12px] leading-[1.55] text-[var(--slate)] sm:block">
                    {link.description}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
