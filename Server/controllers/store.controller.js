import { StoreItem } from "../models/store.model.js"

export const createStoreItem = async (req, res) => {
    try {
        const item = new StoreItem(req.body)
        await item.save();
        res.status(201).json({ success: true, data: item })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getAllStoreItems = async (req, res) => {
    try {
        const items = await StoreItem.find().sort({ createdAt: -1 })
        const groupStore = {
            equipment:items.filter(i=>i.category==="equipment"),
            supplies:items.filter(i=>i.category==="supplies"),
            furniture:items.filter(i=>i.category==="furniture")
        }
        res.status(200).json({ success: true, data: groupStore })
    } catch (error) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const updateStoreItem = async (req, res) => {
    try {
        const updatedItem = await StoreItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        await updatedItem.save();
        res.status(200).json({ success: true, data: updatedItem });

    } catch (error) {
        console.log("Error While updating store item", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}


export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { addedStock,current_stock } = req.body
        const item = await StoreItem.findById(id);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        item.current_stock = current_stock;
        await item.addStock(addedStock);
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const deleteStoreItem = async (req,res)=>{
    try {
        const item = await StoreItem.findByIdAndDelete(req.params.id)
        if(!item){
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: err.message });
    }
}