import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const clientAuthStore = create((set) => ({
  estimatedPrice: 0,
  isLoading: false,
  setEstimatedPrice: (price) => set({ estimatedPrice: price }),

  sendQuery: async (data) => {
    set({ isLoading: true });

    await toast.promise(
      axiosInstance.post("/client/sendQuery", data),
      {
        loading: "Sending Query...",
        success: "Query Sent Successfully!",
        error: "Could not send query.",
      }
    );

    set({ isLoading: false });
  },
  sendBooking: async (data) => {
    try {
      set({ isLoading: true });

      await toast.promise(
        axiosInstance.post("/client/sendBooking", data),
        {
          loading: "Booking in progress... please don’t refresh 🚀",
          success: "Booking completed successfully!",
          error: "Error while booking! Please try again.",
        }
      );

      set({ isLoading: false });
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.response?.data?.message || "Unexpected error occurred!");
      set({ isLoading: false });
    }
  }

}));
