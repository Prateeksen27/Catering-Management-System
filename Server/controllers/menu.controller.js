import menuSchema from "../models/menu.model.js";


// ➕ Add a new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, smallDesc, perServingAmount, type, category } = req.body;
    const newItem = await menuSchema.create({ name, smallDesc, perServingAmount, type, category });
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📜 Get all menu items (grouped by category)
export const getMenu = async (req, res) => {
  try {
    const items = await menuSchema.find();
    const groupedMenu = {
      appetizers: items.filter(i => i.category === "appetizers"),
      mains: items.filter(i => i.category === "mains"),
      desserts: items.filter(i => i.category === "desserts"),
      beverages: items.filter(i => i.category === "beverages")
    };
    res.status(200).json({ success: true, data: groupedMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Delete an item
export const deleteMenuItem = async (req, res) => {
  try {
    await menuSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body

    const updatedItem = await menuSchema.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    })
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
}