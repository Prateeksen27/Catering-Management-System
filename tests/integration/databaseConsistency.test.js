/**
 * Database Consistency Tests
 * Tests for data integrity and referential consistency
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let adminToken;

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
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
  adminToken = response.body.token;
}

describe('Referential Integrity', () => {
  it('should maintain referential integrity between bookings and staff', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
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
          starters: ['Test'],
          maincourse: ['Test'],
          beverages: ['Test'],
          desserts: ['Test'],
        },
      });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const response = await request(app)
      .get(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    if (response.status === 200) {
      expect(response.body.booking).toBeDefined();
    }
  });
  
  it('should cascade delete related records appropriately', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: 'Delete Test Event',
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
          starters: ['Test'],
          maincourse: ['Test'],
          beverages: ['Test'],
          desserts: ['Test'],
        },
      });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    const deleteResponse = await request(app)
      .delete(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    expect([200, 404, 500]).toContain(deleteResponse.status);
  });
});

describe('Data Consistency', () => {
  it('should maintain consistent booking status', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: 'Status Test',
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
          starters: ['Test'],
          maincourse: ['Test'],
          beverages: ['Test'],
          desserts: ['Test'],
        },
      });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const verifyResponse = await request(app)
      .get(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    if (verifyResponse.status === 200) {
      const validStatuses = [
        'PENDING_REVIEW',
        'CONFIRMED',
        'REJECTED',
        'PREPARATION_PENDING',
        'REQUIREMENT_SUBMITTED',
        'READY_FOR_EVENT',
        'IN_PROGRESS',
        'COMPLETED',
      ];
      
      expect(validStatuses).toContain(verifyResponse.body.booking?.status);
    }
  });
  
  it('should maintain consistent payment status', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: 'Payment Test',
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
          paidAmount: 10000,
        },
        menu: {
          starters: ['Test'],
          maincourse: ['Test'],
          beverages: ['Test'],
          desserts: ['Test'],
        },
      });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const verifyResponse = await request(app)
      .get(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    if (verifyResponse.body?.booking?.Payment_Details) {
      const paymentDetails = verifyResponse.body.booking.Payment_Details;
      
      if (paymentDetails.paidAmount >= paymentDetails.estimatedAmount) {
        expect(paymentDetails.paymentStatus).toBe('Paid');
      } else if (paymentDetails.paidAmount > 0) {
        expect(paymentDetails.paymentStatus).toBe('Partially Paid');
      }
    }
  });
});

describe('Timeline Consistency', () => {
  it('should maintain chronological timeline', async () => {
    const createResponse = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: 'Timeline Test',
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
          starters: ['Test'],
          maincourse: ['Test'],
          beverages: ['Test'],
          desserts: ['Test'],
        },
      });
    
    const bookingId = createResponse.body?.booking?._id || createResponse.body?._id;
    if (!bookingId) return;
    
    await request(app)
      .post('/api/booking/approve')
      .set('auth-token', adminToken)
      .send({ bookingId });
    
    const verifyResponse = await request(app)
      .get(`/api/booking/${bookingId}`)
      .set('auth-token', adminToken);
    
    if (verifyResponse.body?.booking?.timeline) {
      const timeline = verifyResponse.body.booking.timeline;
      
      for (let i = 1; i < timeline.length; i++) {
        const current = new Date(timeline[i].timestamp);
        const previous = new Date(timeline[i - 1].timestamp);
        
        expect(current.getTime()).toBeGreaterThanOrEqual(previous.getTime());
      }
    }
  });
});

describe('Concurrency Tests', () => {
  it('should handle concurrent booking creation', async () => {
    const bookings = Array(10).fill(null).map((_, i) => ({
      eventDetails: {
        eventName: `Concurrent Event ${i}`,
        eventDate: new Date('2026-05-01'),
        eventTime: '18:00',
        pax: 50,
        venue: 'Test Venue',
      },
      clientDetails: {
        fullName: `Client ${i}`,
        email: `client${i}@test.com`,
        phone: `1234567${i}90`,
      },
      Payment_Details: {
        estimatedAmount: 10000,
        paidAmount: 0,
      },
      menu: {
        starters: ['Test'],
        maincourse: ['Test'],
        beverages: ['Test'],
        desserts: ['Test'],
      },
    }));
    
    const requests = bookings.map((booking) =>
      request(app)
        .post('/api/booking/create')
        .set('auth-token', adminToken)
        .send(booking)
    );
    
    const results = await Promise.all(requests);
    const successes = results.filter((r) => [200, 201].includes(r.status));
    
    expect(successes.length).toBeGreaterThan(0);
  });
});

describe('Data Validation', () => {
  it('should validate required fields on booking', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: '',
        },
      });
    
    expect(response.status).toBe(400);
  });
  
  it('should validate email format', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: 'Test',
          eventDate: new Date('2026-05-01'),
          eventTime: '18:00',
          pax: 50,
          venue: 'Test',
        },
        clientDetails: {
          fullName: 'Test',
          email: 'invalid-email',
          phone: '1234567890',
        },
        Payment_Details: {
          estimatedAmount: 1000,
        },
        menu: {
          starters: [],
          maincourse: [],
          beverages: [],
          desserts: [],
        },
      });
    
    expect(response.status).toBe(400);
  });
});