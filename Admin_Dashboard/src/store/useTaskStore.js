import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  events: [],
  isLoading: false,
  error: null,

  // Fetch all tasks (filtered by role on backend)
  fetchTasks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`/tasks?${params}`);
      if (response.data.success) {
        set({ tasks: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to fetch tasks");
    }
  },

  // Fetch events for task creation (Admin/Manager only)
  fetchEvents: async () => {
    try {
      const response = await axiosInstance.get("/tasks/events");
      if (response.data.success) {
        set({ events: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  },

  // Create new task (Admin/Manager only)
  createTask: async (taskData) => {
    const loadingToast = toast.loading("Creating task...");
    try {
      const response = await axiosInstance.post("/tasks", taskData);
      if (response.data.success) {
        toast.success("Task created successfully", { id: loadingToast });
        // Add new task to the list
        set((state) => ({
          tasks: [...state.tasks, response.data.data],
        }));
        return response.data.data;
      } else {
        toast.error(response.data.message, { id: loadingToast });
        return null;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task", { id: loadingToast });
      return null;
    }
  },

  // Update task (Admin/Manager only)
  updateTask: async (taskId, taskData) => {
    const loadingToast = toast.loading("Updating task...");
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
      if (response.data.success) {
        toast.success("Task updated successfully", { id: loadingToast });
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? response.data.data : task
          ),
        }));
        return response.data.data;
      } else {
        toast.error(response.data.message, { id: loadingToast });
        return null;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task", { id: loadingToast });
      return null;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
      if (response.data.success) {
        toast.success("Status updated successfully", { id: loadingToast });
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? response.data.data : task
          ),
        }));
        return response.data.data;
      } else {
        toast.error(response.data.message, { id: loadingToast });
        return null;
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error(error.response?.data?.message || "Failed to update status", { id: loadingToast });
      return null;
    }
  },

  // Delete task (soft delete - Admin/Manager only)
  deleteTask: async (taskId) => {
    const loadingToast = toast.loading("Deleting task...");
    try {
      const response = await axiosInstance.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        toast.success("Task deleted successfully", { id: loadingToast });
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== taskId),
        }));
        return true;
      } else {
        toast.error(response.data.message, { id: loadingToast });
        return false;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task", { id: loadingToast });
      return false;
    }
  },

  // Add comment to task
  addComment: async (taskId, comment) => {
    const loadingToast = toast.loading("Adding comment...");
    try {
      const response = await axiosInstance.post(`/tasks/${taskId}/comments`, { comment });
      if (response.data.success) {
        toast.success("Comment added", { id: loadingToast });
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? response.data.data : task
          ),
        }));
        return response.data.data;
      } else {
        toast.error(response.data.message, { id: loadingToast });
        return null;
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment", { id: loadingToast });
      return null;
    }
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  },

  // Get stats for dashboard
  getTaskStats: () => {
    const { tasks } = get();
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter(
      (t) => t.status !== "Completed" && new Date(t.dueDate) < new Date()
    ).length;

    return { total, pending, inProgress, completed, overdue };
  },
}));
