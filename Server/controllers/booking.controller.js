import Booked from "../models/Booked.model.js";
import Completed from "../models/completeBooking.model.js";
import pendingBooking from "../models/pendingBooking.model.js";
import query from "../models/query.model.js"
import { StoreItem } from "../models/store.model.js";
import Employee from "../models/user.model.js";
import vechileModel from "../models/vechile.model.js";
import Ticket from "../models/ticket.model.js";

// Import utilities
import { 
  validateStatusTransition, 
  BOOKING_STATUS,
  getStatusProgress,
  getStatusLabel,
  getAvailableActions
} from "../utils/statusValidation.js";

import { 
  addTimelineEntry, 
  TIMELINE_ACTIONS,
  getTimelineSummary
} from "../utils/timelineUtils.js";

import { 
  lockStaff, 
  lockVehicles, 
  releaseStaff, 
  releaseVehicles,
  getLockedResources
} from "../utils/resourceLocking.js";

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
    const pendingBookingRecord = await pendingBooking.findById(eventData._id);
    if (!pendingBookingRecord) {
      return res.status(404).json({ error: "Pending booking not found." });
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
    await Promise.all(stockUpdates);

    // ✅ Create completed booking
    const completedBooking = await Completed.create({
      clientName,
      phone,
      eventName,
      eventDate,
      eventTime,
      venue,
      pax,
      menuDelivered: menu,
      totalAmount,
      paymentStatus: "Pending",
    });

    // ✅ Save to Booked collection
    const bookedEvent = await Booked.create({
      eventName,
      clientName,
      phone,
      eventDate,
      eventTime,
      venue,
      pax,
      totalAmount,
      menu,
      assignedStaffDetails: staff,
      assignedVehicles: vehicles,
      assignedGoods: allGoods,
      refEvent,
      bookingStatus: "Approved",
    });

    // ✅ Respond with success
    res.status(201).json({
      message: "Booking confirmed successfully",
      bookedEvent,
      completedBooking,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ message: "Error confirming booking" });
  }
};

