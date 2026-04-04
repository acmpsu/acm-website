import { HERO_TITLE, HERO_DESCRIPTION } from "@/lib/constants";

export function Hero() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4 leading-tight text-black">{HERO_TITLE}</h1>
          <p className="text-black text-lg mb-6 leading-relaxed">{HERO_DESCRIPTION}</p>
          <div className="flex gap-3">
            <button className="bg-gray-400 h-6 w-20 rounded"></button>
            <button className="bg-gray-400 h-6 w-20 rounded"></button>
          </div>
        </div>
        <div className="bg-gray-300 h-80 rounded"></div>
      </div>
    </section>
  );
}
