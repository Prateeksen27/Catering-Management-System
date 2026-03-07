/**
 * Timeline Utility for Event Tracking
 * Logs all actions performed on a booking with detailed information
 */

import mongoose from "mongoose";

/**
 * Get user details for timeline logging
 * @param {string} userId - User ID
 * @returns {Object} - User info { _id, name, role }
 */
const getUserInfo = async (userId) => {
  if (!userId) {
    return { _id: 'System', name: 'System', role: 'System' };
  }
  
  // Check if userId is a valid ObjectId before querying MongoDB
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return { _id: userId, name: userId, role: 'System' };
  }
  
  try {
    const user = await Employee.findById(userId).select('name role');
    if (user) {
      return {
        _id: user._id,
        name: user.name,
        role: user.role || 'Employee'
      };
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
  
  return { _id: userId, name: 'Unknown', role: 'Unknown' };
};

/**
 * Create a timeline entry
 * @param {Object} params - Timeline parameters
 * @returns {Object} - Timeline entry object
 */
export const createTimelineEntry = async ({ 
  action, 
  userId, 
  notes = '',
  metadata = {} 
}) => {
  const userInfo = await getUserInfo(userId);
  
  return {
    action,
    performedBy: userInfo._id,
    performerName: userInfo.name,
    role: userInfo.role,
    timestamp: new Date(),
    notes,
    metadata
  };
};

/**
 * Predefined timeline actions for common booking events
 */
export const TIMELINE_ACTIONS = {
  // Booking lifecycle
  BOOKING_RECEIVED: 'Booking Received',
  BOOKING_REVIEWED: 'Booking Reviewed',
  BOOKING_APPROVED: 'Booking Approved',
  BOOKING_REJECTED: 'Booking Rejected',
  
  // Resource assignment
  STAFF_ASSIGNED: 'Staff Assigned',
  GOODS_ASSIGNED: 'Goods Assigned',
  VEHICLES_ASSIGNED: 'Vehicles Assigned',
  
  // Preparation phase
  PREPARATION_STARTED: 'Preparation Started',
  PREPARATION_COMPLETED: 'Preparation Completed',
  MANAGER_TASK_CREATED: 'Manager Task Created',
  
  // Chef requirements
  REQUIREMENTS_SUBMITTED: 'Grocery Requirements Submitted',
  REQUIREMENTS_VALIDATED: 'Inventory Validation Completed',
  REQUIREMENTS_APPROVED: 'Requirements Approved',
  REQUIREMENTS_REJECTED: 'Requirements Rejected',
  
  // Event execution
  EVENT_READY: 'Event Ready for Execution',
  EVENT_STARTED: 'Event Started',
  EVENT_COMPLETED: 'Event Completed',
  
  // Resource management
  RESOURCES_LOCKED: 'Resources Locked',
  RESOURCES_RELEASED: 'Resources Released',
  
  // Status changes
  STATUS_CHANGED: 'Status Changed'
};

/**
 * Add timeline entry to a booking
 * @param {Object} booking - Mongoose document
 * @param {string} action - Action name
 * @param {string} userId - User performing action
 * @param {string} notes - Additional notes
 * @param {Object} metadata - Additional metadata
 */
export const addTimelineEntry = async (booking, action, userId, notes = '', metadata = {}) => {
  const entry = await createTimelineEntry({
    action,
    userId,
    notes,
    metadata
  });
  
  if (booking.timeline) {
    booking.timeline.push(entry);
  } else {
    booking.timeline = [entry];
  }
  
  return entry;
};

/**
 * Get timeline summary for a booking
 * @param {Object} booking - Booking document
 * @returns {Object} - Summary of timeline events
 */
export const getTimelineSummary = (booking) => {
  if (!booking.timeline || booking.timeline.length === 0) {
    return {
      totalEvents: 0,
      lastAction: null,
      lastActionDate: null,
      completedPhases: [],
      pendingPhases: []
    };
  }
  
  const timeline = booking.timeline;
  const lastEntry = timeline[timeline.length - 1];
  
  // Define completed phases based on timeline actions
  const completedPhases = [];
  const actionToPhase = {
    [TIMELINE_ACTIONS.BOOKING_RECEIVED]: 'Booking Received',
    [TIMELINE_ACTIONS.BOOKING_APPROVED]: 'Approved',
    [TIMELINE_ACTIONS.STAFF_ASSIGNED]: 'Staff Assigned',
    [TIMELINE_ACTIONS.GOODS_ASSIGNED]: 'Goods Assigned',
    [TIMELINE_ACTIONS.VEHICLES_ASSIGNED]: 'Vehicles Assigned',
    [TIMELINE_ACTIONS.PREPARATION_COMPLETED]: 'Preparation Completed',
    [TIMELINE_ACTIONS.REQUIREMENTS_SUBMITTED]: 'Requirements Submitted',
    [TIMELINE_ACTIONS.EVENT_READY]: 'Ready for Event',
    [TIMELINE_ACTIONS.EVENT_STARTED]: 'Event In Progress',
    [TIMELINE_ACTIONS.EVENT_COMPLETED]: 'Event Completed'
  };
  
  timeline.forEach(entry => {
    if (actionToPhase[entry.action] && !completedPhases.includes(actionToPhase[entry.action])) {
      completedPhases.push(actionToPhase[entry.action]);
    }
  });
  
  return {
    totalEvents: timeline.length,
    lastAction: lastEntry?.action || null,
    lastActionDate: lastEntry?.timestamp || null,
    lastPerformedBy: lastEntry?.performerName || null,
    completedPhases,
    pendingPhases: getPendingPhases(completedPhases)
  };
};

/**
 * Get pending phases based on completed phases
 * @param {Array} completedPhases - List of completed phases
 * @returns {Array} - List of pending phases
 */
const getPendingPhases = (completedPhases) => {
  const allPhases = [
    'Booking Received',
    'Approved',
    'Staff Assigned',
    'Goods Assigned',
    'Vehicles Assigned',
    'Preparation Completed',
    'Requirements Submitted',
    'Ready for Event',
    'Event In Progress',
    'Event Completed'
  ];
  
  return allPhases.filter(phase => !completedPhases.includes(phase));
};

export default {
  createTimelineEntry,
  addTimelineEntry,
  getTimelineSummary,
  TIMELINE_ACTIONS
};
