/**
 * Test Helper Utilities
 * Common functions for API testing
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';

/**
 * Create a supertest agent with authentication
 */
async function createAuthenticatedAgent(app, user) {
  const agent = request.agent(app);
  
  const response = await agent
    .post('/api/auth/login')
    .send({ empID: user.empID, password: user.password, empType: user.empType });
  
  if (response.status === 200 && response.body.token) {
    agent.set('auth-token', response.body.token);
  }
  
  return agent;
}

/**
 * Make authenticated request
 */
async function authRequest(agent, method, path, token) {
  return agent[method](path).set('auth-token', token);
}

/**
 * Create test employee data
 */
function createEmployeeData(overrides = {}) {
  return {
    name: 'Test Employee',
    email: `test${Date.now()}@test.com`,
    empID: `EMP${Date.now()}`,
    empType: 'Worker',
    phone: '1234567890',
    location: 'Test Location',
    skills: ['test skill'],
    password: 'TestPass123!',
    ...overrides,
  };
}

/**
 * Create test booking data
 */
function createBookingData(overrides = {}) {
  return {
    eventDetails: {
      eventName: overrides.eventName || 'Test Event',
      eventDate: overrides.eventDate || new Date('2026-05-01'),
      eventTime: '18:00',
      pax: 50,
      venue: 'Test Venue',
      notes: 'Test notes',
    },
    clientDetails: {
      fullName: 'Test Client',
      email: 'test@client.com',
      phone: '1234567890',
    },
    Payment_Details: {
      estimatedAmount: 10000,
      paidAmount: 0,
    },
    menu: {
      starters: ['Test Starter'],
      maincourse: ['Test Main'],
      beverages: ['Test Beverage'],
      desserts: ['Test Dessert'],
    },
    priority: 'Medium',
    ...overrides,
  };
}

/**
 * Create test store item data
 */
function createStoreItemData(overrides = {}) {
  return {
    itemName: `Test Item ${Date.now()}`,
    category: 'equipment',
    currentStock: 100,
    unit: 'pieces',
    minStockLevel: 10,
    ...overrides,
  };
}

/**
 * Create test vehicle data
 */
function createVehicleData(overrides = {}) {
  return {
    vehicleName: `Test Vehicle ${Date.now()}`,
    vehicleNumber: `ABC${Date.now().toString().slice(-4)}`,
    vehicleType: 'Van',
    capacity: 10,
    status: 'available',
    ...overrides,
  };
}

/**
 * Create test ticket data
 */
function createTicketData(overrides = {}) {
  return {
    title: 'Test Task',
    description: 'Test Description',
    assignedTo: overrides.assignedTo || null,
    status: 'Open',
    priority: 'High',
    relatedBooking: overrides.relatedBooking || null,
    dueDate: new Date('2026-05-01'),
    ...overrides,
  };
}

/**
 * Verify response structure
 */
function verifyResponse(response, expectedStatus) {
  return {
    status: expectedStatus,
    body: response.body,
    success: response.status === expectedStatus,
  };
}

/**
 * Extract error message
 */
function extractErrorMessage(response) {
  return response.body?.message || response.body?.error || 'Unknown error';
}

/**
 * Check for specific error
 */
function hasError(response, errorMessage) {
  const message = extractErrorMessage(response);
  return message.toLowerCase().includes(errorMessage.toLowerCase());
}

/**
 * Generate token for user
 */
function generateUserToken(user) {
  return jwt.sign(
    { id: user._id, role: user.empType },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * Generate expired token for user
 */
function generateExpiredToken(user) {
  return jwt.sign(
    { id: user._id, role: user.empType },
    JWT_SECRET,
    { expiresIn: '-1h' }
  );
}

/**
 * Wait for condition
 */
async function waitFor(condition, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  
  return false;
}

/**
 * Retry function
 */
async function retry(fn, maxAttempts = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

module.exports = {
  createAuthenticatedAgent,
  authRequest,
  createEmployeeData,
  createBookingData,
  createStoreItemData,
  createVehicleData,
  createTicketData,
  verifyResponse,
  extractErrorMessage,
  hasError,
  generateUserToken,
  generateExpiredToken,
  waitFor,
  retry,
};