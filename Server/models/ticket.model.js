import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Review', 'Completed', 'Closed', 'Rejected'],
    default: 'Open',
  },
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booked',
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  activityLog: [
    {
      action: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      oldValue: String,
      newValue: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

// Generate ticket ID before saving
TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const lastTicket = await this.constructor.findOne().sort({ createdAt: -1 });
    let newNumber = 1;
    if (lastTicket && lastTicket.ticketId) {
      const lastNum = parseInt(lastTicket.ticketId.replace('TKT', ''), 10);
      newNumber = lastNum + 1;
    }
    this.ticketId = `TKT${String(newNumber).padStart(4, '0')}`;
  }
  next();
});

// Indexes for better query performance
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ relatedBooking: 1 });
TicketSchema.index({ dueDate: 1 });

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
