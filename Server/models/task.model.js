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
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }],
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
  comments: [
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
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  eventRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