export const getAllBookedEvents = async (req, res) => {
  try {
    const bookedEvents = await Booked.find().sort({ createdAt: -1 });
    res.status(200).json({ bookedEvents });
  } catch (error) {
    console.log("Error Fetching booked events", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCompletedEvents = async (req, res) => {
  try {
    const completedEvents = await Completed.find().sort({ createdAt: -1 });
    res.status(200).json({ completedEvents });
  } catch (error) {
    console.log("Error Fetching completed events", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// NEW EVENT LIFECYCLE MANAGEMENT FUNCTIONS
// ============================================

// @desc    Reject a booking
// @route   POST /api/booking/reject
// @access  Admin
export const rejectBooking = async (req, res) => {
  try {
    console.log("Reject Payload:", req.body);
    
    const { bookingId, reason } = req.body;

    // Add validation
    if (!bookingId || !reason) {
      return res.status(400).json({
        message: "bookingId and reason are required"
      });
    }

    const booking = await pendingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION - Enforce Single Flow
    // ============================================
    const validation = validateStatusTransition(booking.status, BOOKING_STATUS.REJECTED);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: validation.message,
        currentStatus: booking.status,
        availableActions: getAvailableActions(booking.status)
      });
    }

    // Update status and rejection reason
    booking.status = BOOKING_STATUS.REJECTED;
    booking.declineReason = reason;

    // Add timeline entry with enhanced tracking
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.BOOKING_REJECTED,
      req.user?.id || "Admin",
      reason || "Booking rejected by admin"
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
      statusProgress: getStatusProgress(BOOKING_STATUS.REJECTED),
    });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Approve a booking and move to preparation
// @route   POST /api/booking/approve
// @access  Admin
export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await pendingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION - Enforce Single Flow
    // ============================================
    const validation = validateStatusTransition(booking.status, BOOKING_STATUS.CONFIRMED);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: validation.message,
        currentStatus: booking.status,
        availableActions: getAvailableActions(booking.status)
      });
    }

    // Update status to CONFIRMED
    booking.status = BOOKING_STATUS.CONFIRMED;
    
    // Add timeline entry with enhanced tracking
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.BOOKING_APPROVED,
      req.user?.id || "Admin",
      "Booking confirmed by admin, ready for resource assignment"
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
      statusProgress: getStatusProgress(BOOKING_STATUS.CONFIRMED),
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Get single booking details
// @route   GET /api/booking/:id
// @access  Admin, Manager
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try pending bookings first
    let booking = await pendingBooking.findById(id);
    let source = "pending";

    // If not found in pending, try booked
    if (!booking) {
      booking = await Booked.findById(id).populate('assignedStaffDetails.manager')
        .populate('assignedStaffDetails.workers')
        .populate('assignedStaffDetails.chefs')
        .populate('assignedStaffDetails.drivers')
        .populate('assignedVehicles')
        .populate('assignedGoods.itemId');
      source = "booked";
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Get timeline summary
    const timelineSummary = getTimelineSummary(booking);

    // Get locked resources if from pending
    let lockedResources = null;
    if (source === "pending") {
      lockedResources = await getLockedResources(booking._id.toString());
    }

    res.status(200).json({
      success: true,
      booking,
      source,
      timelineSummary,
      lockedResources,
      availableActions: getAvailableActions(booking.status),
      statusProgress: getStatusProgress(booking.status),
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Assign staff to booking
// @route   PUT /api/booking/:id/assign-staff
// @access  Admin, Manager
export const assignStaffToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { manager, workers, chefs, drivers } = req.body;

    const booking = await pendingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION - Only CONFIRMED can assign staff
    // ============================================
    if (booking.status !== BOOKING_STATUS.CONFIRMED && booking.status !== BOOKING_STATUS.PENDING_REVIEW) {
      return res.status(400).json({ 
        message: "Staff can only be assigned when booking is CONFIRMED",
        currentStatus: booking.status,
        requiredStatus: BOOKING_STATUS.CONFIRMED,
        availableActions: getAvailableActions(booking.status)
      });
    }

    // ============================================
    // RESOURCE LOCKING - Lock staff for this event
    // ============================================
    const allStaffIds = [...(workers || []), ...(chefs || []), ...(drivers || [])];
    if (manager) allStaffIds.push(manager);
    
    const lockResult = await lockStaff(
      allStaffIds, 
      booking._id.toString(), 
      booking.eventDetails.eventName
    );
    
    // If locking failed for some staff, warn but continue
    if (!lockResult.success) {
      console.warn("Some staff could not be locked:", lockResult.failedStaff);
    }

    // Update assigned staff
    booking.assignedStaff = {
      manager: manager || null,
      workers: workers || [],
      chefs: chefs || [],
      drivers: drivers || [],
    };

    // Add timeline entry with enhanced tracking
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.STAFF_ASSIGNED,
      req.user?.id || "Admin",
      `Manager: ${manager ? 'Assigned' : 'Not assigned'}, Workers: ${workers?.length || 0}, Chefs: ${chefs?.length || 0}, Drivers: ${drivers?.length || 0}. Locked: ${lockResult.lockedCount}`,
      { staffLocked: lockResult.lockedCount, staffFailed: lockResult.failedCount }
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Staff assigned successfully. Locked: ${lockResult.lockedCount}, Failed: ${lockResult.failedCount}`,
      booking,
      resourceLocking: lockResult,
    });
  } catch (error) {
    console.error("Error assigning staff:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Assign goods/equipment to booking
// @route   PUT /api/booking/:id/assign-goods
// @access  Admin, Manager
export const assignGoodsToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { goods } = req.body; // Array of { itemId, itemName, category, quantity }

    const booking = await pendingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION
    // ============================================
    if (booking.status !== BOOKING_STATUS.CONFIRMED && booking.status !== BOOKING_STATUS.PENDING_REVIEW) {
      return res.status(400).json({ 
        message: "Goods can only be assigned when booking is CONFIRMED",
        currentStatus: booking.status,
        availableActions: getAvailableActions(booking.status)
      });
    }

    booking.assignedGoods = goods;

    // Add timeline entry
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.GOODS_ASSIGNED,
      req.user?.id || "Admin",
      `${goods?.length || 0} items assigned`
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Goods assigned successfully",
      booking,
    });
  } catch (error) {
    console.error("Error assigning goods:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Assign vehicles to booking
// @route   PUT /api/booking/:id/assign-vehicles
// @access  Admin, Manager
export const assignVehiclesToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicles } = req.body; // Array of vehicle IDs

    const booking = await pendingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION
    // ============================================
    if (booking.status !== BOOKING_STATUS.CONFIRMED && booking.status !== BOOKING_STATUS.PENDING_REVIEW) {
      return res.status(400).json({ 
        message: "Vehicles can only be assigned when booking is CONFIRMED",
        currentStatus: booking.status,
        availableActions: getAvailableActions(booking.status)
      });
    }

    // ============================================
    // RESOURCE LOCKING - Lock vehicles
    // ============================================
    const lockResult = await lockVehicles(
      vehicles || [],
      booking._id.toString(),
      booking.eventDetails.eventName
    );

    booking.assignedVehicles = vehicles;

    // Add timeline entry
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.VEHICLES_ASSIGNED,
      req.user?.id || "Admin",
      `${vehicles?.length || 0} vehicles assigned. Locked: ${lockResult.lockedCount}`
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Vehicles assigned successfully. Locked: ${lockResult.lockedCount}`,
      booking,
      resourceLocking: lockResult,
    });
  } catch (error) {
    console.error("Error assigning vehicles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Complete preparation and set status to PREPARATION_PENDING
// @route   POST /api/booking/:id/complete-preparation
// @access  Admin
export const completePreparation = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await pendingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION - Only CONFIRMED can complete prep
    // ============================================
    const validation = validateStatusTransition(booking.status, BOOKING_STATUS.PREPARATION_PENDING);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: validation.message,
        currentStatus: booking.status,
        availableActions: getAvailableActions(booking.status)
      });
    }

    // Validate that all required staff is assigned
    if (!booking.assignedStaff?.manager) {
      return res.status(400).json({ message: "Manager must be assigned before completing preparation" });
    }
    if (!booking.assignedStaff?.chefs || booking.assignedStaff.chefs.length === 0) {
      return res.status(400).json({ message: "At least one chef must be assigned" });
    }

    booking.status = BOOKING_STATUS.PREPARATION_PENDING;
    
    // Add timeline entry
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.PREPARATION_COMPLETED,
      req.user?.id || "Admin",
      "Event preparation complete, awaiting chef requirements"
    );

    await booking.save();

    // ============================================
    // AUTOMATIC TASK CREATION FOR MANAGER
    // ============================================
    console.log("req.user",req.user);
    
    const task = await Ticket.create({
      title: "Collect grocery requirements from chef",
      description: `Collect grocery requirements from assigned chef for event: ${booking.eventDetails.eventName}`,
      assignedTo: booking.assignedStaff.manager,
      status: "Open",
      priority: "High",
      bookingId: id,
      createdBy: req.user?.id || null,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      timeline: [{
        action: "Task Created",
        timestamp: new Date(),
        performedBy: "System",
        notes: "Auto-created when preparation completed",
      }],
    });

    // Add timeline entry for task creation
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.MANAGER_TASK_CREATED,
      "System",
      `Task created for manager: ${task.title}`
    );

    res.status(200).json({
      success: true,
      message: "Preparation completed, manager task created",
      booking,
      autoCreatedTask: task,
      statusProgress: getStatusProgress(BOOKING_STATUS.PREPARATION_PENDING),
    });
  } catch (error) {
    console.error("Error completing preparation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Update booking status (for event day management)
// @route   PATCH /api/booking/:id/status
// @access  Admin, Manager
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Try pending bookings first
    let booking = await pendingBooking.findById(id);
    let source = "pending";

    if (!booking) {
      booking = await Booked.findById(id);
      source = "booked";
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ============================================
    // STATUS VALIDATION - Enforce Single Flow
    // ============================================
    const currentStatus = booking.status || booking.bookingStatus;
    const validation = validateStatusTransition(currentStatus, status);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: validation.message,
        currentStatus: currentStatus,
        availableActions: getAvailableActions(currentStatus)
      });
    }

    booking.status = status;
    if (source === "booked") {
      booking.bookingStatus = status;
    }

    // Add timeline entry
    await addTimelineEntry(
      booking,
      TIMELINE_ACTIONS.STATUS_CHANGED,
      req.user?.id || notes || "Admin",
      `Status changed from ${currentStatus} to ${status}. ${notes || ''}`
    );

    await booking.save();

    // ============================================
    // RESOURCE RELEASE - When event is COMPLETED
    // ============================================
    let resourceRelease = null;
    if (status === BOOKING_STATUS.COMPLETED && source === "pending") {
      // Release staff
      const staffRelease = await releaseStaff(id);
      // Release vehicles
      const vehicleRelease = await releaseVehicles(id);
      
      resourceRelease = {
        staff: staffRelease,
        vehicles: vehicleRelease
      };

      // Add timeline entry for resource release
      await addTimelineEntry(
        booking,
        TIMELINE_ACTIONS.RESOURCES_RELEASED,
        "System",
        `Released ${staffRelease.releasedCount} staff and ${vehicleRelease.releasedCount} vehicles`
      );

      // Create completed booking record
      const completedBooking = await Booked.create({
        eventName: booking.eventDetails.eventName,
        clientName: booking.clientDetails.fullName,
        phone: booking.clientDetails.phone,
        eventDate: booking.eventDetails.eventDate,
        eventTime: booking.eventDetails.eventTime,
        venue: booking.eventDetails.venue,
        pax: booking.eventDetails.pax,
        totalAmount: booking.Payment_Details?.estimatedAmount || 0,
        menu: booking.menu,
        assignedStaffDetails: booking.assignedStaff,
        assignedVehicles: booking.assignedVehicles,
        assignedGoods: booking.assignedGoods,
        bookingStatus: BOOKING_STATUS.COMPLETED,
        timeline: [{
          action: TIMELINE_ACTIONS.EVENT_COMPLETED,
          timestamp: new Date(),
          performedBy: notes || "Manager",
          notes: "Event marked as completed",
        }],
        refEvent: booking._id,
      });

      // Delete from pending
      await pendingBooking.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Event completed successfully",
        booking: completedBooking,
        resourceRelease,
        statusProgress: getStatusProgress(BOOKING_STATUS.COMPLETED),
      });
    }

    // Handle IN_PROGRESS status
    if (status === BOOKING_STATUS.IN_PROGRESS) {
      await addTimelineEntry(
        booking,
        TIMELINE_ACTIONS.EVENT_STARTED,
        req.user?.id || notes || "Manager",
        "Event has started"
      );
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${getStatusLabel(status)}`,
      booking,
      resourceRelease,
      statusProgress: getStatusProgress(status),
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Get booking progress tracker
// @route   GET /api/booking/:id/progress
// @access  Admin, Manager
export const getBookingProgress = async (req, res) => {
  try {
    const { id } = req.params;

    let booking = await pendingBooking.findById(id);
    if (!booking) {
      booking = await Booked.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const timelineSummary = getTimelineSummary(booking);
    const progress = getStatusProgress(booking.status || booking.bookingStatus);
    const availableActions = getAvailableActions(booking.status || booking.bookingStatus);

    // Build progress tracker
    const progressTracker = {
      bookingReceived: timelineSummary.completedPhases.includes('Booking Received'),
      approved: timelineSummary.completedPhases.includes('Approved'),
      staffAssigned: timelineSummary.completedPhases.includes('Staff Assigned'),
      goodsAssigned: timelineSummary.completedPhases.includes('Goods Assigned'),
      vehiclesAssigned: timelineSummary.completedPhases.includes('Vehicles Assigned'),
      preparationCompleted: timelineSummary.completedPhases.includes('Preparation Completed'),
      requirementsSubmitted: timelineSummary.completedPhases.includes('Requirements Submitted'),
      readyForEvent: timelineSummary.completedPhases.includes('Ready for Event'),
      inProgress: timelineSummary.completedPhases.includes('Event In Progress'),
      completed: timelineSummary.completedPhases.includes('Event Completed'),
    };

    res.status(200).json({
      success: true,
      progress,
      currentStatus: booking.status || booking.bookingStatus,
      statusLabel: getStatusLabel(booking.status || booking.bookingStatus),
      availableActions,
      progressTracker,
      timelineSummary,
    });
  } catch (error) {
    console.error("Error fetching booking progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
