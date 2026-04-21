
const OFFICIAL_LINKS = [
  { label: "Instagram", display: "@pennstateacm", href: "https://www.instagram.com/pennstateacm" },
  { label: "Website", display: "psuacm.com", href: "https://www.psuacm.com/" },
  { label: "LinkedIn", display: "ACM PSU", href: "https://www.linkedin.com/company/acmpsu" },
  {
    label: "Org Page",
    display: "Penn State Discover",
    href: "https://discover.psu.edu/organization/acmpsu",
  },
  { label: "Discord", display: "Join the server", href: "https://discord.gg/zkqYjGxVsh" },
  { label: "GroupMe", display: "Join the group", href: "https://groupme.com/join_group/113864937/hfRpqc64" },
];

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <section>
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


    </div>
  );
}
