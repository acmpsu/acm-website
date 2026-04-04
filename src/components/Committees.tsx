import { COMMITTEE_COUNT } from "@/lib/constants";

export function Committees() {
  return (
    <section className="bg-white py-16 px-6" id="committees">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">Committees</h2>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(COMMITTEE_COUNT)].map((_, i) => (
            <div key={i} className="bg-gray-300 h-16 rounded"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
