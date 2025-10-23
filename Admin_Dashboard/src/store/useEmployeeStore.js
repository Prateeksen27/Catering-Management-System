import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { assignRef } from "@mantine/hooks";

export const useEmployeeStore = create((set) => ({
    employees: [],
    employeesGrouped: {},
    isLoading: false,
    assignedEvents:[],
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
    },
    deleteEmployee:async (id)=>{
        const loadingToastId = toast.loading("Deleting...please don't refresh");
        try {
            const responce = await axiosInstance.delete(`/employees/deleteEmployee/${id}`);
            toast.success("Employee Deleted Successfully", { id: loadingToastId });
            set((state) => ({
                employees: state.employees.filter((emp) => emp._id !== id)
            }));
        } catch (error) {
            console.log("Employee Deletion Error", error);
            toast.error(error.response?.data?.message || "Error Deleting Employee", { id: loadingToastId });
        }
    },

    fetchEmployeesGrouped:async()=>{
        try {
            const res = await axiosInstance.get('/employees/grouped');
            set({employeesGrouped:res.data.data});
        } catch (error) {
            toast.error("Failed to fetch Staff ❌");
        }
    },

    assignStaff: async(data)=>{
        set({isLoading:true});
        const toastId = toast.loading("Assigning staff...");
        try {
        const res = await axiosInstance.post(`/employees/assign`, data);
        toast.success("Staff assigned successfully ✅", { id: toastId });
        set({ isLoading: false });
        return res.data;
        } catch (err) {
            console.error("Error assigning staff:", err);
            toast.error(
            err.response?.data?.message || "Error assigning staff",
            { id: toastId }
        );
        set({ isLoading: false });
        throw err;
        }
    },
    fetchAllAssignedEvents:async (id)=>{
        const loadingToast = toast.loading("Events Loading please wait...")
        try {
            const res = await axiosInstance.get(`/employees/${id}/events`);
            set({assignedEvents:res.data.events})
            toast.success("Events Fetched Successfully!",{id:loadingToast})

        } catch (error) {
            console.log(error);
            toast.error("Error fetching events!",{id:loadingToast})
        }
    }
}));
