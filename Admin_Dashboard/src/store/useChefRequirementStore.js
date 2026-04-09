import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChefRequirementStore = create((set, get) => ({
  requirements: [],
  myRequirements: [],
  pendingBookings: [],
  selectedRequirement: null,
  isLoading: false,

  // Fetch chef dashboard data
  fetchMyRequirements: async () => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get(
        "/chef-requirements/my-requirements"
      );

      set({
        myRequirements: response.data.submittedRequirements || [],
        pendingBookings: response.data.pendingBookings || [],
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error fetching requirements");
      set({ isLoading: false });
    }
  },

  // Fetch all requirements (admin/manager)
  fetchAllRequirements: async (filters = {}) => {
    set({ isLoading: true });

    try {
      const params = new URLSearchParams(filters).toString();

      const response = await axiosInstance.get(
        `/chef-requirements?${params}`
      );

      set({
        requirements: response.data.requirements,
        isLoading: false,
      });
    } catch (error) {
      toast.error("Error fetching requirements");
      set({ isLoading: false });
    }
  },

  // Fetch single requirement
  fetchRequirementById: async (id) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get(
        `/chef-requirements/${id}`
      );

      set({
        selectedRequirement: response.data.requirement,
        isLoading: false,
      });

      return response.data.requirement;
    } catch (error) {
      console.log(error);
      toast.error("Error fetching requirement details");

      set({ isLoading: false });

      return null;
    }
  },

  // Submit requirement
  submitRequirement: async (data) => {
    const loadingToast = toast.loading("Submitting requirements...");

    try {
      const response = await axiosInstance.post(
        "/chef-requirements",
        data
      );

      toast.success("Requirements submitted successfully", {
        id: loadingToast,
      });

      // update local state
      set((state) => ({
        myRequirements: [
          response.data.requirement,
          ...state.myRequirements,
        ],

        // remove booking from pending list
        pendingBookings: state.pendingBookings.filter(
          (b) => b._id !== data.bookingId
        ),
      }));

      return response.data;
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Error submitting requirements",
        { id: loadingToast }
      );

      throw error;
    }
  },

  // Update requirement
  updateRequirement: async (id, data) => {
    const loadingToast = toast.loading("Updating requirements...");

    try {
      const response = await axiosInstance.put(
        `/chef-requirements/${id}`,
        data
      );

      toast.success("Requirements updated successfully", {
        id: loadingToast,
      });

      set((state) => ({
        myRequirements: state.myRequirements.map((r) =>
          r._id === id ? response.data.requirement : r
        ),

        selectedRequirement: response.data.requirement,
      }));

      return response.data;
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Error updating requirements",
        { id: loadingToast }
      );

      throw error;
    }
  },

  // Upload file
  uploadFile: async (id, file) => {
    const loadingToast = toast.loading("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/chef-requirements/${id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("File uploaded successfully", {
        id: loadingToast,
      });

      set((state) => ({
        selectedRequirement: response.data.file
          ? {
              ...state.selectedRequirement,
              files: [
                ...(state.selectedRequirement?.files || []),
                response.data.file,
              ],
            }
          : state.selectedRequirement,
      }));

      return response.data;
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Error uploading file",
        { id: loadingToast }
      );

      throw error;
    }
  },

  // Admin / Manager approval
  updateRequirementStatus: async (id, status, notes) => {
    const loadingToast = toast.loading(
      `Updating status to ${status}...`
    );

    try {
      const response = await axiosInstance.patch(
        `/chef-requirements/${id}/status`,
        { status, notes }
      );

      toast.success(
        `Requirement ${status.toLowerCase()} successfully`,
        { id: loadingToast }
      );

      set((state) => ({
        requirements: state.requirements.map((r) =>
          r._id === id ? response.data.requirement : r
        ),
      }));

      return response.data;
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Error updating status",
        { id: loadingToast }
      );

      throw error;
    }
  },
}));