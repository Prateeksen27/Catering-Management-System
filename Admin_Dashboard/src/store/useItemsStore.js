import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useStoreItemsStore = create((set, get) => ({
    storeItems: {
        equipment: [],
        supplies: [],
        furniture: []
    },
    fetchStoreItems: async () => {
        const loadingToast = toast.loading("Fetching store items...")
        try {
            const res = await axiosInstance.get('/store/getAllItems')
            set({ storeItems: res.data.data })
            toast.success("Store items loaded", { id: loadingToast })
        } catch (error) {
            toast.error("Failed to fetch store items ❌", { id: loadingToast });
        }
    },
    createStoreItem: async (itemData) => {
        const loadingToast = toast.loading("Creating new item...")
        try {
            const res = await axiosInstance.post('/store/createNewItem', itemData)
            const newItem = res.data.data

            set((state) => ({
                storeItems: {
                    ...state.storeItems,
                    [newItem.category]: [...state.storeItems[newItem.category], newItem]
                }
            }))
            toast.success("Item created successfully", { id: loadingToast });
        } catch (error) {
            toast.error("Failed to create item ❌", { id: loadingToast });
        }
    },
    updateStoreItem: async (id, updateData, category) => {
        const loadingToast = toast.loading("Updating item...")
        try {
            const res = await axiosInstance.put(`/store/updateItem/${id}`, updateData)
            const updatedItem = res.data.data

            set((state) => ({
                storeItems: {
                    ...state.storeItems,
                    [category]: state.storeItems[category].map((item) => item._id === id ? updatedItem : item)
                }
            }))

            toast.success("Item Updated Successfully", { id: loadingToast })
        } catch (error) {
            toast.error("Failed to update item ❌", { id: loadingToast });
        }
    },
    updateStockItem: async (data, id) => {
        const loadingToast = toast.loading("Updating stocks...")
        try {
            const res = await axiosInstance.put(`/store/updateStock/${id}`, data)
            const updatedItem = res.data.data
            const category = data.category
            set((state) => ({
                storeItems: {
                    ...state.storeItems,
                    [category]: state.storeItems[category].map((item) => item._id === id ? updatedItem : item)
                }
            }))
            toast.success("Item Updated Successfully", { id: loadingToast })
        } catch (error) {
            toast.error("Failed to update item ❌", { id: loadingToast });
        }
    }
}))