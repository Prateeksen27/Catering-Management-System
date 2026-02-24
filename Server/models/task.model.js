import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  comments:
    {
      commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      },
      comment: {
        type: String,
        trim: true
      },
      commentedAt: {
        type: Date,
        default: Date.now
      }
    },
  isActive: {
    type: Boolean,
    default: true
  },
  eventRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booked',
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Indexes for performance
TaskSchema.index({ assignedTo: 1, isActive: 1 });
TaskSchema.index({ eventRef: 1, isActive: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ assignedBy: 1 });

export default mongoose.model("Task", TaskSchema);
