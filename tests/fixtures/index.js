/**
 * Test Fixtures
 * Shared test data for all test suites
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';

/**
 * Generate a hashed password for testing
 */
async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Generate a valid JWT token
 */
function generateToken(user, expiresIn = '1h') {
  return jwt.sign({ id: user._id, role: user.empType }, JWT_SECRET, { expiresIn });
}

/**
 * Generate an expired JWT token
 */
function generateExpiredToken(user) {
  return jwt.sign({ id: user._id, role: user.empType }, JWT_SECRET, { expiresIn: '-1h' });
}

/**
 * Test Users
 */
const testUsers = {
  admin: {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Admin',
    email: 'admin@test.com',
    empID: 'EMP001',
    empType: 'Admin',
    phone: '1234567890',
    location: 'Test Location',
    skills: ['management'],
    password: 'TestPass123!',
    status: 'Active',
    isAdmin: true,
  },
  manager: {
    _id: '507f1f77bcf86cd799439012',
    name: 'Test Manager',
    email: 'manager@test.com',
    empID: 'EMP002',
    empType: 'Manager',
    phone: '1234567891',
    location: 'Test Location',
    skills: ['planning', 'coordination'],
    password: 'TestPass123!',
    status: 'Active',
  },
  chef: {
    _id: '507f1f77bcf86cd799439013',
    name: 'Test Chef',
    email: 'chef@test.com',
    empID: 'EMP003',
    empType: 'Chef',
    phone: '1234567892',
    location: 'Test Location',
    skills: ['cooking', 'menu planning'],
    password: 'TestPass123!',
    status: 'Active',
  },
  worker: {
    _id: '507f1f77bcf86cd799439014',
    name: 'Test Worker',
    email: 'worker@test.com',
    empID: 'EMP004',
    empType: 'Worker',
    phone: '1234567893',
    location: 'Test Location',
    skills: ['setup', 'cleaning'],
    password: 'TestPass123!',
    status: 'Active',
  },
  driver: {
    _id: '507f1f77bcf86cd799439015',
    name: 'Test Driver',
    email: 'driver@test.com',
    empID: 'EMP005',
    empType: 'Driver',
    phone: '1234567894',
    location: 'Test Location',
    skills: ['driving'],
    password: 'TestPass123!',
    status: 'Active',
  },
};

/**
 * Test Bookings
 */
const testBookings = {
  pending: {
    _id: '607f1f77bcf86cd799439021',
    bookingId: 'PBK0001',
    eventDetails: {
      eventName: 'Test Birthday Party',
      eventDate: new Date('2026-05-01'),
      eventTime: '18:00',
      pax: 50,
      venue: 'Test Venue',
      notes: 'Test booking for birthday party',
    },
    clientDetails: {
      fullName: 'John Doe',
      email: 'john@test.com',
      phone: '9876543210',
    },
    priority: 'High',
    Payment_Details: {
      estimatedAmount: 15000,
      paidAmount: 5000,
      paymentMethods: 'cash',
      transactionId: 'TXN001',
    },
    menu: {
      starters: ['Spring Rolls', 'Paneer Tikka'],
      maincourse: ['Biryani', 'Dal Makhani'],
      beverages: ['Mocktails', 'water'],
      desserts: ['Ice Cream', 'Gulab Jamun'],
    },
    status: 'PENDING_REVIEW',
    timeline: [],
    assignedStaff: {
      manager: null,
      workers: [],
      chefs: [],
      drivers: [],
    },
    assignedGoods: [],
    assignedVehicles: [],
    requirementStatus: 'Pending',
  },
  confirmed: {
    _id: '607f1f77bcf86cd799439022',
    bookingId: 'PBK0002',
    eventDetails: {
      eventName: 'Test Corporate Event',
      eventDate: new Date('2026-05-15'),
      eventTime: '12:00',
      pax: 100,
      venue: 'Corporate Hall',
      notes: 'Corporate lunch event',
    },
    clientDetails: {
      fullName: 'Jane Smith',
      email: 'jane@corporate.com',
      phone: '9876543211',
    },
    priority: 'Medium',
    Payment_Details: {
      estimatedAmount: 25000,
      paidAmount: 10000,
      paymentMethods: 'bank_transfer',
      transactionId: 'TXN002',
    },
    menu: {
      starters: ['Soup', 'Bread Pakora'],
      maincourse: ['Paneer Butter Masala', 'Jeera Rice'],
      beverages: ['Lassi', 'Buttermilk'],
      desserts: ['Rasgulla'],
    },
    status: 'CONFIRMED',
    timeline: [
      {
        action: 'Booking Approved',
        timestamp: new Date(),
        performedBy: 'Admin',
        notes: 'Booking confirmed by admin',
      },
    ],
    assignedStaff: {
      manager: null,
      workers: [],
      chefs: [],
      drivers: [],
    },
    assignedGoods: [],
    assignedVehicles: [],
    requirementStatus: 'Pending',
  },
  inProgress: {
    _id: '607f1f77bcf86cd799439023',
    bookingId: 'BOOK0001',
    eventDetails: {
      eventName: 'Test Wedding',
      eventDate: new Date('2026-04-20'),
      eventTime: '10:00',
      pax: 200,
      venue: 'Grand Ballroom',
      notes: 'Wedding reception',
    },
    clientDetails: {
      fullName: 'Wedding Client',
      email: 'wedding@test.com',
      phone: '9876543212',
    },
    priority: 'High',
    Payment_Details: {
      estimatedAmount: 50000,
      paidAmount: 50000,
      paymentMethods: 'bank_transfer',
      transactionId: 'TXN003',
    },
    menu: {
      starters: [' assortment'],
      maincourse: [' variety'],
      beverages: [' assortment'],
      desserts: [' assortment'],
    },
    bookingStatus: 'IN_PROGRESS',
    timeline: [],
    assignedStaffDetails: {
      manager: '507f1f77bcf86cd799439012',
      workers: [],
      chefs: [],
      drivers: [],
    },
    assignedVehicles: [],
  },
};

