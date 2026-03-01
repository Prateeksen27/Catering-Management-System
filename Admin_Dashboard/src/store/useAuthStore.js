import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (empID, password, empType) => {
        try {
          set({ isLoading: true })

          const response = await axiosInstance.post("/auth/login", {
            empID,
            password,
            empType,
          });
          // Store both user and token
          set({ 
            user: response.data.user.user, 
            token: response.data.token,
            isAuthenticated: true 
          });
          toast.success(`Welcome to CMS, ${response.data.user.user.name}!`);
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })

          console.error(error);
          toast.error(error.response?.data?.message || "Login failed");
        }
      },
      updateProfile:async (updatedData, userId) => {
        const loadingToast = toast.loading("Updating profile...")
        try {
          if (!userId) {
            toast.error("User ID not found. Please login again.",{id:loadingToast});
            return;
          }
          const res = await axiosInstance.put(
            `/auth/update-profile/${userId}`,
            updatedData // ✅ Send as object
          );
          set({ user: res.data.user || res.data });
          toast.success("Profile updated successfully",{id:loadingToast});
        } catch (error) {
          console.error("❌ Error in update profile:", error);
          toast.error(error.response?.data?.message || "Profile update failed",{id:loadingToast});
        }
      },

      updateProfilePicture: async (profilePic, userId) => {
        const loadingToast = toast.loading("Updating profile...")
        try {
          if (!userId) {
            toast.error("User ID not found. Please login again.",{id:loadingToast});
            return;
          }

          const res = await axiosInstance.put(
            `/auth/update-profile/${userId}`,
            { profilePic } // ✅ Send as object
          );

          set({ user: res.data.user || res.data });
          toast.success("Profile updated successfully",{id:loadingToast});
        } catch (error) {
          console.error("❌ Error in update profile:", error);
          toast.error(error.response?.data?.message || "Profile update failed",{id:loadingToast});
        }
      },
      logout: () => {
        try {
          set({ user: null, token: null, isAuthenticated: false });
          toast.success("Logout successful");
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);