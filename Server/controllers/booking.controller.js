import pendingBooking from "../models/pendingBooking.model.js";
import query from "../models/query.model.js"

export const getAllQueries = async (req,res)=>{
    try {
        const queries = await query.find().sort({createdAt:-1});
        res.status(200).json({queries});
    } catch (error) {
        console.log("Error Fetching queries",error);
        res.status(500).json({message:"Internal Server error"})
        
    }
}

export const getAllPendinBookings = async (req,res)=>{
    try {
        const pendingBookings = await pendingBooking.find().sort({createdAt:-1});
        res.status(201).json({pendingBookings})
    } catch (error) {
        console.log("Error Fetching pending bookings",error);
        res.status(500).json({message:"Internal server error"})
        
    }
}