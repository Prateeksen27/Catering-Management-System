import mongoose from 'mongoose'
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
    }
},{
    timestamps:true
});

const menuSchema = mongoose.model("MenuItem",menuItemSchema)

export default menuSchema