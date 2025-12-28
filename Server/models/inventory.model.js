import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: ["vegetables", "groceries", "dairy"],
      required: true
    },

    unit_cost: { type: Number, required: true },
    supplierName: { type: String, required: true },

    current_stock: { type: Number, default: 0 },
    total_stock: { type: Number, default: 0 },
    min_stock: { type: Number, required: true },

    status: {
      type: String,
      enum: ["in-stock", "limited-stock", "out-of-stock"],
      default: "in-stock"
    }
  },
  { timestamps: true }
);

InventoryItemSchema.pre("save", function (next) {
  if (this.current_stock <= 0) {
    this.status = "out-of-stock";
  } else if (this.current_stock <= this.min_stock) {
    this.status = "limited-stock";
  } else {
    this.status = "in-stock";
  }
  next();
});
InventoryItemSchema.methods.addStock = function (addedStock) {
  const stock = Number(addedStock);

  this.current_stock += stock;
  this.total_stock += stock;

  return this.save();
};


export default mongoose.model("InventoryItem", InventoryItemSchema);
