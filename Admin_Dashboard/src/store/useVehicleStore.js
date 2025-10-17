import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useVehicleStore = create((set,get)=>({
    vehicles:[],
    fetchVehicles: async (query={})=>{
        try {
            const loadingToast = toast.loading("Fetching vehicles...");
            // const params = new URLSearchParams(query).toString();
            const res = await axiosInstance.get(`/vehicle/getVehicles`);
            set({vehicles: res.data.data});
            toast.success("Vehicles fetched successfully",{id:loadingToast});
        } catch (error) {
            console.log("Error fetching vehicles",error);
            toast.error("Failed to fetch vehicles",{id:loadingToast});
        }
    },
    updateVehicle: async (id,updatedData)=>{
        try {
            const loadingToast = toast.loading("Updating vehicle...");
            const res = await axiosInstance.put(`/vehicle/updateVehicle/${id}`,updatedData);
            const updatedVehicle = res.data.data;
            const vehicles = get().vehicles.map(v=> v._id === id ? updatedVehicle : v);
            set({vehicles});
            toast.success("Vehicle updated successfully",{id:loadingToast});
        } catch (error) {
            console.log("Error updating vehicle",error);
            toast.error("Failed to update vehicle",{id:loadingToast});
        }
    },
    deleteVehicle:async (id)=>{
        try {
            const loadingToast = toast.loading("Deleting vehicle...");
            await axiosInstance.delete(`/vehicle/deleteVehicle/${id}`);
            const vehicles = get().vehicles.filter(v=> v._id !== id);
            set({vehicles});
            toast.success("Vehicle deleted successfully",{id:loadingToast});
        } catch (error) {
            console.log("Error deleting vehicle",error);
            toast.error("Failed to delete vehicle",{id:loadingToast});
        
        }
    },
    createVehicle: async (vehicleData)=>{
        try {
            const loadingToast = toast.loading("Creating vehicle...");
            const res = await axiosInstance.post(`/vehicle/createVehicle`,vehicleData);
            const newVehicle = res.data.data;
            const vehicles = [newVehicle, ...get().vehicles];
            set({vehicles});
            toast.success("Vehicle created successfully",{id:loadingToast});
        } catch (error) {
            console.log("Error creating vehicle",error);
            toast.error("Failed to create vehicle",{id:loadingToast});
        }
    }
}))