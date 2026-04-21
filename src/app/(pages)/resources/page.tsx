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
];

const SPONSORS = [
  { name: "Sponsor 1" },
  { name: "Sponsor 2" },
  { name: "Sponsor 3" },
  { name: "Sponsor 4" },
  { name: "Sponsor 5" },
  { name: "Sponsor 6" },
];

const FRIENDS = [
  { name: "Partner Club 1" },
  { name: "Partner Club 2" },
  { name: "Partner Club 3" },
  { name: "Partner Club 4" },
  { name: "Partner Club 5" },
];

const OFFICIAL_LINKS = [
  { label: "Instagram", display: "@pennstateacm", href: "https://www.instagram.com/pennstateacm" },
  { label: "Website", display: "psuacm.com", href: "https://www.psuacm.com/" },
  { label: "LinkedIn", display: "ACM PSU", href: "https://www.linkedin.com/company/acmpsu" },
  {
    label: "Org Page",
    display: "Penn State Discover",
    href: "https://discover.psu.edu/organization/association-for-computing-machinery",
  },
  { label: "Discord", display: "Join the server", href: "https://discord.gg/zkqYjGxVsh" },
  { label: "GroupMe", display: "Join the group", href: "https://groupme.com/join_group/113864937/hfRpqc64" },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xl font-semibold text-gray-700">
        {getInitials(member.name)}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{member.role}</p>
      <h3 className="mt-2 text-lg font-semibold text-gray-900">{member.name}</h3>
    </article>
  );
}

export default function ResourcesPage() {
  return (
    <div className="space-y-14">
      <section>
        <h1 className="text-4xl font-bold text-gray-900">Resources</h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">Get to know us</p>
      </section>

      {/* Meet Us */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Meet Us</h2>
        <div className="space-y-4">
          <details className="border border-gray-200 rounded-lg">
            <summary className="cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 select-none">
              Eboard
            </summary>
            <div className="border-t border-gray-200 px-6 py-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {EBOARD.map((member) => (
                  <TeamCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          </details>

          <details className="border border-gray-200 rounded-lg">
            <summary className="cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 select-none">
              Directors
            </summary>
            <div className="border-t border-gray-200 px-6 py-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {DIRECTORS.map((member) => (
                  <TeamCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Sponsors */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Supporting Organizations</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">Sponsors</h2>
        <p className="mt-4 max-w-3xl text-gray-600">
          We partner with industry leaders to support ACM at Penn State and provide opportunities for our members.
        </p>
        {/* TODO: replace with real sponsor logos and links */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPONSORS.map((sponsor) => (
            <div key={sponsor.name} className="flex items-center justify-center rounded border border-gray-200 bg-gray-50 p-8 h-32">
              <p className="text-sm font-medium text-gray-500">{sponsor.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Friends */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Campus Community</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">Friends & Partners</h2>
        <p className="mt-4 max-w-3xl text-gray-600">
          We collaborate with peer organizations across Penn State to strengthen our campus computing community.
        </p>
        {/* TODO: add real partner club logos and links */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FRIENDS.map((friend) => (
            <div key={friend.name} className="rounded border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700">{friend.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Get In Touch</h2>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Official Channels</p>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {OFFICIAL_LINKS.map((link) => (
              <div key={link.label} className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{link.label}</dt>
                <dd>
                  <a
                    className="text-sm text-gray-700 hover:text-gray-900"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.display}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Email</p>
          {/* TODO: add official contact email address */}
          <p className="mt-4 text-sm text-gray-600">
            Email us at <span className="font-medium text-gray-900">[contact email]</span> for inquiries.
          </p>
        </div>
      </section>
    </div>
  );
}
