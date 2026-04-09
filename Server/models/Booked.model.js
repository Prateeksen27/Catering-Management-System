import mongoose from 'mongoose';
import { generateBookingId } from '../utils/idGenerator.js';

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
    enum: ["PENDING_REVIEW", "REJECTED", "CONFIRMED", "PREPARATION_PENDING", "REQUIREMENT_SUBMITTED", "READY_FOR_EVENT", "IN_PROGRESS", "COMPLETED"],
    default: "CONFIRMED",
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Partially Paid", "Unpaid"],
    default: "Unpaid",
  },
  balance: {
    type: Number,
    default: 0,
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

  // 👨‍🍳 Structured Assigned Staff
  assignedStaffDetails: {
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    chefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },

  // 🧽 Goods used in this booking
  goodsUsed: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "StoreItem" },
      itemName: { type: String, trim: true },
      category: String,
      quantity: { type: Number, default: 0 },
    },
  ],

  // 🔧 Requirement Status
  requirementStatus: {
    type: String,
    enum: ["Pending", "Submitted"],
    default: "Pending",
  },

  // 📝 Chef Grocery Requirements Reference
  chefRequirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChefRequirement",
  },

  // 🧩 Reference to pending booking to avoid duplicates
  refEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PendingBooking",
  },
  
  // 📅 Enhanced Timeline with performer info
  timeline: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      performedBy: { type: String, default: "System" },
      notes: String,
    },
  ],
}
  , { timestamps: true });

// Add indexes (bookingId already has unique:true in schema)
BookedSchema.index({ eventDate: 1 });
BookedSchema.index({ bookingStatus: 1 });
BookedSchema.index({ 'assignedStaffDetails.workers': 1 });
BookedSchema.index({ 'assignedStaffDetails.chefs': 1 });
BookedSchema.index({ 'assignedVehicles': 1 });

BookedSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    this.bookingId = await generateBookingId('BOOK');

    if(this.paymentDetails.totalPaid >= this.totalAmount){
      this.paymentStatus = "Paid";
      this.paymentDetails.fullyPaid = true;
    }
    this.deposited = this.paymentDetails.totalPaid;
  }

  // Auto-calculate balance
  this.balance = Math.max((this.totalAmount || 0) - (this.deposited || 0), 0);

  next();
});

const Booked = mongoose.model("Booked", BookedSchema);
export default Booked;