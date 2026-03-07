import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'litres', 'grams', 'pieces', 'packets', 'bottles', 'dozen', 'boxes'],
  },
  notes: {
    type: String,
    trim: true,
  },
});

const chefRequirementSchema = new mongoose.Schema({
  // 📋 Booking Reference
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PendingBooking',
    required: true,
  },
  bookedEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booked',
  },
  
  // 👨‍🍳 Chef Reference
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  
  // 📝 Requirement Details
  ingredients: [ingredientSchema],
  
  // 💰 Cost Estimate
  estimatedCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // 📎 Attached Files
  files: [
    {
      fileName: String,
      filePath: String,
      fileType: {
        type: String,
        enum: ['pdf', 'image', 'excel'],
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  // 🔧 Status
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  
  // 📝 Notes
  notes: {
    type: String,
    trim: true,
  },
  
  // 🔔 Notification
  isNotified: {
    type: Boolean,
    default: false,
  },
  
  // 🛒 Purchase Requirements (from inventory validation)
  purchaseRequirements: [
    {
      ingredientName: String,
      requiredQuantity: Number,
      availableQuantity: Number,
      purchaseNeeded: Number,
      unit: String,
      status: {
        type: String,
        enum: ['Pending', 'Purchased'],
        default: 'Pending',
      },
    },
  ],
  
  // 📅 Timeline
  timeline: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      performedBy: { type: String, default: 'Chef' },
      notes: String,
    },
  ],
}, { timestamps: true });

// Add indexes before creating model
chefRequirementSchema.index({ bookingId: 1 });
chefRequirementSchema.index({ chefId: 1 });
chefRequirementSchema.index({ status: 1 });

const ChefRequirement = mongoose.model('ChefRequirement', chefRequirementSchema);

export default ChefRequirement;
