import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  linkedin: string;
  github?: string;
  image?: string;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="6.3" r="1.7" />
      <line x1="5" y1="10" x2="5" y2="19" />
      <line x1="9" y1="10" x2="9" y2="19" />
      <path d="M9 13.2c0-1.9 1.5-3.4 3.4-3.4S16 11.3 16 13.2V19" />
      <line x1="16" y1="14.2" x2="16" y2="19" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Khai Ta",
    role: "Dev Team Director",
    linkedin: "https://www.linkedin.com/in/khai-ta-6b4951316/",
    github: "https://github.com/khai-ta",
    image: "/resources/dev-team/khai.png",
  },
  {
    name: "Kyle Chiem",
    role: "Dev Team Officer",
    linkedin: "https://www.linkedin.com/in/kyle-chiem/",
    github: "https://github.com/CruidGals",
    image: "/resources/dev-team/kyle.png",
  },
  {
    name: "Prakhar Singh",
    role: "Dev Team Officer",
    linkedin: "https://www.linkedin.com/in/prakhar-singh-a390581a8/",
    github: "https://github.com/Prakhar6",
    image: "/resources/dev-team/prakhar.png",
  },
  {
    name: "Leo Lu",
    role: "Dev Team Officer",
    linkedin: "https://www.linkedin.com/in/leohaozhelu/",
    github: "https://github.com/Nasd00",
    image: "/resources/dev-team/leo.png",
  },
  {
    name: "Nikhil Kotikalapudi",
    role: "Dev Team Officer",
    linkedin: "https://www.linkedin.com/in/nikhil-kotikalapudi/",
    github: "https://github.com/23silicon",
    image: "/resources/dev-team/nikhil.png",
  },
];

export default function DevTeamPage() {
  const executiveMembers = TEAM_MEMBERS.filter((member) => member.role.includes("Director"));
  const coreMembers = TEAM_MEMBERS.filter((member) => !member.role.includes("Director"));

  const renderMemberCard = (member: TeamMember) => (
    <div className="text-center">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[var(--bg-alt)]">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name} profile`}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[var(--slate-lt)]">No photo</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-[14px] font-semibold text-[var(--navy-dk)]">{member.name}</h3>
      <p className="mt-1 text-[12px] text-[var(--slate)]">{member.role}</p>
      <div className="mt-2 flex justify-center gap-2.5">
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--slate)] transition hover:text-[var(--navy-dk)]"
          aria-label="LinkedIn"
        >
          <LinkedInIcon className="h-4 w-4" />
        </a>
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--slate)] transition hover:text-[var(--navy-dk)]"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
        {/* Header */}
        <section className="mb-12">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Dev Team
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Our Team
          </p>
          <p className="mt-2 max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            Meet the developers building the ACM website and digital infrastructure
          </p>
        </section>

        {/* Team Photo */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[#f1f4f8] aspect-[16/9] flex items-center justify-center">
            <Image
              src="/resources/dev-team/devteam.png"
              alt="Dev Team group photo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Team Members Layout */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-end">
          {/* Directors - Center/Middle */}
          {executiveMembers.length > 0 && (
            <section className="flex-1">
              <h2 className="mb-6 text-[18px] font-semibold text-[var(--navy-dk)]">Director</h2>
              <div className="grid gap-6">
                {executiveMembers.map((member) => (
                  <div key={member.name}>{renderMemberCard(member)}</div>
                ))}
              </div>
            </section>
          )}

          {/* Officers - Right */}
          {coreMembers.length > 0 && (
            <section className="flex-1">
              <h2 className="mb-6 text-[18px] font-semibold text-[var(--navy-dk)]">Officers</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {coreMembers.map((member) => (
                  <div key={member.name}>{renderMemberCard(member)}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