/**
 * Test Store Items
 */
const testStoreItems = {
  equipment: {
    _id: '707f1f77bcf86cd799439031',
    itemName: 'Chafing Dish',
    category: 'equipment',
    currentStock: 10,
    unit: 'pieces',
    minStockLevel: 2,
  },
  supplies: {
    _id: '707f1f77bcf86cd799439032',
    itemName: 'Paper Napkins',
    category: 'supplies',
    currentStock: 500,
    unit: 'pieces',
    minStockLevel: 100,
  },
  furniture: {
    _id: '707f1f77bcf86cd799439033',
    itemName: 'Round Tables',
    category: 'furniture',
    currentStock: 20,
    unit: 'pieces',
    minStockLevel: 5,
  },
};

/**
 * Test Vehicles
 */
const testVehicles = {
  available: {
    _id: '807f1f77bcf86cd799439041',
    vehicleName: 'Test Van 1',
    vehicleNumber: 'ABC 123',
    vehicleType: 'Van',
    capacity: 10,
    status: 'available',
  },
  assigned: {
    _id: '807f1f77bcf86cd799439042',
    vehicleName: 'Test Van 2',
    vehicleNumber: 'XYZ 789',
    vehicleType: 'Van',
    capacity: 10,
    status: 'assigned',
  },
};

/**
 * Test Tickets
 */
const testTickets = {
  openTicket: {
    _id: '907f1f77bcf86cd799439051',
    title: 'Test Task - Grocery Collection',
    description: 'Collect grocery requirements from chef',
    assignedTo: '507f1f77bcf86cd799439012',
    status: 'Open',
    priority: 'High',
    relatedBooking: '607f1f77bcf86cd799439022',
    dueDate: new Date('2026-04-15'),
  },
  completedTicket: {
    _id: '907f1f77bcf86cd799439052',
    title: 'Test Task - Setup',
    description: 'Setup venue for event',
    assignedTo: '507f1f77bcf86cd799439014',
    status: 'Completed',
    priority: 'Medium',
    relatedBooking: '607f1f77bcf86cd799439023',
    dueDate: new Date('2026-04-19'),
  },
};

/**
 * Test Menu Items
 */
const testMenuItems = {
  starters: [
    { _id: 'a07f1f77bcf86cd799439061', name: 'Spring Rolls', category: 'starters' },
    { _id: 'a07f1f77bcf86cd799439062', name: 'Paneer Tikka', category: 'starters' },
  ],
  maincourse: [
    { _id: 'a07f1f77bcf86cd799439063', name: 'Biryani', category: 'maincourse' },
    { _id: 'a07f1f77bcf86cd799439064', name: 'Dal Makhani', category: 'maincourse' },
  ],
  beverages: [
    { _id: 'a07f1f77bcf86cd799439065', name: 'Mocktails', category: 'beverages' },
    { _id: 'a07f1f77bcf86cd799439066', name: 'Lassi', category: 'beverages' },
  ],
  desserts: [
    { _id: 'a07f1f77bcf86cd799439067', name: 'Ice Cream', category: 'desserts' },
    { _id: 'a07f1f77bcf86cd799439068', name: 'Gulab Jamun', category: 'desserts' },
  ],
};

/**
 * Invalid test data
 */
const invalidData = {
  emails: [
    'invalid',
    'invalid@',
    '@domain.com',
    'invalid@.com',
    'invalid domain.com',
  ],
  phones: [
    '123',
    'abc123def',
    '12345678901',
    '123456789',
    '',
  ],
  passwords: [
    'short',
    '1234567',
    'NoNumber',
    'NoSpecial1',
  ],
};

