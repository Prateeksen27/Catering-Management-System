import mongoose from "mongoose";

const storeItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String, // you’ll handle enum later,
    required:true,
    enum: ["Photography","Audio Equipment","Lighting","Event Setup","Decoration","Catering Supplies","Tables","Seating"],
  },

  current_stock: {
    type: Number,
    required: true,
    min: 0,
  },

  unit_cost: {
    type: Number,
    required: true,
    min: 0,
  },

  supplierName: {
    type: String,
    required: true,
    trim: true,
  },

  last_restocked: {
    type: Date,
    default: Date.now,
  },

  min_stock: {
    type: Number,
    default: 0,
  },

  total_value: {
    type: Number,
    default: 0,
  },

  total_stock: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["in-stock", "limited-stock", "out-of-stock"],
    default: "in-stock",
  },

  category: {
    type: String,
    enum: ["equipment", "supplies", "furniture"],
    required: true,
  },
});

// 🧮 Auto-calculate total_value and update status before saving
storeItemSchema.pre("save", function (next) {
  this.total_value = this.current_stock * this.unit_cost;
  this.total_stock = Math.max(this.current_stock,this.total_stock)
  if (this.current_stock === 0) {
    this.status = "out-of-stock";
  } else if (this.current_stock <= this.min_stock) {
    this.status = "limited-stock";
  } else {
    this.status = "in-stock";
  }

  next();
});

// 🧩 Helper method to add stock
storeItemSchema.methods.addStock = function (addedStock) {
  this.total_stock += addedStock;
  this.current_stock += addedStock;
  this.last_restocked = Date.now();
  return this.save();
};

export const StoreItem = mongoose.model("StoreItem", storeItemSchema);
