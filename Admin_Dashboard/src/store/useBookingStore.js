import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useBookingStore = create((set)=>({
    queries:[],
    pendingBookings:[],
    isLoading:false,
    fetchAllQueries:async ()=>{
        set({isLoading:true})
        try {
            const responce = await axiosInstance.get('/booking/getQueries');
            set({queries:responce.data.queries,isLoading:false})
        } catch (error) {
            console.log(error);
            toast.error("Error fetching queries")
            set({isLoading:false})
            
        }
    },
    fetchAllPendingBookings:async ()=>{
        set({isLoading:true})
        try {
            const responce = await axiosInstance.get('/booking/getPendingBookings')
            set({pendingBookings:responce.data.pendingBookings,isLoading:false})
        } catch (error) {
             console.log(error);
            toast.error("Error fetching pending bookings")
            set({isLoading:false})
        }
    }
}))