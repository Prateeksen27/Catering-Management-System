import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useBookingStore = create((set,get) => ({
    queries: [],
    pendingBookings: [],
    booked: [],
    isLoading: false,
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
    fetchAllPendingBookings: async () => {
        set({ isLoading: true })
        try {
            const responce = await axiosInstance.get('/booking/getPendingBookings')
            set({ pendingBookings: responce.data.pendingBookings, isLoading: false })
        } catch (error) {
            console.log(error);
            toast.error("Error fetching pending bookings")
            set({ isLoading: false })
        }
    },
    confirmBooking: async (data) => {
        const loadingToast = toast.loading("Confirming booking...")
        try {
            const responce = await axiosInstance.post('/booking/confirmBooking', data);
            toast.success("Booking confirmed", { id: loadingToast })
        } catch (error) {
            console.log(error);
            toast.error("Error confirming booking", { id: loadingToast })

        }
    },
    fetchAllBookedEvents: async () => {
        const loadingToast = toast.loading("Fetching booked events...")
        try {
            const responce = await axiosInstance.get('/booking/getAllBookedEvents');
            set({ booked: responce.data.responce })
          console.log("Booked",get().booked);
            toast.success("Fetched booked events", { id: loadingToast })
        } catch (error) {
            console.log(error);
            toast.error("Error fetching booked events", { id: loadingToast })

        }
    },
    confirmBooking:async (data)=>{
        const loadingToast = toast.loading("Booking in progress...")
        try {
            const responce = await axiosInstance.post('/booking/confirmBooking',data)
            const pendingBookings = get().pendingBookings.filter(d=>d._id!=responce.data.refEvent)
            set({pendingBookings:pendingBookings})
            toast.success("Event Booked Succesfully!",{id:loadingToast})

        } catch (error) {
            console.log(error);
            toast.error("Error Booking Event!",{id:loadingToast})
            
            
        }
    }
}))
