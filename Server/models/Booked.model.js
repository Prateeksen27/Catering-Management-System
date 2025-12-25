import mongoose from 'mongoose';

const BookedSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
  },
  deposited: {
    type: Number,
    default: 0,

  },
  eventDate: {
    type: Date,
  },
  eventTime: {
    type: String,
  },
  venue: {
    type: String,

    trim: true
  },
  pax: {
    type: Number,
    default: 0
  },
  menu: {
    starters: [{ type: String, trim: true }],
    maincourse: [{ type: String, trim: true }],
    beverages: [{ type: String, trim: true }],
    desserts: [{ type: String, trim: true }],
  },
  bookingId: {
    type: String,
    unique: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Confirmed", "In Progress", "Cancelled"],
    default: "Confirmed",
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Partially Paid", "Unpaid"],
    default: "Unpaid",
  },
  paymentDetails: {
    totalPaid: { type: Number, default: 0 },
    paymentMethod: { type: String, trim: true },
    transactionId: { type: String, trim: true },
    fullyPaid: { type: Boolean, default: false }
  },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  assignedChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  assignedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],

  // 🪑 Goods used in this booking
  goodsUsed: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "StoreItem" },
      itemName: { type: String, trim: true },
      quantity: { type: Number, default: 0 },
    },
  ],

  // 🧩 Reference to pending booking to avoid duplicates
  refEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PendingBooking",
    required: true,
  },
  timeline: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      notes: String,
    },
  ],
}
  , { timestamps: true });

BookedSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const lastBooking = await this.constructor.findOne().sort({ createdAt: -1 });
    let newNumber = 1;
    if(this.paymentDetails.totalPaid >= this.totalAmount){
      this.paymentStatus = "Paid";
      this.paymentDetails.fullyPaid = true;
    }
    this.deposited = this.paymentDetails.totalPaid;

    if (lastBooking && lastBooking.bookingId) {
      const lastNum = parseInt(lastBooking.bookingId.replace("BOOK", ""), 10);
      newNumber = lastNum + 1;
    }

    this.bookingId = `BOOK${String(newNumber).padStart(4, "0")}`;
  }

  // Auto-calculate balance
  this.balance = Math.max(this.totalAmount - this.deposited, 0);

  next();
});

const Booked = mongoose.model("Booked", BookedSchema);
export default Booked;