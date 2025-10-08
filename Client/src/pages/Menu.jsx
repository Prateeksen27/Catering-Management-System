import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MENU_CATEGORIES, MENU_ITEMS } from "../assets/menuData.js";
import MenuSidebar from "../components/MenuSidebar";
import MenuGrid from "../components/MenuGrid";
import CoverImage from "../components/CoverImage.jsx";

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const firstCat = MENU_CATEGORIES[0].id;
  const [active, setActive] = useState(params.get("category") || firstCat);
  const [search, setSearch] = useState("");

  // keep URL in sync (only if category is chosen)
  useEffect(() => {
    if (active) {
      setParams({ category: active });
    } else {
      setParams({}); // clear category param when "All Dishes"
    }
  }, [active, setParams]);

  // filter dishes by category + search
  const items = useMemo(() => {
    return MENU_ITEMS.filter(
      (item) =>
        (!active || item.category.includes(active)) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [active, search]);

  const activeLabel =
    active === null
      ? "All Dishes"
      : MENU_CATEGORIES.find((c) => c.id === active)?.label;

  return (
    <>
      <CoverImage />
      <div className="grid grid-cols-12 min-h-screen bg-gray-50">
        {/* LEFT SIDEBAR */}
        <aside className="col-span-12 md:col-span-3 border-r bg-white shadow-sm">
          <MenuSidebar
            categories={MENU_CATEGORIES}
            active={active}
            onSelect={setActive}
          />
        </aside>

        {/* RIGHT GRID */}
        <main className="col-span-12 md:col-span-9 p-6">
          {/* Header + Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{activeLabel}</h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full sm:w-72 border rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          {/* Grid */}
          <MenuGrid items={items} />
        </main>
      </div>
    </>
  );
}
