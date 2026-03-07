/**
 * Booking Status Lifecycle Validation Utility
 * Enforces single status flow for event lifecycle management
 */

// Valid status values
export const BOOKING_STATUS = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  PREPARATION_PENDING: 'PREPARATION_PENDING',
  REQUIREMENT_SUBMITTED: 'REQUIREMENT_SUBMITTED',
  READY_FOR_EVENT: 'READY_FOR_EVENT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

// Valid status transitions
const VALID_TRANSITIONS = {
  [BOOKING_STATUS.PENDING_REVIEW]: [BOOKING_STATUS.REJECTED, BOOKING_STATUS.CONFIRMED],
  [BOOKING_STATUS.REJECTED]: [], // Terminal state
  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.PREPARATION_PENDING],
  [BOOKING_STATUS.PREPARATION_PENDING]: [BOOKING_STATUS.REQUIREMENT_SUBMITTED],
  [BOOKING_STATUS.REQUIREMENT_SUBMITTED]: [BOOKING_STATUS.READY_FOR_EVENT],
  [BOOKING_STATUS.READY_FOR_EVENT]: [BOOKING_STATUS.IN_PROGRESS],
  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED],
  [BOOKING_STATUS.COMPLETED]: [] // Terminal state
};

/**
 * Validate if a status transition is allowed
 * @param {string} currentStatus - Current booking status
 * @param {string} newStatus - New status to transition to
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  
  if (!allowedTransitions) {
    return {
      valid: false,
      message: `Invalid current status: ${currentStatus}`
    };
  }
  
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      message: `Cannot transition from ${currentStatus} to ${newStatus}. Valid transitions: ${allowedTransitions.join(', ') || 'none'}`
    };
  }
  
  return {
    valid: true,
    message: 'Status transition allowed'
  };
};

/**
 * Check if a status is terminal (no further transitions possible)
 * @param {string} status - Status to check
 * @returns {boolean}
 */
export const isTerminalStatus = (status) => {
  return [BOOKING_STATUS.REJECTED, BOOKING_STATUS.COMPLETED].includes(status);
};

/**
 * Check if a status allows resource assignment
 * @param {string} status - Status to check
 * @returns {boolean}
 */
export const allowsResourceAssignment = (status) => {
  return [BOOKING_STATUS.CONFIRMED].includes(status);
};

/**
 * Check if a status allows chef requirement submission
 * @param {string} status - Status to check
 * @returns {boolean}
 */
export const allowsRequirementSubmission = (status) => {
  return [BOOKING_STATUS.PREPARATION_PENDING].includes(status);
};

/**
 * Get available actions for a given status
 * @param {string} status - Current status
 * @returns {Array} - Array of available actions
 */
export const getAvailableActions = (status) => {
  const actions = {
    [BOOKING_STATUS.PENDING_REVIEW]: ['approve', 'reject'],
    [BOOKING_STATUS.REJECTED]: [],
    [BOOKING_STATUS.CONFIRMED]: ['assignStaff', 'assignGoods', 'assignVehicles', 'completePreparation'],
    [BOOKING_STATUS.PREPARATION_PENDING]: ['submitRequirements'],
    [BOOKING_STATUS.REQUIREMENT_SUBMITTED]: ['approveRequirements'],
    [BOOKING_STATUS.READY_FOR_EVENT]: ['startEvent'],
    [BOOKING_STATUS.IN_PROGRESS]: ['completeEvent'],
    [BOOKING_STATUS.COMPLETED]: []
  };
  
  return actions[status] || [];
};

/**
 * Get progress percentage based on status
 * @param {string} status - Current status
 * @returns {number} - Progress percentage (0-100)
 */
export const getStatusProgress = (status) => {
  const progressMap = {
    [BOOKING_STATUS.PENDING_REVIEW]: 10,
    [BOOKING_STATUS.REJECTED]: 0,
    [BOOKING_STATUS.CONFIRMED]: 25,
    [BOOKING_STATUS.PREPARATION_PENDING]: 40,
    [BOOKING_STATUS.REQUIREMENT_SUBMITTED]: 55,
    [BOOKING_STATUS.READY_FOR_EVENT]: 70,
    [BOOKING_STATUS.IN_PROGRESS]: 85,
    [BOOKING_STATUS.COMPLETED]: 100
  };
  
  return progressMap[status] || 0;
};

/**
 * Get status label for display
 * @param {string} status - Current status
 * @returns {string} - Human-readable status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    [BOOKING_STATUS.PENDING_REVIEW]: 'Pending Review',
    [BOOKING_STATUS.REJECTED]: 'Rejected',
    [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
    [BOOKING_STATUS.PREPARATION_PENDING]: 'Preparation Pending',
    [BOOKING_STATUS.REQUIREMENT_SUBMITTED]: 'Requirements Submitted',
    [BOOKING_STATUS.READY_FOR_EVENT]: 'Ready for Event',
    [BOOKING_STATUS.IN_PROGRESS]: 'In Progress',
    [BOOKING_STATUS.COMPLETED]: 'Completed'
  };
  
  return labels[status] || status;
};

export default {
  BOOKING_STATUS,
  validateStatusTransition,
  isTerminalStatus,
  allowsResourceAssignment,
  allowsRequirementSubmission,
  getAvailableActions,
  getStatusProgress,
  getStatusLabel
};
