import React, { useState, useEffect } from "react";
import { clientAuthStore } from "../store/clientStore.js"// import Zustand store

export default function MenuForm({ data, errors, onChange }) {
  const { menu, fetchMenu } = clientAuthStore();
  const [activeCategory, setActiveCategory] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // ✅ Fetch menu on component mount
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // ✅ Set first category as default active when menu is loaded
  useEffect(() => {
    const categories = Object.keys(menu);
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [menu, activeCategory]);

  // ✅ Calculate price whenever selected items change
  useEffect(() => {
    let total = 0;

    Object.entries(data.selectedItems || {}).forEach(([category, items]) => {
      items.forEach(itemName => {
        const menuItem = menu[category]?.find(item => item.name === itemName);
        if (menuItem) total += menuItem.perServingAmount;
      });
    });

    setEstimatedPrice(total);
    onChange(["estimatedPrice"], total);
  }, [data.selectedItems, menu]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Menu Selection</h2>
      <p className="text-slate-600">Choose your menu items</p>

      {/* ✅ Category Tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {Object.keys(menu).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg font-medium border transition-all ${
                isActive
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          );
        })}
      </div>

      {/* ✅ Menu Items */}
      <div className="mt-4 h-60 overflow-y-auto border rounded-xl p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menu[activeCategory]?.map((item) => {
            const isChecked = data.selectedItems?.[activeCategory]?.includes(item.name) || false;

            return (
              <label
                key={item._id}
                className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isChecked
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-slate-300 hover:border-indigo-400"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentItems = data.selectedItems?.[activeCategory] || [];
                      let newItems;
                      if (e.target.checked) {
                        newItems = [...currentItems, item.name];
                      } else {
                        newItems = currentItems.filter(selectedItem => selectedItem !== item.name);
                      }
                      onChange(["selectedItems", activeCategory], newItems);
                    }}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 mt-1"
                  />
                  <span className="text-green-600 font-semibold">
                    ₹{item.perServingAmount}
                  </span>
                </div>
                <span className="text-slate-700 font-medium text-center block">
                  {item.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ✅ Estimated Price */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-800">Estimated Price:</span>
          <span className="text-2xl font-bold text-blue-800">₹{estimatedPrice}</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          Based on {Object.values(data.selectedItems || {}).flat().length} selected items
        </p>
      </div>

      {errors.menu && <p className="text-rose-600 text-sm mt-3">{errors.menu}</p>}

      {/* ✅ Special Requests */}
      <div className="mt-6">
        <label className="block font-medium text-slate-700 mb-1">
          Special Requests (Optional)
        </label>
        <textarea
          rows={3}
          value={data.specialRequests}
          onChange={(e) => onChange(["specialRequests"], e.target.value)}
          className="w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Jain food, no onion & garlic, theme colors, etc."
        />
      </div>
    </div>
  );
}
