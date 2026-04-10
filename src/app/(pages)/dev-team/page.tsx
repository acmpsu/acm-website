import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  linkedin: string;
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

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Team Member Name",
    role: "Dev Team Executive",
    linkedin: "https://www.linkedin.com/",
    image: "/team/khai.png",
  },
  {
    name: "Team Member Name",
    role: "Dev Team",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Team Member Name",
    role: "Dev Team",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Team Member Name",
    role: "Dev Team",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Team Member Name",
    role: "Dev Intern",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Team Member Name",
    role: "Dev Intern",
    linkedin: "https://www.linkedin.com/",
  },
];

export default function DevTeamPage() {
  return (
    <div className="space-y-12">
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
        <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-gray-100">
          <div className="flex h-64 items-center justify-center text-sm text-gray-500 sm:h-80 lg:h-96">
            Photo Placeholder
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Roster</h2>
        <p className="mt-2 text-gray-600">
          Add each member&apos;s real photo, name, and LinkedIn profile below.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member, index) => (
            <article
              key={`${member.name}-${index}`}
              className="group overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              {member.image ? (
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-gray-200">
                  <Image
                    src={member.image}
                    alt={`${member.name} profile photo`}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div
                  className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300"
                  aria-hidden="true"
                >
                  <div className="absolute left-4 top-4 h-12 w-12 rounded-full border border-white/70 bg-white/60 backdrop-blur" />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              )}
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{member.role}</p>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}