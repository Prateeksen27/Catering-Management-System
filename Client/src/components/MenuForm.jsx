import React, { useState, useEffect, useMemo } from "react";
import { TagsInput } from "@mantine/core";
import { clientAuthStore } from "../store/clientStore.js";

/* =========================
   Approx pricing per category
========================= */
const CUSTOM_CATEGORY_PRICE = {
  appetizers: 80,
  mains: 180,
  desserts: 50,
  beverages: 50,
};

export default function MenuForm({ data, errors, onChange }) {
  const { menu, fetchMenu } = clientAuthStore();

  const [activeCategory, setActiveCategory] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  /* =========================
     Fetch menu
  ========================= */
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  /* =========================
     Default category
  ========================= */
  useEffect(() => {
    const categories = Object.keys(menu);
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [menu, activeCategory]);

  /* =========================
     Calculate Estimated Price
     (NO infinite loop)
  ========================= */
  useEffect(() => {
    let total = 0;

    // Predefined items
    Object.entries(data.selectedItems || {}).forEach(
      ([category, items]) => {
        items.forEach((itemName) => {
          const menuItem = menu[category]?.find(
            (item) => item.name === itemName
          );
          if (menuItem) total += menuItem.perServingAmount;
        });
      }
    );

    // Custom items
    (data.customMenuItems || []).forEach((item) => {
      total += CUSTOM_CATEGORY_PRICE[item.category] || 0;
    });

    setEstimatedPrice(total);

    if (data.estimatedPrice !== total) {
      onChange(["estimatedPrice"], total);
    }
  }, [data.selectedItems, data.customMenuItems, menu]);

  /* =========================
     Custom tags for category
  ========================= */
  const customTags = useMemo(() => {
    return (data.customMenuItems || [])
      .filter((i) => i.category === activeCategory)
      .map((i) => i.name);
  }, [data.customMenuItems, activeCategory]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Menu Selection</h2>
      <p className="text-slate-600">Choose your menu items</p>

      {/* =========================
         Category Tabs
      ========================= */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {Object.keys(menu).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg font-medium border ${
                isActive
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          );
        })}
      </div>

      {/* =========================
         Predefined Menu Items
      ========================= */}
      <div className="mt-4 h-60 overflow-y-auto border rounded-xl p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menu[activeCategory]?.map((item) => {
            const isChecked =
              data.selectedItems?.[activeCategory]?.includes(
                item.name
              ) || false;

            return (
              <label
                key={item._id}
                className={`flex flex-col p-4 rounded-xl border cursor-pointer ${
                  isChecked
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const current =
                        data.selectedItems?.[activeCategory] || [];

                      const updated = e.target.checked
                        ? [...current, item.name]
                        : current.filter((i) => i !== item.name);

                      onChange(
                        ["selectedItems", activeCategory],
                        updated
                      );
                    }}
                    className="h-5 w-5 mt-1"
                  />
                  <span className="font-semibold text-green-600">
                    ₹{item.perServingAmount}
                  </span>
                </div>
                <span className="text-center font-medium text-slate-700">
                  {item.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* =========================
         Custom Menu Items
      ========================= */}
      <div className="mt-6 p-4 border rounded-xl bg-slate-50">
        <h3 className="font-semibold text-slate-800 mb-1">
          Add Custom {activeCategory} Items
        </h3>

        <p className="text-sm text-slate-600 mb-3">
          Approximate price per item: ₹
          {CUSTOM_CATEGORY_PRICE[activeCategory] || 0}
        </p>

        <TagsInput
          value={customTags}
          onChange={(values) => {
            const remaining = (data.customMenuItems || []).filter(
              (i) => i.category !== activeCategory
            );

            const updatedForCategory = values.map((name) => ({
              name,
              category: activeCategory,
            }));

            const next = [...remaining, ...updatedForCategory];

            if (
              JSON.stringify(next) !==
              JSON.stringify(data.customMenuItems)
            ) {
              onChange(["customMenuItems"], next);
            }
          }}
          label="Other menu items (Press Enter)"
          placeholder={`Enter ${activeCategory} item`}
          clearable
        />
      </div>

      {/* =========================
         Estimated Price
      ========================= */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex justify-between">
          <span className="font-semibold text-blue-800">
            Estimated Price:
          </span>
          <span className="text-2xl font-bold text-blue-800">
            ₹{estimatedPrice}
          </span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          Based on{" "}
          {Object.values(data.selectedItems || {}).flat().length +
            (data.customMenuItems?.length || 0)}{" "}
          items
        </p>
      </div>

      {errors.menu && (
        <p className="text-rose-600 text-sm mt-3">
          {errors.menu}
        </p>
      )}
    </div>
  );
}
