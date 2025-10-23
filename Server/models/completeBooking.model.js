import mongoose from "mongoose";

const completedSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true,
        trim:true,
    },
    clientName:{
        type:String,
        required:true,
        trim:true,
    },
    customerRating:{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
    feedback:{
        type:String,
        default:"",
    },
    completionDate:{
        type:Date,
        required:true,
    },
    menuDelivered:{
        type:String,
        required:true,
    },
    bookingId: {
    type: String,
    unique: true,
    },
    paymentType:{
        type:String,
        enum:["Fully Paid","Partially Paid","Not Paid"],
        default:"Not Paid",
    },
    completionReport:{
        type:String,
    },
    serviceIssues:{
        type:String,
    }

}, {timestamps:true});

completedSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const lastBooking = await this.constructor.findOne().sort({ createdAt: -1 });
    let newNumber = 1;

    if (lastBooking && lastBooking.bookingId) {
      const lastNum = parseInt(lastBooking.bookingId.replace("COM", ""), 10);
      newNumber = lastNum + 1;
    }

    this.bookingId = `COM${String(newNumber).padStart(4, "0")}`;
  }

  // Auto-calculate balance
  this.balance = Math.max(this.totalAmount - this.deposited, 0);

  next();
});

const Completed = mongoose.model("Completed",completedSchema);
export default Completed;