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
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Team Picture</p>
        <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-gray-100">
          <div className="flex h-56 items-center justify-center text-sm font-medium text-gray-500 sm:h-72 lg:h-80">
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
