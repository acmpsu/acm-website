import Image from "next/image";

type Committee = {
  name: string;
  logo: string;
  description: string;
};

const COMMITTEES: Committee[] = [
  {
    name: "AI Committee",
    logo: "/logos/ai.png",
    description:
      "Explores machine learning, modern AI tooling, and responsible applications through workshops, reading groups, and hands-on projects that meet members where they are.",
  },
  {
    name: "Data Committee",
    logo: "/logos/data.png",
    description:
      "Focuses on data engineering, analytics, and visualization—turning raw information into clear stories and reliable pipelines with practical, industry-relevant skills.",
  },
  {
    name: "Design Committee",
    logo: "/logos/design.png",
    description:
      "Covers product and visual design, UX fundamentals, and design systems so technical work ships with interfaces people actually want to use.",
  },
  {
    name: "ICPC Committee",
    logo: "/logos/icpc.png",
    description:
      "Prepares members for competitive programming and ICPC-style contests with structured practice, algorithms deep dives, and team problem-solving sessions.",
  },
  {
    name: "Quantum Committee",
    logo: "/logos/quantum.png",
    description:
      "Introduces quantum computing concepts, tools, and research directions—bridging linear algebra and programming with curiosity-first learning.",
  },
  {
    name: "Web Committee",
    logo: "/logos/web.png",
    description:
      "Builds full-stack web skills from accessible front ends to APIs and deployment, emphasizing real projects, modern frameworks, and clean engineering habits.",
  },
];

export default function CommitteesPage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold text-gray-900">Committees</h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">Our tracks</p>
        <p className="mt-2 max-w-3xl text-gray-600">
          ACM committees are how we organize learning and projects by interest. Each group runs events,
          workshops, and mentorship so you can go deep with peers who care about the same problems.
        </p>
      </section>

      <section className="space-y-5">
        {COMMITTEES.map((committee) => (
          <article
            key={committee.logo}
            className="flex flex-col gap-5 rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-start sm:gap-8"
          >
            <div className="flex shrink-0 justify-center sm:justify-start">
              <div className="relative h-40 w-40 overflow-hidden sm:h-48 sm:w-48">
                <Image
                  src={committee.logo}
                  alt={`${committee.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(min-width: 640px) 10rem, 8rem"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left p-2">
              <h2 className="text-2xl font-semibold text-gray-900">{committee.name}</h2>
              <p className="mt-2 text-gray-600">{committee.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
