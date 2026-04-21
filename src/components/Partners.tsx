import Image from "next/image";

type Sponsor = {
  name: string;
  logo: string;
};

const SPONSORS: Sponsor[] = [
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

export function Partners() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
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
      </div>
    </section>
  );
}
