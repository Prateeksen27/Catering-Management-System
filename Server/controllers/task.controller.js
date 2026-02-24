import Task from "../models/task.model.js"
import Booked from "../models/Booked.model.js"
import mongoose from "mongoose"

/**
 * =========================
 * GET EVENTS FOR TASK CREATION
 * Admin → all live events
 * Manager → events they are assigned to
 * =========================
 */
export const getEventsForTaskCreation = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.empType || req.user.role;
    
    let query = { 
      isActive: true,
      bookingStatus: { $ne: 'Cancelled' }
    };

    // For Manager, only show events they are assigned to
    if (userRole === 'Manager') {
      query.$or = [
        { assignedStaff: userId },
        { assignedChefs: userId }
      ];
    }

    const events = await Booked.find(query)
      .select('eventName eventDate eventTime venue bookingStatus clientName assignedStaff assignedChefs')
      .populate('assignedStaff', 'name empType')
      .populate('assignedChefs', 'name empType')
      .sort({ eventDate: 1 });

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * CREATE TASK
 * Admin / Manager only
 * =========================
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, eventRef } = req.body;
    const assignedBy = req.user._id;
    const userRole = req.user.empType || req.user.role;

    // Validate dueDate is in the future
    if (new Date(dueDate) <= new Date()) {
      return res.status(400).json({ success: false, message: "Due date must be in the future" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ success: false, message: "Invalid assignedTo ID" });
    }

    // Validate eventRef if provided
    if (eventRef && !mongoose.Types.ObjectId.isValid(eventRef)) {
      return res.status(400).json({ success: false, message: "Invalid eventRef ID" });
    }

    // If eventRef is provided, validate it and check access
    if (eventRef) {
      const event = await Booked.findById(eventRef);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      // For Manager, check if they are assigned to this event
      if (userRole === 'Manager') {
        const isAssigned = 
          event.assignedStaff.some(staff => staff.toString() === assignedBy.toString()) ||
          event.assignedChefs.some(chef => chef.toString() === assignedBy.toString());
        
        if (!isAssigned) {
          return res.status(403).json({ success: false, message: "You can only assign tasks for events you are assigned to" });
        }

        // Check if assignedTo employee is assigned to this event
        const isEmployeeAssigned = 
          event.assignedStaff.some(staff => staff.toString() === assignedTo.toString()) ||
          event.assignedChefs.some(chef => chef.toString() === assignedTo.toString());
        
        if (!isEmployeeAssigned) {
          return res.status(400).json({ success: false, message: "Assigned employee must be part of this event" });
        }
      }
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      assignedTo,
      assignedBy,
      eventRef: eventRef || null
    });

    // Populate the created task for response
    await task.populate('assignedBy', 'name email empType');
    await task.populate('assignedTo', 'name email empType');
    if (eventRef) {
      await task.populate('eventRef', 'eventName eventDate');
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * GET ALL TASKS
 * Admin → all
 * Manager → all (with event filtering)
 * Employee → only assigned tasks
 * =========================
 */
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.empType || req.user.role;
    const { eventId, status } = req.query;

    let filter = { isActive: true };

    // Employees can only see their assigned tasks
    if (userRole === 'Employee' || userRole === 'Chef' || userRole === 'Driver' || userRole === 'Worker') {
      filter.assignedTo = userId;
    }

    // Filter by event if provided
    if (eventId) {
      filter.eventRef = eventId;
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name email empType')
      .populate('assignedTo', 'name email empType')
      .populate('eventRef', 'eventName eventDate venue')
      .sort({ dueDate: 1 }); // Sort by dueDate ascending

    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * GET TASK BY ID
 * =========================
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name email empType')
      .populate('assignedTo', 'name email empType')
      .populate('eventRef', 'eventName eventDate venue');

    if (!task || !task.isActive) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const userId = req.user._id;
    const userRole = req.user.empType || req.user.role;

    // Employee can view only own task
    if (['Employee', 'Chef', 'Driver', 'Worker'].includes(userRole)) {
      if (!task.assignedTo._id.equals(userId)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * UPDATE TASK (FULL UPDATE)
 * Admin / Manager only
 * =========================
 */
export const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, eventRef } = req.body;
    
    const task = await Task.findById(req.params.id);

    if (!task || !task.isActive) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Validate dueDate is in the future if being updated
    if (dueDate && new Date(dueDate) <= new Date()) {
      return res.status(400).json({ success: false, message: "Due date must be in the future" });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;
    if (eventRef !== undefined) task.eventRef = eventRef;

    await task.save();

    await task.populate('assignedBy', 'name email empType');
    await task.populate('assignedTo', 'name email empType');
    if (task.eventRef) {
      await task.populate('eventRef', 'eventName eventDate');
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * DELETE TASK (SOFT DELETE)
 * Admin / Manager only
 * =========================
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.isActive = false;
    await task.save();

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * UPDATE TASK STATUS
 * Employee: Pending → In Progress → Completed
 * Admin/Manager: Also can set Cancelled
 * =========================
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.empType || req.user.role;

    const task = await Task.findById(req.params.id);

    if (!task || !task.isActive) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Valid status transitions
    const validTransitions = {
      'Pending': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed', 'Cancelled'],
      'Completed': [], // Cannot change once completed
      'Cancelled': []  // Cannot change once cancelled
    };

    // Check if transition is valid
    if (!validTransitions[task.status].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot change status from ${task.status} to ${status}` 
      });
    }

    // Non-Admin/Manager cannot set Cancelled status
    if (status === 'Cancelled' && !['Admin', 'Manager'].includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: "Only Admin and Manager can cancel tasks" 
      });
    }

    // Employee can only update their own assigned tasks
    if (['Employee', 'Chef', 'Driver', 'Worker'].includes(userRole)) {
      if (!task.assignedTo.equals(userId)) {
        return res.status(403).json({ success: false, message: "Not allowed" });
      }
    }

    task.status = status;
    
    if (status === 'Completed') {
      task.completedAt = new Date();
    }

    await task.save();
    await task.populate('assignedBy', 'name email empType');
    await task.populate('assignedTo', 'name email empType');

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * ADD COMMENT TO TASK
 * Assigned employee or assigner can add comments
 * =========================
 */
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.user._id;
    const userRole = req.user.empType || req.user.role;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const task = await Task.findById(req.params.id);

    if (!task || !task.isActive) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if user is either the assignee or the assigner
    const isAssignee = task.assignedTo.equals(userId);
    const isAssigner = task.assignedBy.equals(userId);
    const isAdminOrManager = ['Admin', 'Manager'].includes(userRole);

    if (!isAssignee && !isAssigner && !isAdminOrManager) {
      return res.status(403).json({ success: false, message: "Only task assignee, assigner, or Admin/Manager can add comments" });
    }

    task.comments.push({
      commenter: userId,
      comment: comment.trim()
    });

    await task.save();
    
    await task.populate('assignedBy', 'name email empType');
    await task.populate('assignedTo', 'name email empType');
    await task.populate('comments.commenter', 'name email empType');

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
