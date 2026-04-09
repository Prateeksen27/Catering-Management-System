import mongoose from 'mongoose'

// Ingredient ratio schema for automatic grocery calculation
const ingredientRatioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantityPerPerson: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'litres', 'ml', 'pieces', 'dozen', 'packets', 'units']
    },
    category: {
        type: String,
        enum: ['protein', 'vegetables', 'dairy', 'oils', 'spices', 'grains', 'beverages', 'other'],
        default: 'other'
    }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    smallDesc:{
        type:String,
        required:true,
        trim:true
    },
    perServingAmount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:["veg","non-veg"]
    },
    category:{
        type:String,
        enum:["appetizers", "mains", "desserts", "beverages"],
        required:true
    },
    // 🌿 Ingredient ratios for automatic grocery calculation
    ingredientRatios: [ingredientRatioSchema],
    
    // Base quantity for estimation (serves how many people by default)
    baseServings: {
        type: Number,
        default: 1
    },
    
    // Is this item available for auto-calculation?
    autoCalculateEnabled: {
        type: Boolean,
        default: true
    }
},{
    timestamps:true
});

// Add indexes before creating model
menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ type: 1 });

const MenuItem = mongoose.model("MenuItem",menuItemSchema)

export default MenuItem