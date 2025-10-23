import Booked from "../models/Booked.model.js";
import pendingBooking from "../models/pendingBooking.model.js";
import query from "../models/query.model.js"
import { StoreItem } from "../models/store.model.js";
import Employee from "../models/user.model.js";
import vechileModel from "../models/vechile.model.js";

export const getAllQueries = async (req, res) => {
    try {
        const queries = await query.find().sort({ createdAt: -1 });
        res.status(200).json({ queries });
    } catch (error) {
        console.log("Error Fetching queries", error);
        res.status(500).json({ message: "Internal Server error" })

    }
}

export const getAllPendinBookings = async (req, res) => {
    try {
        const pendingBookings = await pendingBooking.find().sort({ createdAt: -1 });
        res.status(201).json({ pendingBookings })
    } catch (error) {
        console.log("Error Fetching pending bookings", error);
        res.status(500).json({ message: "Internal server error" })

    }
}

export const confirmBooking = async (req, res) => {
  try {
    const { eventData, goods = {}, staff = {}, vehicles = [] } = req.body;

    // ✅ Validate input
    if (!eventData?._id) {
      return res.status(400).json({ error: "Missing event data or reference ID" });
    }

    // ✅ Check for existing completed booking before deleting pending one
    const existingBooking = await Booked.findOne({ refEvent: eventData._id });
    if (existingBooking) {
      return res.status(400).json({ error: "A booking for this event already exists." });
    }

    // ✅ Safely delete pending booking (after validation)
    await pendingBooking.findByIdAndDelete(eventData._id);

    const {
      _id: refEvent,
      name: clientName,
      eventName,
      phone,
      eventDate,
      eventTime,
      venue,
      pax,
      totalAmount,
      menu,
    } = eventData;

    // ✅ Combine all goods
    const allGoods = [
      ...(goods.equipment || []),
      ...(goods.supplies || []),
      ...(goods.furniture || []),
    ];

    // ✅ Deduct stock in parallel
    const stockUpdates = allGoods.map((g) =>
      StoreItem.findByIdAndUpdate(
        g.itemId,
        { $inc: { current_stock: -g.quantity } },
        { new: true }
      )
    );

    // ✅ Combine all staff IDs
    const allStaff = [
      ...(staff.manager || []),
      ...(staff.worker || []),
      ...(staff.driver || []),
      ...(staff.chef || []),
    ];

    // ✅ Parallel updates for performance
    const updates = [
      ...stockUpdates,
      Employee.updateMany(
        { _id: { $in: allStaff } },
        { $set: { assignedProject: eventName, status: "Assigned" } }
      ),
    ];

    // ✅ Vehicle update (if provided)
    if (vehicles.length > 0) {
      updates.push(
        vechileModel.updateMany(
          { _id: { $in: vehicles } },
          { $set: { assignedEvent: eventName, status: "assigned" } }
        )
      );
    }

    await Promise.all(updates);

    // ✅ Create the completed booking record
    const completedBooking = await Booked.create({
      eventName,
      clientName,
      phone,
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      eventTime,
      pax: pax || 0,
      totalAmount: totalAmount || 0,
      fromDate: new Date(),
      toDate: new Date(),
      venue: venue || "N/A",
      guests: pax || 0,
      menu: menu || [],
      assignedStaff: [...(staff.manager || []), ...(staff.worker || []), ...(staff.driver || [])],
      assignedChefs: staff.chef || [],
      assignedVehicles: vehicles,
      goodsUsed: allGoods.map((g) => ({
        itemId: g.itemId,
        itemName: g.itemName,
        quantity: g.quantity,
      })),
      refEvent,
      timeline: [{ action: "Marked as completed", timestamp: new Date() }],
    });

    return res.status(201).json({
      message: "✅ Completed booking created successfully",
      completedBooking,
    });
  } catch (error) {
    console.error("❌ Error creating completed booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getAllBookedEvents = async (req,res)=>{
    try {
        const responce = await Booked.find().sort({ createdAt: -1 });
        res.status(201).json({responce})
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal Server Error"
        })
        
        
    }
}