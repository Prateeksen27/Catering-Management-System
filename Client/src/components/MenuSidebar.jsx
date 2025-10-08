// src/components/MenuSidebar.jsx
import { Utensils } from "lucide-react";

export default function MenuSidebar({ categories, active, onSelect }) {
  return (
    <nav className="p-4 space-y-2 sticky top-0 md:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Categories
      </h2>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-all duration-200
            ${
              active === c.id
                ? "bg-amber-100 text-amber-700 font-semibold shadow-sm scale-[1.02]"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm hover:scale-[1.01]"
            }
          `}
        >
          <Utensils
            size={18}
            className={`transition-colors ${
              active === c.id ? "text-amber-600" : "text-gray-500 group-hover:text-gray-700"
            }`}
          />
          {c.label}
        </button>
      ))}
    </nav>
  );
}
