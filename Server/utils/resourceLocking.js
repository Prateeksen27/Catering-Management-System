/**
 * Resource Locking Utility
 * Manages staff and vehicle locking for events
 */

import Employee from "../models/user.model.js";
import Vehicle from "../models/vechile.model.js";
import pendingBooking from "../models/pendingBooking.model.js";

/**
 * Lock staff for an event
 * @param {Array} staffIds - Array of staff IDs to lock
 * @param {string} bookingId - Booking ID
 * @param {string} eventName - Event name for reference
 * @returns {Object} - Result of locking operation
 */
export const lockStaff = async (staffIds, bookingId, eventName) => {
  const lockedStaff = [];
  const failedStaff = [];
  
  for (const staffId of staffIds) {
    try {
      const employee = await Employee.findById(staffId);
      
      if (!employee) {
        failedStaff.push({ staffId, reason: 'Employee not found' });
        continue;
      }
      
      // Check if already assigned to another event
      if (employee.status === 'Assigned' && employee.assignedProject !== bookingId) {
        failedStaff.push({ 
          staffId, 
          name: employee.name,
          reason: `Already assigned to event: ${employee.assignedProject}` 
        });
        continue;
      }
      
      // Lock the staff
      employee.status = 'Assigned';
      employee.assignedProject = bookingId;
      await employee.save();
      
      lockedStaff.push({
        staffId: employee._id,
        name: employee.name,
        empType: employee.empType
      });
    } catch (error) {
      failedStaff.push({ staffId, reason: error.message });
    }
  }
  
  return {
    success: failedStaff.length === 0,
    lockedCount: lockedStaff.length,
    failedCount: failedStaff.length,
    lockedStaff,
    failedStaff,
    message: failedStaff.length === 0 
      ? `Successfully locked ${lockedStaff.length} staff members` 
      : `Locked ${lockedStaff.length}, failed ${failedStaff.length}`
  };
};

/**
 * Lock vehicles for an event
 * @param {Array} vehicleIds - Array of vehicle IDs to lock
 * @param {string} bookingId - Booking ID
 * @param {string} eventName - Event name for reference
 * @returns {Object} - Result of locking operation
 */
export const lockVehicles = async (vehicleIds, bookingId, eventName) => {
  const lockedVehicles = [];
  const failedVehicles = [];
  
  for (const vehicleId of vehicleIds) {
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      
      if (!vehicle) {
        failedVehicles.push({ vehicleId, reason: 'Vehicle not found' });
        continue;
      }
      
      // Check if already assigned to another event
      if (vehicle.status === 'assigned' && vehicle.assignedEvent !== bookingId) {
        failedVehicles.push({ 
          vehicleId, 
          name: vehicle.name,
          reason: `Already assigned to event: ${vehicle.assignedEvent}` 
        });
        continue;
      }
      
      // Check if vehicle is in maintenance
      if (vehicle.status === 'maintenance') {
        failedVehicles.push({ 
          vehicleId, 
          name: vehicle.name,
          reason: 'Vehicle is under maintenance' 
        });
        continue;
      }
      
      // Lock the vehicle
      vehicle.status = 'assigned';
      vehicle.assignedEvent = bookingId;
      await vehicle.save();
      
      lockedVehicles.push({
        vehicleId: vehicle._id,
        name: vehicle.name,
        vehicleNumber: vehicle.vehicleNumber
      });
    } catch (error) {
      failedVehicles.push({ vehicleId, reason: error.message });
    }
  }
  
  return {
    success: failedVehicles.length === 0,
    lockedCount: lockedVehicles.length,
    failedCount: failedVehicles.length,
    lockedVehicles,
    failedVehicles,
    message: failedVehicles.length === 0 
      ? `Successfully locked ${lockedVehicles.length} vehicles` 
      : `Locked ${lockedVehicles.length}, failed ${failedVehicles.length}`
  };
};

/**
 * Release staff after event completion
 * @param {string} bookingId - Booking ID
 * @returns {Object} - Result of release operation
 */
export const releaseStaff = async (bookingId) => {
  try {
    const releasedCount = await Employee.updateMany(
      { assignedProject: bookingId },
      { 
        status: 'Active',
        assignedProject: 'N/A'
      }
    );
    
    return {
      success: true,
      releasedCount: releasedCount.modifiedCount,
      message: `Released ${releasedCount.modifiedCount} staff members`
    };
  } catch (error) {
    return {
      success: false,
      releasedCount: 0,
      message: error.message
    };
  }
};

/**
 * Release vehicles after event completion
 * @param {string} bookingId - Booking ID
 * @returns {Object} - Result of release operation
 */
export const releaseVehicles = async (bookingId) => {
  try {
    const releasedCount = await Vehicle.updateMany(
      { assignedEvent: bookingId },
      { 
        status: 'available',
        assignedEvent: null
      }
    );
    
    return {
      success: true,
      releasedCount: releasedCount.modifiedCount,
      message: `Released ${releasedCount.modifiedCount} vehicles`
    };
  } catch (error) {
    return {
      success: false,
      releasedCount: 0,
      message: error.message
    };
  }
};

/**
 * Check if staff is available
 * @param {string} staffId - Staff ID
 * @returns {Object} - Availability status
 */
export const checkStaffAvailability = async (staffId) => {
  const employee = await Employee.findById(staffId);
  
  if (!employee) {
    return { available: false, reason: 'Employee not found' };
  }
  
  if (employee.status === 'On-leave') {
    return { available: false, reason: 'Employee is on leave' };
  }
  
  if (employee.status === 'Assigned') {
    return { 
      available: false, 
      reason: `Employee assigned to event: ${employee.assignedProject}`,
      assignedEvent: employee.assignedProject
    };
  }
  
  return { available: true, employee };
};

/**
 * Check if vehicle is available
 * @param {string} vehicleId - Vehicle ID
 * @returns {Object} - Availability status
 */
export const checkVehicleAvailability = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  
  if (!vehicle) {
    return { available: false, reason: 'Vehicle not found' };
  }
  
  if (vehicle.status === 'maintenance') {
    return { available: false, reason: 'Vehicle is under maintenance' };
  }
  
  if (vehicle.status === 'assigned') {
    return { 
      available: false, 
      reason: `Vehicle assigned to event: ${vehicle.assignedEvent}`,
      assignedEvent: vehicle.assignedEvent
    };
  }
  
  return { available: true, vehicle };
};

/**
 * Get all locked resources for a booking
 * @param {string} bookingId - Booking ID
 * @returns {Object} - Locked resources
 */
export const getLockedResources = async (bookingId) => {
  const lockedStaff = await Employee.find({ assignedProject: bookingId });
  const lockedVehicles = await Vehicle.find({ assignedEvent: bookingId });
  
  return {
    staff: lockedStaff.map(s => ({
      id: s._id,
      name: s.name,
      empType: s.empType,
      status: s.status
    })),
    vehicles: lockedVehicles.map(v => ({
      id: v._id,
      name: v.name,
      vehicleNumber: v.vehicleNumber,
      status: v.status
    }))
  };
};

export default {
  lockStaff,
  lockVehicles,
  releaseStaff,
  releaseVehicles,
  checkStaffAvailability,
  checkVehicleAvailability,
  getLockedResources
};
