import mongoose from 'mongoose'
const querySchema = new mongoose.Schema({
  clientName:{
    type:String,
    required:true,
    trim:true
  },
  eventName:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true
  },
  phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Phone number must be 10 digits",
      },
      default:"0000000000"
    },eventDate:{
         type: Date,
    },
    budget:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    pax:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["New","Contacted"],
        default:"New"
    }
},{
    timestamps:true
})

const query = mongoose.model('Query',querySchema)
export default query;