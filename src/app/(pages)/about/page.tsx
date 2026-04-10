type Leader = {
  name: string;
  role: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const LEADERSHIP: Leader[] = [
  {
    name: "David Youm",
    role: "President",
  },
  {
    name: "Coen McFerson",
    role: "Vice President",
  },
  {
    name: "Rishi Raj",
    role: "Secretary",
  },
  {
    name: "Ayan Ospan",
    role: "Treasurer",
  },
  {
    name: "Cia Sherpa",
    role: "Publicity",
  },
  {
    name: "Bansari Patel",
    role: "Relations",
  },
  {
    name: "Khai Ta",
    role: "Dev Team Director",
  },
  {
    name: "Ben Nguyen",
    role: "Quantum Director",
  },
  {
    name: "Nikita Kiselov",
    role: "ICPC Director",
  },
  {
    name: "Mohammad Yafi Akhtar",
    role: "Web Director",
  },
  {
    name: "Sri Nikhil Bandi",
    role: "AI Director",
  },
  {
    name: "Aryaman Ajmera",
    role: "Data Director",
  },
  {
    name: "Younsoo Park",
    role: "Design Director",
  },
];

const PHOTO_STRIP = ["Learn", "Build", "Compete"];

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

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <section className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">About ACM @ Penn State</h1>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">What Is ACM</p>
          <p className="mt-2 max-w-3xl text-gray-600">
            The Association for Computing Machinery is the world&apos;s largest computing organization.
            At Penn State, ACM is a student community focused on technical excellence, inclusive
            collaboration, and real-world impact through workshops, projects, and competitions.
          </p>
          <p className="mt-4 max-w-3xl text-gray-600">
            We help members build strong fundamentals, ship meaningful work, and grow professionally
            through a supportive network of peers, alumni, and industry connections.
          </p>
        </div>

        <div className="overflow-hidden rounded border border-gray-200 bg-gray-100">
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            {PHOTO_STRIP.map((label) => (
              <div key={label} className="flex aspect-[3/4] items-end bg-gradient-to-b from-gray-50 to-gray-200 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Photo</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">What Do We Do</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          We run technical workshops, collaborative project tracks, and competition prep sessions
          that help students apply concepts beyond the classroom.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <ul className="space-y-2 max-w-3xl text-gray-600 list-disc pl-5">
            <li>Hands-on workshops in web, AI, data, and systems</li>
            <li>Project teams that ship real tools and products</li>
            <li>ICPC and competitive programming practice</li>
            <li>Career-focused events with alumni and industry partners</li>
          </ul>
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">How Do I Get Involved</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          ACM at Penn State is being rebuilt right now. This is just prep for the future, so the
          best way to get involved is to stay connected and help shape what comes next.
        </p>
        <ol className="mt-4 space-y-2 max-w-3xl text-gray-600 list-decimal pl-5">
          <li>Follow our official channels for updates and announcements</li>
          <li>Attend events, workshops, and project tracks</li>
        </ol>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Official Links</p>
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
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Team Picture</p>
        <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-gray-100">
          <div className="flex h-56 items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 text-sm font-medium text-gray-500 sm:h-72 lg:h-80">
            Team Photo Placeholder
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Leadership</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((leader) => (
            <article
              key={leader.name}
              className="rounded border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xl font-semibold text-gray-700">
                {getInitials(leader.name)}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{leader.role}</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{leader.name}</h3>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
