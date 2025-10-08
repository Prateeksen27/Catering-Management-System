// src/components/MenuGrid.jsx
export default function MenuGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 p-6 rounded-xl border bg-white shadow-sm">
        No items for this category yet.
      </div>
    );
  }

  // sort alphabetically by name
  const sortedItems = [...items].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedItems.map((item, i) => (
        <article
          key={i}
          className="rounded-2xl overflow-hidden shadow-md border bg-white hover:shadow-xl hover:-translate-y-1 transition"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500">₹{item.price}</p>
            <p className="text-xs text-gray-400 italic">
              {item.regional.join(", ")}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
