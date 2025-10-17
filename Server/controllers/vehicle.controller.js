import vechileModel from "../models/vechile.model.js";

export const listVehicles = async (req,res)=>{
    try {
        const {status, search} = req.query;
        const filter = {};
        if(status){
            filter.status = status;
        }
        if(search){
            filter.$or = [
                {plateNumber: new RegExp(search,'i')},
                {model: new RegExp(search,'i')},
                {manufacturer: new RegExp(search,'i')}
            ];
        }
        const vehicles = await vechileModel.find(filter);
        return res.status(200).json({
            success: true,
            data: vehicles
        })
    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        
    }
}

export const getVehicle = async (req,res)=>{
    try {
        const vehicle = await vechileModel.findById(req.params.id).lean();
        if(!vehicle){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: vehicle
        })
    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const createVehicle = async (req,res)=>{
    try {
        const data = req.body;
        const newVehicle = new vechileModel(data);
        await newVehicle.save();
        return res.status(201).json({
            success: true,
            data: newVehicle
        })
    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        
    }
}

export const updateVehicle = async (req,res)=>{
    try {
        const data = req.body;
        const updatedVehicle = await vechileModel.findByIdAndUpdate(req.params.id, data, {new: true});
        if(!updatedVehicle){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }   
        return res.status(200).json({
            success: true,
            data: updatedVehicle
        })
    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }}

export const deleteVehicle = async (req,res)=>{
    try {
        const deletedVehicle = await vechileModel.findByIdAndDelete(req.params.id);
        if(!deletedVehicle){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })
    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}