import inventoryModel from "../models/inventory.model.js"

export const getInventoryItems = async (req,res)=>{
    const items = await inventoryModel.find();
    const inventory = {
        vegetables:[],
        groceries:[],
        dairy:[]
    }
    items.forEach(item=>{
        inventory[item.category].push(item)
    })
    res.json({inventory}); 
}
export const createInventoryItem = async (req,res)=>{
    const {name,category,unit_cost,supplierName,current_stock,min_stock} = req.body;
    try{
        const newItem = new inventoryModel({
            name,
            category,
            unit_cost,
            supplierName,
            current_stock,
            min_stock
        })
        await newItem.save();
        res.status(201).json({message:"Inventory Item Created Successfully"})
    }catch(err){
        res.status(500).json({message:"Server Error"})
    }
}
export const updateInventoryItem = async (req,res)=>{
    const {id} = req.params;
    const {name,category,unit_cost,supplierName,min_stock} = req.body;
    try{
        const item = await inventoryModel.findById(id);
        if(!item){
            return res.status(404).json({message:"Inventory Item Not Found"})
        }
        item.name = name;
        item.category = category;
        item.unit_cost = unit_cost;
        item.supplierName = supplierName;
        item.min_stock = min_stock;
        await item.save();
        res.json({message:"Inventory Item Updated Successfully"})
    }catch(err){
        res.status(500).json({message:"Server Error"})
    }       
}
export const updateInventoryStock = async (req,res)=>{
    const {id} = req.params;
    const {addedStock} = req.body;
    try{
        const item = await inventoryModel.findById(id);
        if(!item){
            return res.status(404).json({message:"Inventory Item Not Found"})
        }
        await item.addStock(addedStock);
        res.json({message:"Inventory Stock Updated Successfully"})
    }catch(err){
        res.status(500).json({message:"Server Error"})
    }
}
