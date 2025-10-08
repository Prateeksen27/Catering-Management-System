import React, { useState, useEffect } from "react";
import { menuCategories } from "../assets/constants"; // Import MENU_ITEMS
import { MENU_ITEMS } from "../assets/menuData"; // Import MENU_ITEMS


export default function MenuForm({ data, errors, onChange }) {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Calculate price whenever selected items change
  useEffect(() => {
    let total = 0;
    
    // Loop through all categories and selected items
    Object.entries(data.selectedItems || {}).forEach(([category, items]) => {
      items.forEach(itemName => {
        // Find the item in MENU_ITEMS that matches both name and category
        const menuItem = MENU_ITEMS.find(item => 
          item.name === itemName && 
          item.category.some(cat => cat.includes(category))
        );
        
        if (menuItem) {
          total += menuItem.price;
        }
      });
    });
    
    setEstimatedPrice(total);
    // Update the parent component with the calculated price
    onChange(["estimatedPrice"], total);
  }, [data.selectedItems, onChange]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Menu Selection</h2>
      <p className="text-slate-600">Choose your menu items</p>

      {/* Tab Buttons */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {Object.keys(menuCategories).map((cat) => {
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

      {/* Food Items - Scrollable Grid */}
      <div className="mt-4 h-60 overflow-y-auto border rounded-xl p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menuCategories[activeCategory]
            .slice()
            .sort()
            .map((item) => {
              const isChecked = data.selectedItems?.[activeCategory]?.includes(item) || false;
              
              // Find the item price from MENU_ITEMS
              const menuItem = MENU_ITEMS.find(menuItem => 
                menuItem.name === item && 
                menuItem.category.some(cat => cat.includes(activeCategory))
              );
              const itemPrice = menuItem ? menuItem.price : 0;
              
              return (
                <label
                  key={item}
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
                          newItems = [...currentItems, item];
                        } else {
                          newItems = currentItems.filter(selectedItem => selectedItem !== item);
                        }
                        
                        onChange(["selectedItems", activeCategory], newItems);
                      }}
                      className="h-5 w-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 mt-1"
                    />
                    
                    <span className="text-green-600 font-semibold">
                      ₹{itemPrice}
                    </span>
                  </div>
                  
                  <span className="text-slate-700 font-medium text-center block">
                    {item}
                  </span>
                </label>
              );
            })}
        </div>
      </div>

      {/* Display estimated price */}
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

      {/* Special Requests */}
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