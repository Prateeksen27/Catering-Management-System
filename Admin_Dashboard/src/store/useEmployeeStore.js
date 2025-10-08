import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useEmployeeStore = create((set) => ({
    employees: [],
    isLoading: false,
    createNewEmployee: async (data) => {
        try {
            const responce = axiosInstance.post('/auth/register', data)
            await toast.promise(
                responce, {
                loading: "Adding...please don't refresh",
                success: "Employee Added Successfully",
                error: (err) =>
                    err.response?.data?.message || "Something went wrong. Try again!"
            }
            )
        } catch (error) {
            console.log("Employee Error", error);
            // toast.error(error.responce?.data?.message || "Unexpected error occur")

        }
    },
    fetchAllEmployees: async (data) => {
        try {
            set({ isLoading: true })
            const responce = await axiosInstance.get('/employees/fetchEmployees');
            set({ employees: responce.data.allEmployees, isLoading: false })
        } catch (error) {
            console.log("Employee Fetching Error"+error);
            toast.error("Error Fetching employee details")
            set({isLoading:false})
            
        }
    }
}))