/**
 * API endpoints
 */
const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    updateProfile: (id) => `/api/auth/update-profile/${id}`,
  },
  booking: {
    create: '/api/booking/create',
    getAll: '/api/booking/all',
    getById: (id) => `/api/booking/${id}`,
    confirm: '/api/booking/confirm',
    reject: '/api/booking/reject',
    approve: '/api/booking/approve',
    assignStaff: (id) => `/api/booking/${id}/assign-staff`,
    assignGoods: (id) => `/api/booking/${id}/assign-goods`,
    assignVehicles: (id) => `/api/booking/${id}/assign-vehicles`,
    completePreparation: (id) => `/api/booking/${id}/complete-preparation`,
    updateStatus: (id) => `/api/booking/${id}/status`,
    byStatus: '/api/booking/by-status',
    activeEvents: '/api/booking/active-events',
  },
  employees: {
    create: '/api/employees/create',
    getAll: '/api/employees/all',
    getById: (id) => `/api/employees/${id}`,
    update: (id) => `/api/employees/${id}`,
    delete: (id) => `/api/employees/${id}`,
    assignWork: '/api/employees/assign-work',
  },
  menu: {
    create: '/api/menu/create',
    getAll: '/api/menu/all',
    getById: (id) => `/api/menu/${id}`,
    update: (id) => `/api/menu/${id}`,
    delete: (id) => `/api/menu/${id}`,
  },
  store: {
    create: '/api/store/create',
    getAll: '/api/store/all',
    getById: (id) => `/api/store/${id}`,
    update: (id) => `/api/store/${id}`,
    delete: (id) => `/api/store/${id}`,
  },
  vehicle: {
    create: '/api/vehicle/create',
    getAll: '/api/vehicle/all',
    getById: (id) => `/api/vehicle/${id}`,
    update: (id) => `/api/vehicle/${id}`,
    delete: (id) => `/api/vehicle/${id}`,
  },
  inventory: {
    create: '/api/inventory/create',
    getAll: '/api/inventory/all',
    getById: (id) => `/api/inventory/${id}`,
    update: (id) => `/api/inventory/${id}`,
  },
  tickets: {
    create: '/api/tickets/create',
    getAll: '/api/tickets/all',
    getById: (id) => `/api/tickets/${id}`,
    update: (id) => `/api/tickets/${id}`,
  },
  chefRequirements: {
    create: '/api/chef-requirements/create',
    getAll: '/api/chef-requirements/all',
    getByBookingId: (bookingId) => `/api/chef-requirements/${bookingId}`,
    update: (id) => `/api/chef-requirements/${id}`,
  },
};

/**
 * Expected role permissions
 */
const rolePermissions = {
  Admin: {
    dashboard: '/dashboard/admin',
    canManageEmployees: true,
    canManageBookings: true,
    canAccessReports: true,
    canAssignWork: true,
    canUpdateBookingStatus: true,
  },
  Manager: {
    dashboard: '/dashboard/manager',
    canManageEmployees: false,
    canManageBookings: true,
    canAccessReports: false,
    canAssignWork: true,
    canUpdateBookingStatus: true,
  },
  Chef: {
    dashboard: '/dashboard/chef',
    canManageEmployees: false,
    canManageBookings: false,
    canAccessReports: false,
    canAssignWork: false,
    canUpdateBookingStatus: false,
    canSubmitRequirements: true,
    canAccessMenu: true,
  },
  Worker: {
    dashboard: '/dashboard/worker',
    canManageEmployees: false,
    canManageBookings: false,
    canAccessReports: false,
    canAssignWork: false,
    canUpdateBookingStatus: false,
    canViewAssignedWork: true,
  },
  Driver: {
    dashboard: '/dashboard/driver',
    canManageEmployees: false,
    canManageBookings: false,
    canAccessReports: false,
    canAssignWork: false,
    canUpdateBookingStatus: false,
    canViewVehicles: true,
  },
};

/**
 * Status transition map
 */
const validTransitions = {
  PENDING_REVIEW: ['REJECTED', 'CONFIRMED'],
  REJECTED: [],
  CONFIRMED: ['PREPARATION_PENDING'],
  PREPARATION_PENDING: ['REQUIREMENT_SUBMITTED'],
  REQUIREMENT_SUBMITTED: ['READY_FOR_EVENT'],
  READY_FOR_EVENT: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
};

module.exports = {
  hashPassword,
  generateToken,
  generateExpiredToken,
  testUsers,
  testBookings,
  testStoreItems,
  testVehicles,
  testTickets,
  testMenuItems,
  invalidData,
  apiEndpoints,
  rolePermissions,
  validTransitions,
  JWT_SECRET,
};