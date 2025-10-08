import mongoose from "mongoose";

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

        // 📍 Venue & Notes


        // ⚙️ Priority & Estimated Budget
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium",
        },
        estimatedAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        // 🍽️ Menu Section (Array-based)
        menu: {
            starters: [{ type: String, trim: true }],
            maincourse: [{ type: String, trim: true }],
            beverages: [{ type: String, trim: true }],
            desserts: [{ type: String, trim: true }],
        },

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
        status: {
            type: String,
            enum: ["Pending", "Approved", "Declined"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

// 🧠 Auto-generate Booking ID before save (PBK-0001)
pendingBookingSchema.pre("save", async function (next) {
    if (!this.bookingId) {
        const count = await mongoose.model("PendingBooking").countDocuments();
        this.bookingId = `PBK-${(count + 1).toString().padStart(4, "0")}`;
    }
    next();
});

const pendingBooking = mongoose.model("PendingBooking", pendingBookingSchema);

export default pendingBooking
