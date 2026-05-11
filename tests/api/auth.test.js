/**
 * Authentication API Tests
 * Tests for /api/auth endpoints
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let testUsers;

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';

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
  
  testUsers = {
    admin: new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      empID: 'EMP001',
      empType: 'Admin',
      phone: '1234567890',
      password: hashedPassword,
      status: 'Active',
    }),
    manager: new User({
      name: 'Test Manager',
      email: 'manager@test.com',
      empID: 'EMP002',
      empType: 'Manager',
      phone: '1234567891',
      password: hashedPassword,
      status: 'Active',
    }),
    chef: new User({
      name: 'Test Chef',
      email: 'chef@test.com',
      empID: 'EMP003',
      empType: 'Chef',
      phone: '1234567892',
      password: hashedPassword,
      status: 'Active',
    }),
    worker: new User({
      name: 'Test Worker',
      email: 'worker@test.com',
      empID: 'EMP004',
      empType: 'Worker',
      phone: '1234567893',
      password: hashedPassword,
      status: 'Active',
    }),
    driver: new User({
      name: 'Test Driver',
      email: 'driver@test.com',
      empID: 'EMP005',
      empType: 'Driver',
      phone: '1234567894',
      password: hashedPassword,
      status: 'Active',
    }),
  };
  
  await User.insertMany(Object.values(testUsers));
}

describe('POST /api/auth/login', () => {
  describe('Valid Login', () => {
    it('should login admin successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: 'TestPass123!',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
    
    it('should login manager successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP002',
          password: 'TestPass123!',
          empType: 'Manager',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
    
    it('should login chef successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP003',
          password: 'TestPass123!',
          empType: 'Chef',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
    
    it('should login worker successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP004',
          password: 'TestPass123!',
          empType: 'Worker',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
    
    it('should login driver successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP005',
          password: 'TestPass123!',
          empType: 'Driver',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
  
  describe('Invalid Password', () => {
    it('should return 400 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: 'WrongPassword',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid password');
    });
    
    it('should return 400 for empty password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: '',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for null password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: null,
          empType: 'Admin',
        });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('Invalid Email/ID', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP999',
          password: 'TestPass123!',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
    
    it('should return 404 for invalid empID', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: '',
          password: 'TestPass123!',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('Invalid empType', () => {
    it('should return 404 for mismatched empType', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: 'TestPass123!',
          empType: 'Manager',
        });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('Missing Required Fields', () => {
    it('should return 500 for missing empID', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'TestPass123!',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(500);
    });
    
    it('should return 500 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(500);
    });
    
    it('should return 500 for missing empType', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          empID: 'EMP001',
          password: 'TestPass123!',
        });
      
      expect(response.status).toBe(500);
    });
  });
});

describe('POST /api/auth/register', () => {
  describe('Valid Registration', () => {
    it('should register new employee', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Employee',
          email: `new${Date.now()}@test.com`,
          empType: 'Worker',
        });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('registered');
    });
  });
  
  describe('Duplicate Email', () => {
    it('should return 400 for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Admin',
          email: 'admin@test.com',
          empType: 'Admin',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });
  
  describe('Missing Required Fields', () => {
    it('should return 500 for missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@test.com',
          empType: 'Worker',
        });
      
      expect(response.status).toBe(500);
    });
    
    it('should return 500 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Employee',
          empType: 'Worker',
        });
      
      expect(response.status).toBe(500);
    });
    
    it('should return 500 for missing empType', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Employee',
          email: 'test3@test.com',
        });
      
      expect(response.status).toBe(500);
    });
  });
});

describe('JWT Token Tests', () => {
  let adminToken;
  
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        empID: 'EMP001',
        password: 'TestPass123!',
        empType: 'Admin',
      });
    adminToken = response.body.token;
  });
  
  it('should generate valid JWT token', () => {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(adminToken, JWT_SECRET);
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('role');
    expect(decoded.role).toBe('Admin');
  });
  
  it('should reject invalid token', async () => {
    const response = await request(app)
      .post('/api/booking/all')
      .set('auth-token', 'invalid-token');
    
    expect(response.status).toBe(403);
  });
  
  it('should reject request without token', async () => {
    const response = await request(app)
      .post('/api/booking/all');
    
    expect(response.status).toBe(401);
  });
});

describe('Rate Limiting Tests', () => {
  it('should rate limit after too many requests', async () => {
    const requests = [];
    
    for (let i = 0; i < 15; i++) {
      requests.push(
        request(app)
          .post('/api/auth/login')
          .send({
            empID: 'EMP999',
            password: 'TestPass123!',
            empType: 'Admin',
          })
      );
    }
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.some((r) => r.status === 429);
    
    expect(rateLimited).toBe(true);
  });
});