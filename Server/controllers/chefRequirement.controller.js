import ChefRequirement from '../models/chefRequirement.model.js';
import pendingBooking from '../models/pendingBooking.model.js';
import Booked from '../models/Booked.model.js';
import Inventory from '../models/inventory.model.js';

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
  TIMELINE_ACTIONS
} from "../utils/timelineUtils.js";

import {
  calculateGroceryRequirements,
  validateIngredientAvailability,
  estimateGroceryCost
} from "../utils/groceryCalculation.js";

// @desc    Get requirements for a specific chef
// @route   GET /api/chef-requirements/my-requirements
// @access  Chef
export const getMyRequirements = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const chefId = req.user?.id;

    const submittedRequirements = await ChefRequirement.find({ chefId })
      .populate("bookingId")
      .sort({ createdAt: -1 });

    const pendingBookings = await pendingBooking.find({
      status: "PREPARATION_PENDING",
      "assignedStaff.chefs": chefId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pendingBookings,
      submittedRequirements
    });
  } catch (error) {
    console.error('Error fetching chef requirements:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get all chef requirements (for admin/manager)
// @route   GET /api/chef-requirements
// @access  Admin, Manager
export const getAllRequirements = async (req, res) => {
  try {
    const { bookingId, status } = req.query;

    const filter = {};
    if (bookingId) filter.bookingId = bookingId;
    if (status) filter.status = status;

    const requirements = await ChefRequirement.find(filter)
      .populate('chefId', 'name email empType')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requirements,
    });
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Submit chef requirement
// @route   POST /api/chef-requirements
// @access  Chef
export const submitRequirement = async (req, res) => {
  try {
    const { bookingId, ingredients, estimatedCost, notes, files } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const chefId = req.user?.id;

    // Validate booking exists
    const booking = await pendingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if chef is assigned to this booking
    const isAssigned = booking.assignedStaff?.chefs?.some(
      chef => chef.toString() === chefId
    );

    if (!isAssigned) {
      return res.status(403).json({ message: 'You are not assigned to this event' });
    }

    // Validate ingredients array
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Ingredients are required' });
    }

    // Validate each ingredient has required fields
    for (const ingredient of ingredients) {
      if (!ingredient.ingredientName || ingredient.quantity === undefined || !ingredient.unit) {
        return res.status(400).json({ message: 'Each ingredient must have ingredientName, quantity, and unit' });
      }
    }

    // Create requirement
    const requirement = await ChefRequirement.create({
      bookingId,
      chefId,
      ingredients,
      estimatedCost,
      notes,
      files: files || [],
      status: 'Submitted',
      timeline: [{
        action: 'Requirement Submitted',
        timestamp: new Date(),
        performedBy: 'Chef',
        notes: 'Grocery requirements submitted',
      }],
    });

    // Update booking requirement status
    booking.requirementStatus = 'Submitted';
    booking.status = 'REQUIREMENT_SUBMITTED';
    booking.timeline.push({
      action: 'Chef Submitted Requirements',
      timestamp: new Date(),
      performedBy: 'Chef',
      notes: `Estimated cost: ₹${estimatedCost}`,
    });
    await booking.save();

    // ============================================\n    // INVENTORY VALIDATION\n    // ============================================\n    const purchaseRequirements = [];
    var purchaseRequirements = [];
    for (const ingredient of ingredients) {
      // Try to find in inventory (case-insensitive search)
      const inventoryItem = await Inventory.findOne({
        name: { $regex: new RegExp(ingredient.ingredientName, 'i') }
      });

      if (inventoryItem) {
        const availableQty = inventoryItem.quantity || 0;
        const requiredQty = ingredient.quantity;

        if (requiredQty > availableQty) {
          purchaseRequirements.push({
            ingredientName: ingredient.ingredientName,
            requiredQuantity: requiredQty,
            availableQuantity: availableQty,
            purchaseNeeded: requiredQty - availableQty,
            unit: ingredient.unit,
            status: 'Pending',
          });
        }
      } else {
        // Item not in inventory, needs to be purchased
        purchaseRequirements.push({
          ingredientName: ingredient.ingredientName,
          requiredQuantity: ingredient.quantity,
          availableQuantity: 0,
          purchaseNeeded: ingredient.quantity,
          unit: ingredient.unit,
          status: 'Pending',
        });
      }
    }

    // Update requirement with purchase requirements
    requirement.purchaseRequirements = purchaseRequirements;
    await requirement.save();

    res.status(201).json({
      success: true,
      message: 'Requirement submitted successfully',
      requirement,
      purchaseRequirements,
    });
  } catch (error) {
    console.error('Error submitting requirement:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Update chef requirement
// @route   PUT /api/chef-requirements/:id
// @access  Chef
export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredients, estimatedCost, notes, files } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const chefId = req.user?.id;

    const requirement = await ChefRequirement.findById(id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    // Only the assigned chef can update
    if (requirement.chefId.toString() !== chefId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only update if not yet approved
    if (requirement.status === 'Approved') {
      return res.status(400).json({ message: 'Cannot update approved requirement' });
    }

    requirement.ingredients = ingredients;
    requirement.estimatedCost = estimatedCost;
    requirement.notes = notes;
    if (files) requirement.files = files;

    requirement.timeline.push({
      action: 'Requirement Updated',
      timestamp: new Date(),
      performedBy: 'Chef',
      notes: 'Grocery requirements updated',
    });

    await requirement.save();

    res.status(200).json({
      success: true,
      message: 'Requirement updated successfully',
      requirement,
    });
  } catch (error) {
    console.error('Error updating requirement:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get requirement by ID
// @route   GET /api/chef-requirements/:id
// @access  Admin, Manager, Chef (if assigned)
export const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;

    const requirement = await ChefRequirement.findById(id)
      .populate('chefId', 'name email empType')
      .populate('bookingId');

    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    res.status(200).json({
      success: true,
      requirement,
    });
  } catch (error) {
    console.error('Error fetching requirement:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Approve or reject requirement
// @route   PATCH /api/chef-requirements/:id/status
// @access  Admin, Manager
export const updateRequirementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const requirement = await ChefRequirement.findById(id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    requirement.status = status;
    requirement.timeline.push({
      action: `Requirement ${status}`,
      timestamp: new Date(),
      performedBy: notes || 'Manager',
      notes: notes,
    });

    await requirement.save();

    // Update booking status if approved
    if (status === 'Approved') {
      const booking = await pendingBooking.findById(requirement.bookingId);
      if (booking) {
        booking.status = 'READY_FOR_EVENT';
        booking.timeline.push({
          action: 'Requirements Approved',
          timestamp: new Date(),
          performedBy: notes || 'Manager',
          notes: 'Event ready for execution',
        });
        await booking.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Requirement ${status.toLowerCase()} successfully`,
      requirement,
    });
  } catch (error) {
    console.error('Error updating requirement status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Auto-calculate grocery requirements based on menu and guest count
// @route   POST /api/chef-requirements/calculate
// @access  Chef
export const calculateGrocery = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking with menu details
    const booking = await pendingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Extract menu items from booking
    const menuItems = [
      ...(booking.menu?.starters || []),
      ...(booking.menu?.maincourse || []),
      ...(booking.menu?.beverages || []),
      ...(booking.menu?.desserts || [])
    ];

    const guestCount = booking.eventDetails?.pax || 0;

    if (menuItems.length === 0) {
      return res.status(400).json({ message: 'No menu items found in booking' });
    }

    // Calculate ingredients automatically
    const calculatedIngredients = await calculateGroceryRequirements(menuItems, guestCount);

    // Estimate cost
    const estimatedCost = estimateGroceryCost(calculatedIngredients);

    // Validate against inventory
    const inventoryValidation = await validateIngredientAvailability(calculatedIngredients);

    res.status(200).json({
      success: true,
      menuItems,
      guestCount,
      calculatedIngredients,
      estimatedCost,
      inventoryValidation
    });
  } catch (error) {
    console.error('Error calculating groceries:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Upload requirement files
// @route   POST /api/chef-requirements/:id/upload
// @access  Chef
export const uploadRequirementFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const requirement = await ChefRequirement.findById(id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.includes('spreadsheet') || req.file.mimetype.includes('excel')) fileType = 'excel';

    const fileData = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType,
      uploadedAt: new Date(),
    };

    requirement.files.push(fileData);
    requirement.timeline.push({
      action: 'File Uploaded',
      timestamp: new Date(),
      performedBy: 'Chef',
      notes: `File: ${req.file.originalname}`,
    });

    await requirement.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: fileData,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
