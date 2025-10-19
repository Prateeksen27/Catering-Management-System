// stores/dataStore.js
import { create } from "zustand";

export const useDataStore = create((set, get) => ({
  // ===== Selected Staff State =====
  selectedStaff: {
    manager: [],
    worker: [],
    driver: [],
    chef: [],
  },

  // ===== Selected Goods State =====
  selectedGoods: {
    equipment: [], 
    supplies: [],
    furniture: [],
  },

  // ===== Selected Vehicles State =====
  selectedVehicles: [],

  // ===== Staff Actions =====
  setSelectedStaff: (role, staffIds) => {
    set((state) => ({
      selectedStaff: {
        ...state.selectedStaff,
        [role]: staffIds
      }
    }));
  },

  clearSelectedStaff: () => {
    set({
      selectedStaff: {
        manager: [],
        worker: [],
        driver: [],
        chef: [],
      }
    });
  },

  getSelectedStaffCount: () => {
    const state = get();
    return Object.values(state.selectedStaff).flat().length;
  },

  // ===== Goods Actions =====
  setSelectedGoods: (category, itemsWithQuantities) => {
    set((state) => ({
      selectedGoods: {
        ...state.selectedGoods,
        [category]: itemsWithQuantities
      }
    }));
  },

  updateGoodsQuantity: (category, itemId, quantity) => {
    set((state) => {
      const updatedCategory = state.selectedGoods[category]?.map(item => 
        item.itemId === itemId ? { ...item, quantity } : item
      ) || [];
      
      const updatedGoods = {
        ...state.selectedGoods,
        [category]: updatedCategory
      };
        
      return { selectedGoods: updatedGoods };
    });
  },

  addGoodsItem: (category, itemId, itemName, quantity = 1) => {
    set((state) => ({
      selectedGoods: {
        ...state.selectedGoods,
        [category]: [
          ...(state.selectedGoods[category] || []),
          { itemId, itemName, quantity }
        ]
      }
    }));
  },

  removeGoodsItem: (category, itemId) => {
    set((state) => ({
      selectedGoods: {
        ...state.selectedGoods,
        [category]: (state.selectedGoods[category] || []).filter(item => item.itemId !== itemId)
      }
    }));
  },

  clearSelectedGoods: () => {
    set({
      selectedGoods: {
        equipment: [],
        supplies: [],
        furniture: [],
      }
    });
  },
  
  getSelectedCount: () => {
    const state = get();
    return Object.values(state.selectedStaff).flat().length;
  },

  getSelectedGoodsCount: () => {
    const state = get();
    let count = 0;
    Object.values(state.selectedGoods).forEach(category => {
      if (category && Array.isArray(category)) {
        count += category.length;
      }
    });
    return count;
  },

  // Get total quantity count (sum of all quantities)
  getTotalGoodsQuantity: () => {
    const state = get();
    let total = 0;
    Object.values(state.selectedGoods).forEach(category => {
      if (category && Array.isArray(category)) {
        category.forEach(item => {
          total += item.quantity || 0;
        });
      }
    });
    return total;
  },

  // ===== Vehicle Actions =====
  setSelectedVehicles: (vehicleIds) => {
    set({ selectedVehicles: vehicleIds });
  },

  addVehicle: (vehicleId) => {
    set((state) => ({
      selectedVehicles: state.selectedVehicles.includes(vehicleId)
        ? state.selectedVehicles
        : [...state.selectedVehicles, vehicleId]
    }));
  },

  removeVehicle: (vehicleId) => {
    set((state) => ({
      selectedVehicles: state.selectedVehicles.filter(id => id !== vehicleId)
    }));
  },

  toggleVehicle: (vehicleId) => {
    set((state) => ({
      selectedVehicles: state.selectedVehicles.includes(vehicleId)
        ? state.selectedVehicles.filter(id => id !== vehicleId)
        : [...state.selectedVehicles, vehicleId]
    }));
  },

  clearSelectedVehicles: () => {
    set({ selectedVehicles: [] });
  },

  getSelectedVehiclesCount: () => {
    return get().selectedVehicles.length;
  },

  isVehicleSelected: (vehicleId) => {
    return get().selectedVehicles.includes(vehicleId);
  },

  // ===== Clear All Selections =====
  clearAllSelections: () => {
    set({
      selectedStaff: {
        manager: [],
        worker: [],
        driver: [],
        chef: [],
      },
      selectedGoods: {
        equipment: [],
        supplies: [],
        furniture: [],
      },
      selectedVehicles: []
    });
  },
}));