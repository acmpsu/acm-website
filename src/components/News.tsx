import { NEWS_COUNT } from "@/lib/constants";

export function News() {
  return (
    <section className="bg-gray-100 py-16 px-6" id="events">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">News</h2>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(NEWS_COUNT)].map((_, i) => (
            <div key={i} className="bg-gray-300 h-40 rounded"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
