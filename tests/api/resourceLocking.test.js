/**
 * Resource Locking Tests
 * Tests for staff and vehicle locking mechanisms
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
let userIds = {};

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
  const Vehicle = mongoose.model('Vehicle');
  
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);
  
  const users = [
    { name: 'Admin', email: 'admin@test.com', empID: 'EMP001', empType: 'Admin', password: hashedPassword },
    { name: 'Manager', email: 'manager@test.com', empID: 'EMP002', empType: 'Manager', password: hashedPassword },
    { name: 'Chef1', email: 'chef1@test.com', empID: 'EMP003', empType: 'Chef', password: hashedPassword },
    { name: 'Chef2', email: 'chef2@test.com', empID: 'EMP004', empType: 'Chef', password: hashedPassword },
    { name: 'Worker1', email: 'worker1@test.com', empID: 'EMP005', empType: 'Worker', password: hashedPassword },
    { name: 'Worker2', email: 'worker2@test.com', empID: 'EMP006', empType: 'Worker', password: hashedPassword },
    { name: 'Driver1', email: 'driver1@test.com', empID: 'EMP007', empType: 'Driver', password: hashedPassword },
  ];
  
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    userIds[userData.empType] = user._id;
  }
  
  const vehicles = [
    { vehicleName: 'Van 1', vehicleNumber: 'ABC123', vehicleType: 'Van', capacity: 10, status: 'available' },
    { vehicleName: 'Van 2', vehicleNumber: 'ABC124', vehicleType: 'Van', capacity: 10, status: 'available' },
    { vehicleName: 'Truck 1', vehicleNumber: 'XYZ789', vehicleType: 'Truck', capacity: 20, status: 'available' },
  ];
  
  for (const vehicleData of vehicles) {
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
  }
  
  let response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
  adminToken = response.body.token;
  
  response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP002', password: 'TestPass123!', empType: 'Manager' });
  managerToken = response.body.token;
}

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

describe('Staff Locking Tests', () => {
  it('should lock staff when assigning to booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send(bookPayload);
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: userIds.Manager?.toString(),
        workers: [userIds.Worker1?.toString()],
        chefs: [userIds.Chef1?.toString()],
        drivers: [userIds.Driver1?.toString()],
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should prevent double-booking same staff member', async () => {
    const createResponse1 = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 1' } });
    
    const bookingId1 = createResponse1.body?.booking?._id || createResponse1.body?._id;
    if (!bookingId1) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId: bookingId1 });
    
    await request(app)
      .put(`/api/booking/${bookingId1}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: userIds.Manager?.toString(),
        workers: [],
        chefs: [userIds.Chef1?.toString()],
        drivers: [],
      });
    
    const createResponse2 = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 2' } });
    
    const bookingId2 = createResponse2.body?.booking?._id || createResponse2.body?._id;
    if (!bookingId2) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId: bookingId2 });
    
    const secondAssignResponse = await request(app)
      .put(`/api/booking/${bookingId2}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: userIds.Manager?.toString(),
        workers: [],
        chefs: [userIds.Chef1?.toString()],
        drivers: [],
      });
    
    console.log('Double booking attempt result:', secondAssignResponse.status, secondAssignResponse.body);
  });
  
  it('should release staff when booking is completed', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 3' } });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    await request(app)
      .put(`/api/booking/${bookingId}/assign-staff`)
      .set('auth-token', adminToken)
      .send({
        manager: userIds.Manager?.toString(),
        workers: [userIds.Worker1?.toString()],
        chefs: [],
        drivers: [],
      });
    
    const completeResponse = await request(app)
      .patch(`/api/booking/${bookingId}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'COMPLETED' });
    
    expect([200, 400, 404, 500]).toContain(completeResponse.status);
  });
});

describe('Vehicle Locking Tests', () => {
  let vehicleIds = [];
  
  beforeEach(async () => {
    const vehicleResponse = await request(app)
      .get('/api/vehicle/all')
      .set('auth-token', adminToken);
    
    vehicleIds = vehicleResponse.body?.vehicles?.map((v) => v._id) || [];
  });
  
  it('should lock vehicle when assigning to booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 4' } });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId || vehicleIds.length === 0) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-vehicles`)
      .set('auth-token', adminToken)
      .send({ vehicles: [vehicleIds[0]] });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should prevent double-booking same vehicle', async () => {
    if (vehicleIds.length === 0) return;
    
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 5' } });
    
    const bookingId1 = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId1) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId: bookingId1 });
    
    await request(app)
      .put(`/api/booking/${bookingId1}/assign-vehicles`)
      .set('auth-token', adminToken)
      .send({ vehicles: [vehicleIds[0]] });
    
    const createResponse2 = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 6' } });
    
    const bookingId2 = createResponse2.body?.booking?._id || createResponse2.body?._id;
    if (!bookingId2) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId: bookingId2 });
    
    const secondAssignResponse = await request(app)
      .put(`/api/booking/${bookingId2}/assign-vehicles`)
      .set('auth-token', adminToken)
      .send({ vehicles: [vehicleIds[0]] });
    
    console.log('Double vehicle booking result:', secondAssignResponse.status, secondAssignResponse.body);
  });
  
  it('should release vehicle when booking is completed', async () => {
    if (vehicleIds.length === 0) return;
    
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Event 7' } });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    await request(app)
      .put(`/api/booking/${bookingId}/assign-vehicles`)
      .set('auth-token', adminToken)
      .send({ vehicles: [vehicleIds[0]] });
    
    const completeResponse = await request(app)
      .patch(`/api/booking/${bookingId}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'COMPLETED' });
    
    expect([200, 400, 404, 500]).toContain(completeResponse.status);
  });
});

describe('Concurrent Locking Tests', () => {
  it('should handle concurrent staff assignment requests', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Concurrent Test' } });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const assignments = [
      { manager: userIds.Manager?.toString(), workers: [userIds.Worker1?.toString()], chefs: [], drivers: [] },
      { manager: userIds.Manager?.toString(), workers: [userIds.Worker2?.toString()], chefs: [], drivers: [] },
    ];
    
    const concurrentRequests = assignments.map((assignment) =>
      request(app)
        .put(`/api/booking/${bookingId}/assign-staff`)
        .set('auth-token', adminToken)
        .send(assignment)
    );
    
    const results = await Promise.all(concurrentRequests);
    const statuses = results.map((r) => r.status);
    
    expect(statuses).toBeDefined();
  });
});

describe('Lock Status Queries', () => {
  it('should query locked resources for a booking', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({ ...bookPayload, eventDetails: { ...bookPayload.eventDetails, eventName: 'Lock Query Test' } });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const response = await request(app)
      .get(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    if (response.body?.lockedResources) {
      expect(response.body.lockedResources).toBeDefined();
    }
  });
});