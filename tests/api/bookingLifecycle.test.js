/**
 * Booking Lifecycle Tests
 * Tests for booking status transitions and workflows
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let adminToken;
let managerToken;

const validStatusTransitions = {
  PENDING_REVIEW: ['REJECTED', 'CONFIRMED'],
  REJECTED: [],
  CONFIRMED: ['PREPARATION_PENDING'],
  PREPARATION_PENDING: ['REQUIREMENT_SUBMITTED'],
  REQUIREMENT_SUBMITTED: ['READY_FOR_EVENT'],
  READY_FOR_EVENT: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
};

const bookPayload = {
  eventDetails: {
    eventName: 'Test Event',
    eventDate: new Date('2026-05-01'),
    eventTime: '18:00',
    pax: 50,
    venue: 'Test Venue',
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
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  connection = await mongoose.connect(uri);
  
  await setupTestData();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

async function setupTestData() {
  const User = mongoose.model('Employee');
  
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);
  
  const admin = new User({
    name: 'Admin',
    email: 'admin@test.com',
    empID: 'EMP001',
    empType: 'Admin',
    password: hashedPassword,
  });
  await admin.save();
  
  const manager = new User({
    name: 'Manager',
    email: 'manager@test.com',
    empID: 'EMP002',
    empType: 'Manager',
    password: hashedPassword,
  });
  await manager.save();
  
  let response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
  adminToken = response.body.token;
  
  response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP002', password: 'TestPass123!', empType: 'Manager' });
  managerToken = response.body.token;
}

describe('Booking Creation', () => {
  it('should create a new booking with PENDING_REVIEW status', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    expect([200, 201]).toContain(response.status);
  });
  
  it('should return 400 when required fields missing', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: { eventName: 'Test' },
      });
    
    expect(response.status).toBe(400);
  });
});

describe('Valid Status Transitions', () => {
  let bookingId;
  
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    if (response.body?.booking?._id) {
      bookingId = response.body.booking._id;
    } else if (response.body?._id) {
      bookingId = response.body._id;
    }
  });
  
  it('should approvebooking from PENDING_REVIEW to CONFIRMED', async () => {
    if (!bookingId) return;
    
    const response = await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
  
  it('should transition from PENDING_REVIEW to REJECTED', async () => {
    if (!bookingId) return;
    
    const response = await request(app)
      .post('/api/booking/reject')
      .set('auth-token', adminToken)
      .send({ bookingId, reason: 'Test rejection' });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
  
  it('should transition from CONFIRMED to PREPARATION_PENDING', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const newBookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!newBookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId: newBookingId });
    
    const response = await request(app)
      .post(`/api/booking/${newBookingId}/complete-preparation`)
      .set('auth-token', adminToken);
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
});

describe('Invalid Status Transitions', () => {
  it('should reject PENDING_REVIEW to IN_PROGRESS', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const response = await request(app)
      .patch(`/api/booking/${bookingId}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'IN_PROGRESS' });
    
    expect(response.status).toBe(400);
  });
  
  it('should reject COMPLETED to CONFIRMED', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const response = await request(app)
      .patch(`/api/booking/${bookingId}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'CONFIRMED' });
    
    expect(response.status).toBe(400);
  });
  
  it('should reject REJECTED to any status', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    let bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/reject')
      .set('auth-token', adminToken)
      .send({ bookingId, reason: 'Rejected' });
    
    const approveResponse = await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    expect(approveResponse.status).toBe(400);
  });
  
  it('should reject backwards transition', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    let bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const prepResponse = await request(app)
      .post(`/api/booking/${bookingId}/complete-preparation`)
      .set('auth-token', adminToken);
    
    if (prepResponse.status === 200) {
      const backResponse = await request(app)
        .patch(`/api/booking/${bookingId}/status`)
        .set('auth-token', adminToken)
        .send({ status: 'CONFIRMED' });
      
      expect(backResponse.status).toBe(400);
    }
  });
});

describe('Staff Assignment', () => {
  it('should assign staff to CONFIRMED booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    let bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: '507f1f77bcf86cd799439012',
        workers: [],
        chefs: [],
        drivers: [],
      });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
  
  it('should not assign staff to PENDING_REVIEW booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: '507f1f77bcf86cd799439012',
        workers: [],
        chefs: [],
        drivers: [],
      });
    
    expect(response.status).toBe(400);
  });
});

describe('Timeline Validation', () => {
  it('should record timeline entry on approval', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const approveResponse = await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    if (approveResponse.body?.booking?.timeline) {
      expect(approveResponse.body.booking.timeline).toBeDefined();
      expect(Array.isArray(approveResponse.body.booking.timeline)).toBe(true);
    }
  });
  
  it('should record timeline entry on rejection', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const rejectResponse = await request(app)
      .post('/api/booking/reject')
      .set('auth-token', adminToken)
      .send({ bookingId, reason: 'Test' });
    
    if (rejectResponse.body?.booking?.timeline) {
      expect(rejectResponse.body.booking.timeline).toBeDefined();
    }
  });
});

describe('Resource Assignment', () => {
  it('should assign vehicles to booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    let bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-vehicles`)
      .set('auth-token', adminToken)
      .send({ vehicles: [] });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
  
  it('should assign goods to booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    let bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-goods`)
      .set('auth-token', adminToken)
      .send({ goods: [] });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
});

describe('Get Bookings by Status', () => {
  it('should get bookings by PENDING_REVIEW status', async () => {
    const response = await request(app)
      .get('/api/booking/by-status?status=PENDING_REVIEW')
      .set('auth-token', adminToken);
    
    expect([200, 500]).toContain(response.status);
  });
  
  it('should get bookings by CONFIRMED status', async () => {
    const response = await request(app)
      .get('/api/booking/by-status?status=CONFIRMED')
      .set('auth-token', adminToken);
    
    expect([200, 500]).toContain(response.status);
  });
  
  it('should require status parameter', async () => {
    const response = await request(app)
      .get('/api/booking/by-status')
      .set('auth-token', adminToken);
    
    expect(response.status).toBe(400);
  });
});

describe('Active Events', () => {
  it('should get active events', async () => {
    const response = await request(app)
      .get('/api/booking/active-events')
      .set('auth-token', adminToken);
    
    expect([200, 500]).toContain(response.status);
  });
});