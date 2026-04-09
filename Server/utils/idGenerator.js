import Counter from '../models/counter.model.js';
import Employee from '../models/user.model.js';

/**
 * Initialize counter with current max value from existing data
 * Call this once during server startup or manually
 */
export const initializeCounters = async () => {
  try {
    // Find the highest employee ID and set counter
    const lastEmployee = await Employee.findOne().sort({ empID: -1 });
    if (lastEmployee && lastEmployee.empID) {
      const lastNum = parseInt(lastEmployee.empID.replace('EMP', ''), 10);
      const existingCounter = await Counter.findById('employeeId');
      if (!existingCounter) {
        await Counter.create({ _id: 'employeeId', seq: lastNum });
      }
    }
    
    // Similarly for bookings - would need to check Booked and PendingBooking
    console.log('Counters initialized successfully');
  } catch (error) {
    console.error('Error initializing counters:', error);
  }
};

/**
 * Get next sequence number for generating unique IDs
 * Uses atomic $inc operation to prevent race conditions
 * @param {string} name - Counter name (e.g., 'bookingId', 'employeeId')
 * @returns {Promise<number>} - Next sequence number
 */
export const getNextSequence = async (name) => {
  // First check if counter exists
  const counter = await Counter.findById(name);
  
  // If counter doesn't exist and this is employeeId, initialize from existing data
  if (!counter && name === 'employeeId') {
    const lastEmployee = await Employee.findOne().sort({ empID: -1 });
    let startSeq = 1;
    if (lastEmployee && lastEmployee.empID) {
      startSeq = parseInt(lastEmployee.empID.replace('EMP', ''), 10);
    }
    const newCounter = await Counter.create({ _id: name, seq: startSeq });
    return newCounter.seq;
  }
  
  const updatedCounter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return updatedCounter.seq;
};

/**
 * Generate unique booking ID with prefix
 * @param {string} prefix - Prefix for the ID (e.g., 'BOOK', 'PBK')
 * @param {number} padding - Number of leading zeros (default: 4)
 * @returns {Promise<string>} - Generated unique ID
 */
export const generateBookingId = async (prefix = 'BOOK', padding = 4) => {
  const seq = await getNextSequence(prefix);
  return `${prefix}${String(seq).padStart(padding, '0')}`;
};

/**
 * Generate unique employee ID
 * @returns {Promise<string>} - Generated unique ID
 */
export const generateEmployeeId = async () => {
  const seq = await getNextSequence('employeeId');
  return `EMP${String(seq).padStart(3, '0')}`;
};

export default {
  getNextSequence,
  generateBookingId,
  generateEmployeeId,
  initializeCounters
};
