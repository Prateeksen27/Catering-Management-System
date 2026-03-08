import mongoose from "mongoose";
import { generateBookingId } from "../utils/idGenerator.js";

const pendingBookingSchema = new mongoose.Schema(
    {
        // 🎉 Event Info
        eventDetails: {
            eventName: {
                type: String,
                required: true,
                trim: true,
            },
            eventDate: {
                type: Date,
                required: true
            },
            eventTime: {

            },
            pax: {
                type: Number,
                required: true
            },
            venue: {
                type: String,
                required: true,
                trim: true,
            },
            notes: {
                type: String,
                trim: true,
            }
        },

        // 👤 Client Details
        clientDetails: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },

        // ⚙️ Priority & Estimated Budget
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium",
        },
        
        // 💰 Payment Details
        Payment_Details: {
            estimatedAmount: {
                type: Number,
                required: true,
                min: 0,
            },
            paidAmount: {
                type: Number,
                default: 0,
                min: 0,
            },
            paymentMethods: {
                type: String,
                default: 'other'
            },
            transactionId: { type: String, trim: true }
        },

        // 🍽️ Menu Section (Array-based)
        menu: {
            starters: [{ type: String, trim: true }],
            maincourse: [{ type: String, trim: true }],
            beverages: [{ type: String, trim: true }],
            desserts: [{ type: String, trim: true }],
        },
        
        customMenuItems: [
            {
                name: String,
                category: {
                    type: String,
                    required: true,
                    enum: ["starters", "maincourse", "beverages", "desserts","appetizers"],
                }
            }
        ],

        // 🧾 Booking Info
        bookingId: {
            type: String,
            unique: true,
        },
        declineReason: {
            type: String,
            trim: true,
        },

        // 👨‍💼 Management
        managerAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        
        // 📊 Booking Status Lifecycle
        status: {
            type: String,
            enum: ["PENDING_REVIEW", "REJECTED", "CONFIRMED", "PREPARATION_PENDING", "REQUIREMENT_SUBMITTED", "READY_FOR_EVENT", "IN_PROGRESS", "COMPLETED"],
            default: "PENDING_REVIEW",
        },

        // 📅 Event Timeline
        timeline: [
            {
                action: String,
                timestamp: { type: Date, default: Date.now },
                performedBy: { type: String, default: "System" },
                notes: String,
            },
        ],

        // 👨‍🍳 Assigned Staff
        assignedStaff: {
            manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
            workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
            chefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
            drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
        },

        // 🧽 Assigned Goods/Equipment
        assignedGoods: [
            {
                itemId: { type: mongoose.Schema.Types.ObjectId, ref: "StoreItem" },
                itemName: String,
                category: String,
                quantity: Number,
            },
        ],

        // 🚗 Assigned Vehicles
        assignedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],

        // 🔧 Requirement Status
        requirementStatus: {
            type: String,
            enum: ["Pending", "Submitted"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

pendingBookingSchema.index({ 'eventDetails.eventDate': 1 });
pendingBookingSchema.index({ status: 1 });
pendingBookingSchema.index({ 'assignedStaff.workers': 1 });
pendingBookingSchema.index({ 'assignedStaff.chefs': 1 });
pendingBookingSchema.index({ 'assignedVehicles': 1 });

// 🧠 Auto-generate Booking ID before save (PBK-0001)
pendingBookingSchema.pre("save", async function (next) {
    if (!this.bookingId) {
        this.bookingId = await generateBookingId('PBK');
    }
    next();
});

const pendingBooking = mongoose.model("PendingBooking", pendingBookingSchema);

export default pendingBooking;
