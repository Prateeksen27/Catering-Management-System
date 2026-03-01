import Ticket from '../models/ticket.model.js';
import Employee from '../models/user.model.js';
import Booked from '../models/Booked.model.js';

// Status transition validation
const VALID_TRANSITIONS = {
  'Open': ['In Progress'],
  'In Progress': ['Review'],
  'Review': ['Completed', 'Rejected'],
  'Rejected': ['In Progress'],
  'Completed': ['Closed'],
  'Closed': [],
};

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, relatedBooking, dueDate, attachments } = req.body;
    const createdBy = req.user.id;

    // Validate required fields
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, assignedTo, and dueDate are required'
      });
    }

    // Check if assigned employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Validate dueDate is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDueDate = new Date(dueDate);
    if (selectedDueDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Due date cannot be in the past'
      });
    }

    // Check if employee is on leave
    if (employee.status === 'On-leave') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign ticket to employee on leave'
      });
    }

    // Validate relatedBooking if provided
    if (relatedBooking) {
      const booking = await Booked.findById(relatedBooking);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
    }

    // Create ticket
    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'Medium',
      assignedTo,
      createdBy,
      relatedBooking: relatedBooking || null,
      dueDate,
      attachments: attachments || [],
      activityLog: [{
        action: 'Ticket Created',
        performedBy: createdBy,
        newValue: `Ticket assigned to ${employee.name}`,
      }],
    });

    await ticket.save();

    // Update booking timeline if relatedBooking exists
    if (relatedBooking) {
      await Booked.findByIdAndUpdate(relatedBooking, {
        $push: {
          timeline: {
            action: 'Task Created',
            notes: `Ticket ${ticket.ticketId} assigned to ${employee.name}`,
          },
        },
      });
    }

    // Populate the ticket for response
    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all tickets (with filters)
export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo, relatedBooking } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (relatedBooking) filter.relatedBooking = relatedBooking;

    const tickets = await Ticket.find(filter)
      .populate('assignedTo', 'name empType email profilePic')
      .populate('createdBy', 'name empType email')
      .populate('relatedBooking', 'bookingId eventName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get tickets assigned to current user
export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Employee.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tickets = await Ticket.find({ assignedTo: userId })
      .populate('assignedTo', 'name empType email profilePic')
      .populate('createdBy', 'name empType email')
      .populate('relatedBooking', 'bookingId eventName')
      .sort({ createdAt: -1 });

    // Get status counts for dashboard
    const statusCounts = await Ticket.aggregate([
      { $match: { assignedTo: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts = {
      Open: 0,
      'In Progress': 0,
      Review: 0,
      Completed: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id in counts) {
        counts[item._id] = item.count;
      }
    });

    res.status(200).json({ success: true, tickets, counts });
  } catch (error) {
    console.error('Error fetching my tasks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    const userId = req.user.id;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if ticket is closed
    if (ticket.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update closed ticket'
      });
    }

    // Validate status transition
    const validTransitions = VALID_TRANSITIONS[ticket.status];
    if (!validTransitions || !validTransitions.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${ticket.status} to ${newStatus}`
      });
    }

    const oldStatus = ticket.status;
    ticket.status = newStatus;
    ticket.activityLog.push({
      action: 'Status Changed',
      performedBy: userId,
      oldValue: oldStatus,
      newValue: newStatus,
    });

    await ticket.save();

    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reassign ticket (Admin/Manager only)
export const reassignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo: newAssignedTo } = req.body;
    const userId = req.user.id;
    const userRole = req.user.empType;

    // Check if user is Admin or Manager
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Manager can reassign tickets'
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if ticket is closed
    if (ticket.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reassign closed ticket'
      });
    }

    // Check if new employee exists
    const newEmployee = await Employee.findById(newAssignedTo);
    if (!newEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check if employee is on leave
    if (newEmployee.status === 'On-leave') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign ticket to employee on leave'
      });
    }

    const oldAssignedTo = ticket.assignedTo;
    ticket.assignedTo = newAssignedTo;
    ticket.activityLog.push({
      action: 'Ticket Reassigned',
      performedBy: userId,
      oldValue: oldAssignedTo.toString(),
      newValue: newAssignedTo,
    });

    await ticket.save();

    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error reassigning ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Close ticket (Admin/Manager only)
export const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.empType;

    // Check if user is Admin or Manager
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Manager can close tickets'
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Can only close completed tickets
    if (ticket.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed tickets can be closed'
      });
    }

    ticket.status = 'Closed';
    ticket.activityLog.push({
      action: 'Ticket Closed',
      performedBy: userId,
      newValue: 'Closed',
    });

    await ticket.save();

    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add comment to ticket
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if ticket is closed
    if (ticket.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add comment to closed ticket'
      });
    }

    ticket.activityLog.push({
      action: 'Comment Added',
      performedBy: userId,
      newValue: comment,
    });

    await ticket.save();

    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');
    await ticket.populate('activityLog.performedBy', 'name empType');

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add attachment to ticket
export const addAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, fileUrl } = req.body;
    const userId = req.user.id;

    if (!fileName || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'File name and URL are required'
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if ticket is closed
    if (ticket.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add attachment to closed ticket'
      });
    }

    ticket.attachments.push({
      fileName,
      fileUrl,
      uploadedBy: userId,
      uploadedAt: new Date(),
    });

    ticket.activityLog.push({
      action: 'Attachment Added',
      performedBy: userId,
      newValue: fileName,
    });

    await ticket.save();

    await ticket.populate('assignedTo', 'name empType email');
    await ticket.populate('createdBy', 'name empType email');

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('assignedTo', 'name empType email profilePic')
      .populate('createdBy', 'name empType email')
      .populate('relatedBooking', 'bookingId eventName eventDate venue')
      .populate('attachments.uploadedBy', 'name empType')
      .populate('activityLog.performedBy', 'name empType');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete ticket (Admin only)
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.empType;

    // Only Admin can delete tickets
    if (userRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin can delete tickets'
      });
    }

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get ticket statistics for dashboard
export const getTicketStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.empType;

    let matchFilter = {};

    // If not Admin/Manager, only show own tickets
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      matchFilter = { assignedTo: userId };
    }

    const stats = await Ticket.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Ticket.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statusStats: stats,
      priorityStats,
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
