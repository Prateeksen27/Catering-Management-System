import Employee from "../models/user.model.js"

export const fetchAllEmployees = async(req,res)=>{
    try {
        const allEmployees = await Employee.find()
        res.status(200).json({allEmployees})
    } catch (error) {
        console.log("Error Fetching Employees",error);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}