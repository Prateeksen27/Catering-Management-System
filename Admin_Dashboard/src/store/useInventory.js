import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useInventoryStore = create((set, get) => ({
  inventory: {
    vegetables: [],
    groceries: [],
    dairy: []
  },
  loading: false,

  /* ================= FETCH INVENTORY ================= */
  fetchInventory: async () => {
    set({ loading: true });
    const toastId = toast.loading("Loading inventory...");
    try {
      const res = await axiosInstance.get("/inventory");  
      set({ inventory: res.data.inventory });
      console.log(res.data);
      
      toast.success("Inventory loaded", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory", { id: toastId });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= CREATE ITEM ================= */
  createInventoryItem: async (data) => {
    const toastId = toast.loading("Adding inventory item...");
    try {
      await axiosInstance.post("/inventory", data);
      toast.success("Item added successfully", { id: toastId });
      await get().fetchInventory();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item", { id: toastId });
    }
  },

  /* ================= UPDATE ITEM ================= */
  updateInventoryItem: async (id, data) => {
    const toastId = toast.loading("Updating item...");
    try {
      await axiosInstance.put(`/inventory/${id}`, data);
      toast.success("Item updated successfully", { id: toastId });
      await get().fetchInventory();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item", { id: toastId });
    }
  },

  /* ================= RESTOCK ITEM ================= */
  restockInventoryItem: async (id, data) => {
    const toastId = toast.loading("Updating stock...");
    try {
      await axiosInstance.patch(`/inventory/stock/${id}`, data);
      toast.success("Stock updated successfully", { id: toastId });
      await get().fetchInventory();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock", { id: toastId });
    }
  }
}));
