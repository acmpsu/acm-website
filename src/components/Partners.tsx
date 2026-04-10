export function Partners() {
  const sponsorPlaceholders = [
    "Sponsor 1",
    "Sponsor 2",
    "Sponsor 3",
    "Sponsor 4",
    "Sponsor 5",
    "Sponsor 6",
  ];

  return (
    <section className="bg-white py-12 px-6 border-t border-gray-200" id="partners">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-black mb-4">Working with the best.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {sponsorPlaceholders.map((sponsor) => (
            <div
              key={sponsor}
              className="flex h-20 items-center justify-center rounded border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 text-xs font-medium text-gray-600 transition hover:shadow-sm"
            >
              {sponsor}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
