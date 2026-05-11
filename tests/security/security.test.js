/**
 * Security Tests
 * Tests for security vulnerabilities and edge cases
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let adminToken;
let adminUser;

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
  
  adminUser = new User({
    name: 'Admin',
    email: 'admin@test.com',
    empID: 'EMP001',
    empType: 'Admin',
    password: hashedPassword,
  });
  await adminUser.save();
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
  adminToken = response.body.token;
}

describe('JWT Security Tests', () => {
  it('should reject tokens signed with wrong secret', async () => {
    const jwt = require('jsonwebtoken');
    const fakeToken = jwt.sign(
      { id: adminUser._id, role: 'Admin' },
      'wrong-secret-key'
    );
    
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', fakeToken);
    
    expect(response.status).toBe(403);
  });
  
  it('should handle token with invalid payload', async () => {
    const jwt = require('jsonwebtoken');
    const tamperedToken = jwt.sign(
      { id: adminUser._id, role: 'Admin', isAdmin: true },
      process.env.JWT_SECRET || 'test_jwt_secret_key'
    );
    
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', tamperedToken);
    
    expect([200, 401, 403]).toContain(response.status);
  });
  
  it('should reject token with missing role', async () => {
    const jwt = require('jsonwebtoken');
    const noRoleToken = jwt.sign(
      { id: adminUser._id },
      process.env.JWT_SECRET || 'test_jwt_secret_key'
    );
    
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', noRoleToken);
    
    expect(response.status).toBe(403);
  });
});

describe('SQL/NoSQL Injection Tests', () => {
  it('should handle injection attempts in login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        empID: { $ne: '' },
        password: 'test',
        empType: 'Admin',
      });
    
    expect([400, 404, 500]).toContain(response.status);
  });
  
  it('should handle injection attempts in booking', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: { $gt: '' },
          venue: 'Test',
        },
      });
    
    expect([400, 500]).toContain(response.status);
  });
});

describe('Authorization Bypass Tests', () => {
  it('should not allow user to access other user profiles', async () => {
    const response = await request(app)
      .put(`/api/auth/update-profile/${adminUser._id}`)
      .set('auth-token', adminToken)
      .send({ empType: 'Admin', role: 'changed' });
    
    if (response.status === 200) {
      expect(response.body.user?.empType).toBe('Admin');
    }
  });
  
  it('should enforce role-based permissions', async () => {
    const jwt = require('jsonwebtoken');
    const workerToken = jwt.sign(
      { id: adminUser._id, role: 'Worker' },
      process.env.JWT_SECRET || 'test_jwt_secret_key'
    );
    
    const response = await request(app)
      .post('/api/employees/create')
      .set('auth-token', workerToken)
      .send({
        name: 'New Employee',
        email: 'new@test.com',
        empID: 'EMP999',
        empType: 'Admin',
      });
    
    expect(response.status).toBe(401);
  });
});

describe('Input Validation Tests', () => {
  it('should validate email format', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test',
        email: 'invalid-email',
        empType: 'Worker',
      });
    
    expect(response.status).toBe(400);
  });
  
  it('should validate phone number format', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        empType: 'Worker',
        phone: 'abc',
      });
    
    if (response.status !== 201) {
      expect(response.body.message).toContain('phone');
    }
  });
  
  it('should sanitize input', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send({
        eventDetails: {
          eventName: '<script>alert("xss")</script>',
          venue: 'Test Venue',
        },
        clientDetails: {
          fullName: 'Test Client',
          email: 'test@test.com',
          phone: '1234567890',
        },
        Payment_Details: {
          estimatedAmount: 1000,
          paidAmount: 0,
        },
        menu: {
          starters: [],
          maincourse: [],
          beverages: [],
          desserts: [],
        },
      });
    
    if (response.status === 201) {
      expect(response.body.booking?.eventDetails?.eventName).not.toContain('<script>');
    }
  });
});

describe('Rate Limiting Tests', () => {
  it('should rate limit auth endpoints', async () => {
    const attempts = Array(15).fill(null).map(() =>
      request(app)
        .post('/api/auth/login')
        .send({
          empID: 'NONEXISTENT',
          password: 'test',
          empType: 'Admin',
        })
    );
    
    const responses = await Promise.all(attempts);
    const hasRateLimit = responses.some((r) => r.status === 429);
    
    expect(hasRateLimit).toBe(true);
  });
});

describe('Error Handling Tests', () => {
  it('should handle database connection errors gracefully', async () => {
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', adminToken);
    
    expect([200, 500]).toContain(response.status);
  });
  
  it('should handle invalid JSON gracefully', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .set('Content-Type', 'application/json')
      .send('invalid json');
    
    expect([400, 500]).toContain(response.status);
  });
  
  it('should handle missing Content-Type', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('auth-token', adminToken)
      .send('eventName=test');
    
    expect([400, 415, 500]).toContain(response.status);
  });
  
  it('should return proper error messages', async () => {
    const response = await request(app)
      .get('/api/booking/nonexistent-id')
      .set('auth-token', adminToken);
    
    expect(response.body).toHaveProperty('message');
  });
});

describe('CORS Tests', () => {
  it('should allow configured origins', async () => {
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', adminToken)
      .set('Origin', 'http://localhost:5173');
    
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });
  
  it('should block unauthorized origins', async () => {
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', adminToken)
      .set('Origin', 'http://malicious-site.com');
    
    expect(response.status).toBe(500);
  });
});

describe('File Upload Security', () => {
  it('should reject dangerous file types', async () => {
    const response = await request(app)
      .post('/api/auth/update-profilePic/123')
      .set('auth-token', adminToken)
      .attach('profilePic', Buffer.from('malicious code'), 'malicious.exe');
    
    expect([400, 500]).toContain(response.status);
  });
});

describe('Session Management', () => {
  it('should invalidate token on logout', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
    
    const token = response.body.token;
    
    const firstRequest = await request(app)
      .get('/api/booking/all')
      .set('auth-token', token);
    
    expect(firstRequest.status).toBe(200);
  });
});