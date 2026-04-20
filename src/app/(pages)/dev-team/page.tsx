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

  const renderMemberCard = (member: TeamMember, index: number) => {
    const tapeVariants = [
      {
        left: "-top-2 left-5 h-5 w-16 rotate-[-8deg] border-sky-200/70 bg-sky-100/70",
        right: "-top-2 right-6 h-5 w-14 rotate-[7deg] border-rose-200/70 bg-rose-100/70",
        confettiA: "left-3 top-16 h-2.5 w-2.5 rounded-full bg-sky-300/55",
        confettiB: "right-4 top-24 h-2 w-4 rotate-12 bg-rose-300/45",
      },
      {
        left: "-top-1 left-7 h-4 w-14 rotate-[6deg] border-fuchsia-200/70 bg-fuchsia-100/65",
        right: "-top-2 right-5 h-5 w-16 rotate-[-9deg] border-cyan-200/70 bg-cyan-100/70",
        confettiA: "left-4 top-20 h-2 w-5 -rotate-12 bg-cyan-300/45",
        confettiB: "right-5 top-14 h-2.5 w-2.5 rounded-full bg-fuchsia-300/55",
      },
      {
        left: "-top-2 left-6 h-5 w-15 rotate-[-4deg] border-blue-200/70 bg-blue-100/70",
        right: "-top-1 right-7 h-4 w-14 rotate-[11deg] border-pink-200/70 bg-pink-100/70",
        confettiA: "left-5 top-12 h-2.5 w-2.5 rounded-full bg-pink-300/55",
        confettiB: "right-3 top-22 h-2 w-4 rotate-[20deg] bg-blue-300/45",
      },
    ];
    const tapeVariant = tapeVariants[index % tapeVariants.length];

    return (
      <article
        key={`${member.name}-${index}`}
        className="paper-curl group relative isolate overflow-hidden border border-amber-200/90 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 shadow-[0_10px_20px_-12px_rgba(120,53,15,0.55)] transition duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_14px_24px_-12px_rgba(120,53,15,0.65)]"
        style={{ transform: index % 2 === 0 ? "rotate(-0.9deg)" : "rotate(0.9deg)" }}
      >
        <div
          className={`pointer-events-none absolute border shadow-sm ${tapeVariant.left}`}
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute border shadow-sm ${tapeVariant.right}`}
          aria-hidden="true"
        />
        <div className={`pointer-events-none absolute ${tapeVariant.confettiA}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute ${tapeVariant.confettiB}`} aria-hidden="true" />
      {member.image ? (
        <div className="p-3 pb-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-amber-50 bg-amber-100 shadow-[0_6px_10px_-8px_rgba(120,53,15,0.8)]">
            <Image
              src={member.image}
              alt={`${member.name} profile photo`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center saturate-[0.92] sepia-[0.08] transition duration-300 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(120,53,15,0.08),rgba(120,53,15,0.08)_1px,transparent_1px,transparent_7px)] opacity-30" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-amber-900/20 to-transparent" />
          </div>
        </div>
      ) : (
        <div className="p-3 pb-0">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden border-4 border-amber-50 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 shadow-[0_6px_10px_-8px_rgba(120,53,15,0.8)]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(120,53,15,0.08),rgba(120,53,15,0.08)_1px,transparent_1px,transparent_7px)] opacity-30" />
            <div className="absolute left-4 top-4 h-10 w-10 rotate-[-10deg] border border-amber-300/80 bg-amber-50/70" />
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-amber-900/15 to-transparent" />
          </div>
        </div>
      )}
      <div className="relative space-y-1.5 p-3.5 pt-3">
        <p className="text-xs italic tracking-wide text-amber-900/80">
          {member.role}
        </p>
        <h3 className="text-base font-semibold text-amber-950">{member.name}</h3>
        <div className="flex gap-3">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 underline decoration-amber-500/60 underline-offset-2 transition hover:text-amber-950"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 underline decoration-amber-500/60 underline-offset-2 transition hover:text-amber-950"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </div>
      </div>
      </article>
    );
  };

  return (
    <div className="space-y-12">
      {/* Paper curl animation styles */}
      <style>{`
        .paper-curl {
          /* allow the curl to render outside the card */
          overflow: visible;
        }

        /* The curling triangle in the bottom-right corner */
        .paper-curl::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: 0;
          height: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 45%,
            rgba(120, 53, 15, 0.18) 47%,
            rgba(254, 243, 199, 0.95) 52%,
            #fef3c7 70%,
            #fde68a 100%
          );
          box-shadow: -2px -2px 6px rgba(120, 53, 15, 0.25);
          transition: width 0.35s ease, height 0.35s ease;
          pointer-events: none;
          z-index: 3;
          /* clip into a triangle pointing up-left */
          clip-path: polygon(100% 0, 0 100%, 100% 100%);
        }

        /* The shadow cast by the curled corner onto the card below */
        .paper-curl::before {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: 0;
          height: 0;
          background: radial-gradient(
            circle at bottom right,
            rgba(120, 53, 15, 0.35) 0%,
            rgba(120, 53, 15, 0.15) 40%,
            transparent 70%
          );
          transition: width 0.35s ease, height 0.35s ease;
          pointer-events: none;
          z-index: 2;
          clip-path: polygon(100% 0, 0 100%, 100% 100%);
        }

        .paper-curl:hover::after,
        .paper-curl:hover::before {
          width: 70px;
          height: 70px;
        }
      `}</style>

      <section>
        <h1 className="text-4xl font-bold text-gray-900">Dev Team</h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">About</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          We are a student-led team that designs, builds, and maintains ACM digital projects. Add
          your team mission, current focus, and how members can get involved.
        </p>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Team Photo</p>
        <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-gray-100 shadow-sm">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/resources/dev-team/devteam.png"
              alt="Dev Team group photo"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Roster</h2>
        {executiveMembers.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dev Team Directors</p>
            <div className="mt-4 flex justify-center">
              <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {executiveMembers.map((member, index) => renderMemberCard(member, index))}
              </div>
            </div>
          </div>
        )}

        {coreMembers.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dev Team Officers</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coreMembers.map((member, index) => renderMemberCard(member, index))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}