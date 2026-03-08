import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useBookingStore = create((set, get) => ({
    queries: [],
    pendingBookings: [],
    completedBookings: [],
    booked: [],
    selectedBooking: null,
    isLoading: false,
    
    // Fetch all queries
    fetchAllQueries: async () => {
        set({ isLoading: true })
        try {
            const responce = await axiosInstance.get('/booking/getQueries');
            set({ queries: responce.data.queries, isLoading: false })
        } catch (error) {
            console.log(error);
            toast.error("Error fetching queries")
            set({ isLoading: false })
        }
    },
    
    // Fetch all pending bookings
    fetchAllPendingBookings: async () => {
        set({ isLoading: true })
        try {
            const loadingToastId = toast.loading("Fetching pending bookings...");
            const responce = await axiosInstance.get('/booking/getPendingBookings')
            toast.success("Fetched pending bookings", { id: loadingToastId })
            set({ pendingBookings: responce.data.pendingBookings, isLoading: false })
        } catch (error) {
            console.log(error);
            toast.error("Error fetching pending bookings", { id: loadingToastId })
            set({ isLoading: false })
        }
    },
    
    // Fetch single booking by ID
    fetchBookingById: async (id) => {
        set({ isLoading: true })
        try {
            const response = await axiosInstance.get(`/booking/${id}`);
            set({ selectedBooking: response.data.booking, isLoading: false });
            return response.data.booking;
        } catch (error) {
            console.log(error);
            toast.error("Error fetching booking details");
            set({ isLoading: false });
            return null;
        }
    },
    
    // Reject booking
    rejectBooking: async (bookingId, reason) => {
        const loadingToast = toast.loading("Rejecting booking...")
        try {
            const response = await axiosInstance.post('/booking/reject', { bookingId, reason });
            toast.success("Booking rejected", { id: loadingToast })
            // Update local state
            set((state) => ({
                pendingBookings: state.pendingBookings.filter(b => b._id !== bookingId)
            }));
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error rejecting booking", { id: loadingToast });
            throw error;
        }
    },
    
    // Approve booking
    approveBooking: async (bookingId) => {
        const loadingToast = toast.loading("Approving booking...")
        try {
            const response = await axiosInstance.post('/booking/approve', { bookingId });
            toast.success("Booking approved", { id: loadingToast })
            // Update booking in local state
            set((state) => ({
                pendingBookings: state.pendingBookings.map(b => 
                    b._id === bookingId ? { ...b, status: "CONFIRMED" } : b
                )
            }));
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error approving booking", { id: loadingToast });
            throw error;
        }
    },
    
    // Assign staff to booking
    assignStaff: async (bookingId, staff) => {
        const loadingToast = toast.loading("Assigning staff...")
        try {
            const response = await axiosInstance.put(`/booking/${bookingId}/assign-staff`, staff);
            toast.success("Staff assigned successfully", { id: loadingToast })
            set({ selectedBooking: response.data.booking});
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error assigning staff", { id: loadingToast });
            throw error;
        }
    },
    
    // Assign goods to booking
    assignGoods: async (bookingId, goods) => {
        const loadingToast = toast.loading("Assigning goods...")
        try {
            const response = await axiosInstance.put(`/booking/${bookingId}/assign-goods`, { goods });
            toast.success("Goods assigned successfully", { id: loadingToast })
            set({ selectedBooking: response.data.booking});
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error assigning goods", { id: loadingToast });
            throw error;
        }
    },
    
    // Assign vehicles to booking
    assignVehicles: async (bookingId, vehicles) => {
        const loadingToast = toast.loading("Assigning vehicles...")
        try {
            const response = await axiosInstance.put(`/booking/${bookingId}/assign-vehicles`, { vehicles });
            toast.success("Vehicles assigned successfully", { id: loadingToast })
            set({ selectedBooking: response.data.booking});
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error assigning vehicles", { id: loadingToast });
            throw error;
        }
    },
    
    // Complete preparation
    completePreparation: async (bookingId) => {
        const loadingToast = toast.loading("Completing preparation...")
        try {
            const response = await axiosInstance.post(`/booking/${bookingId}/complete-preparation`);
            toast.success("Preparation completed. Manager task created.", { id: loadingToast })
            // Update booking status
            set((state) => ({
                pendingBookings: state.pendingBookings.map(b => 
                    b._id === bookingId ? { ...b, status: "PREPARATION_PENDING" } : b
                )
            }));
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error completing preparation", { id: loadingToast });
            throw error;
        }
    },
    
    // Update booking status
    updateBookingStatus: async (bookingId, status, notes) => {
        const loadingToast = toast.loading("Updating status...")
        try {
            const response = await axiosInstance.patch(`/booking/${bookingId}/status`, { status, notes });
            toast.success("Status updated", { id: loadingToast })
            
            // If completed, remove from appropriate list
            if (status === "COMPLETED") {
                set((state) => ({
                    pendingBookings: state.pendingBookings.filter(b => b._id !== bookingId),
                    booked: state.booked.filter(b => b._id !== bookingId)
                }));
            }
            
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error updating status", { id: loadingToast });
            throw error;
        }
    },
    
    // Fetch all booked events
    fetchAllBookedEvents: async () => {
        const loadingToast = toast.loading("Fetching booked events...")
        try {
            const responce = await axiosInstance.get('/booking/getAllBookedEvents');
            set({ booked: responce.data.bookedEvents })
            console.log("Booked", get().booked);
            toast.success("Fetched booked events", { id: loadingToast })
        } catch (error) {
            console.log(error);
            toast.error("Error fetching booked events", { id: loadingToast })
        }
    },
    
    // Confirm booking (legacy)
    confirmBooking: async (data) => {
        const loadingToast = toast.loading("Booking in progress...")
        try {
            const responce = await axiosInstance.post('/booking/confirmBooking', data)
            const pendingBookings = get().pendingBookings.filter(d => d._id != responce.data.refEvent)
            set({ pendingBookings: pendingBookings })
            toast.success("Event Booked Succesfully!", { id: loadingToast })
        } catch (error) {
            console.log(error);
            toast.error("Error Booking Event!", { id: loadingToast })
        }
    },
    
    // Fetch all completed bookings
    fetchAllCompletedBookings: async () => {
        const loadingToast = toast.loading("Fetching Data...")
        try {
            const res = await axiosInstance.get('/booking/getCompletedBookings')
            set({ completedBookings: res.data.data || [] })
            toast.success("Fetched Successfully!", { id: loadingToast })
        } catch (error) {
            console.log(error);
            toast.error("Error Fetching Data!", { id: loadingToast })
            set({ completedBookings: [] })
        }
    },
    
    // Update status and deposit (legacy)
    updateStautsAndDeposit: async (id, data) => {
        const loadingToast = toast.loading("Updating...")
        try {
            const res = await axiosInstance.patch(`/booking/updateStatus/${id}`, data)
            set((state) => ({
                completedBookings: state.completedBookings.map((b) =>
                    b._id === id ? res.data.data : b
                ),
            }));
            toast.success("Updated Successfully", { id: loadingToast })
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update", { id: loadingToast });
        }
    },

    // Fetch bookings by status (for manager dashboard)
    fetchBookingsByStatus: async (status) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/booking/by-status?status=${status}`);
            set({ isLoading: false });
            return response.data.bookings || [];
        } catch (error) {
            console.log(error);
            toast.error(`Error fetching ${status} bookings`);
            set({ isLoading: false });
            return [];
        }
    },

    // Update booking status
    updateBookingStatus: async (id, status, notes) => {
        const loadingToast = toast.loading(`Updating status to ${status}...`);
        try {
            const response = await axiosInstance.patch(`/booking/${id}/status`, { status, notes });
            toast.success(`Status updated to ${status}`, { id: loadingToast });
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || `Error updating status`, { id: loadingToast });
            throw error;
        }
    },

    // Fetch active events for ticket linking
    fetchActiveEvents: async () => {
        try {
            const response = await axiosInstance.get('/booking/active-events');
            return response.data.events || [];
        } catch (error) {
            console.log(error);
            toast.error("Error fetching active events");
            return [];
        }
    }
}))
