import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMenuStore = create((set, get) => ({
  menu: {
    appetizers: [],
    mains: [],
    desserts: [],
    beverages: [],
  },
  isLoading: false,

  fetchMenu: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/menu/getMenu");
      set({ menu: res.data.data, isLoading: false });
    } catch (error) {
      console.log("Error fetching menu", error);
      toast.error("Error occurred while fetching");
      set({ isLoading: false });
    }
  },

  addMenuItem: async (item) => {
    try {
      const res = await toast.promise(
        axiosInstance.post("/menu/addMenuItem", item),
        {
          loading: "Adding please wait a moment...",
          success: "Menu Item Added Successfully",
          error: "Error occurred while Adding!",
        }
      );

      const category = res.data.data.category;

      set((state) => ({
        menu: {
          ...state.menu,
          [category]: [...(state.menu[category] || []), res.data.data],
        },
      }));
    } catch (error) {
      console.log("Error Adding Menu Item", error);
      toast.error("Error occurred while adding item");
    }
  },

  deleteMenuItem: async (id, category) => {
    try {
      await axiosInstance.delete(`/menu/deleteMenuItem/${id}`);
      set((state) => ({
        menu: {
          ...state.menu,
          [category]: (state.menu[category] || []).filter(
            (item) => item._id !== id
          ),
        },
      }));
      toast.success("Menu item deleted successfully!");
    } catch (error) {
      console.log("Error deleting menu item: ", error);
      toast.error("Error occurred while deleting item");
    }
  },

  updateMenuItem: async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(
        `/menu/updateMenuItem/${id}`,
        updatedData
      );
      const updatedItem = res.data.data;
      const category = updatedItem.category;

      set((state) => {
        const existingCategory = state.menu[category] || [];
        const updatedCategory = existingCategory.map((item) =>
          item._id === id ? updatedItem : item
        );

        return {
          menu: {
            ...state.menu,
            [category]: updatedCategory,
          },
        };
      });

      toast.success("Menu Item Updated Successfully");
      return res.data;
    } catch (error) {
      console.log("Error Updating Menu Item", error);
      toast.error("Error occurred while updating!");
      throw error;
    }
  },
}));
