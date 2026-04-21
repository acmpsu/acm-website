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
  { name: "Ethan Elemento", role: "Hack Director" },
];

const FRIENDS = [
  { name: "Partner Club 1" },
  { name: "Partner Club 2" },
  { name: "Partner Club 3" },
  { name: "Partner Club 4" },
  { name: "Partner Club 5" },
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

        {/* Friends */}
        <section id="friends">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] mb-2">
            Campus Community
          </p>
          <h2 className="mb-4 text-[18px] font-semibold text-[var(--navy-dk)]">Our Partners</h2>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)] mb-6">
            We collaborate with peer organizations across Penn State to strengthen our campus computing community
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FRIENDS.map((friend) => (
              <div key={friend.name} className="flex items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-alt)] p-6 h-24">
                <p className="text-[13px] font-medium text-[var(--slate)]">{friend.name}</p>
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
          <div className="rounded border border-[var(--border)] bg-[var(--bg-alt)] p-8 text-center">
            <p className="text-[13px] text-[var(--slate)]">Contact section coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}
