import mongoose from "mongoose";

const personalDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const eventDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Birthday Party
  guests: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  venue: { type: String, required: true },
  notes: { type: String },
});

const menuDetailsSchema = new mongoose.Schema({
  starters: [{ type: String }],
  maincourse: [{ type: String }],
  beverages: [{ type: String }],
  desserts: [{ type: String }],
});

const cateringBookingSchema = new mongoose.Schema(
  {
    personalDetails: { type: personalDetailsSchema, required: true },
    eventDetails: { type: eventDetailsSchema, required: true },
    menuDetails: { type: menuDetailsSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CateringBooking", cateringBookingSchema);
