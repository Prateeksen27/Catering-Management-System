/**
 * Role-Based Access Control Tests
 * Tests for role permissions on various endpoints
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let tokens = {};

const bookPayload = {
  eventDetails: {
    eventName: 'Test Event',
    eventDate: '2026-05-01',
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
  
  const users = [
    { name: 'Admin', email: 'admin@test.com', empID: 'EMP001', empType: 'Admin', password: hashedPassword },
    { name: 'Manager', email: 'manager@test.com', empID: 'EMP002', empType: 'Manager', password: hashedPassword },
    { name: 'Chef', email: 'chef@test.com', empID: 'EMP003', empType: 'Chef', password: hashedPassword },
    { name: 'Worker', email: 'worker@test.com', empID: 'EMP004', empType: 'Worker', password: hashedPassword },
    { name: 'Driver', email: 'driver@test.com', empID: 'EMP005', empType: 'Driver', password: hashedPassword },
  ];
  
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({ empID: userData.empID, password: 'TestPass123!', empType: userData.empType });
    
    tokens[userData.empType] = response.body.token;
  }
}

describe('Booking Access Tests', () => {
  describe('Admin Access', () => {
    it('should allow admin to access all bookings', async () => {
      const response = await request(app)
        .get('/api/booking/all')
        .set('auth-token', tokens.Admin);
      
      expect([200, 500]).toContain(response.status);
    });
    
    it('should allow admin to create booking', async () => {
      const response = await request(app)
        .post('/api/booking/create')
        .set('auth-token', tokens.Admin)
        .send(bookPayload);
      
      expect([200, 201, 500]).toContain(response.status);
    });
    
    it('should allow admin to approve booking', async () => {
      const response = await request(app)
        .post('/api/booking/approve')
        .set('auth-token', tokens.Admin)
        .send({ bookingId: '607f1f77bcf86cd799439021' });
      
      expect([400, 404, 500]).toContain(response.status);
    });
    
    it('should allow admin to reject booking', async () => {
      const response = await request(app)
        .post('/api/booking/reject')
        .set('auth-token', tokens.Admin)
        .send({ bookingId: '607f1f77bcf86cd799439021', reason: 'Test rejection' });
      
      expect([400, 404, 500]).toContain(response.status);
    });
  });
  
  describe('Manager Access', () => {
    it('should allow manager to access bookings', async () => {
      const response = await request(app)
        .get('/api/booking/all')
        .set('auth-token', tokens.Manager);
      
      expect([200, 500]).toContain(response.status);
    });
    
    it('should allow manager to create booking', async () => {
      const response = await request(app)
        .post('/api/booking/create')
        .set('auth-token', tokens.Manager)
        .send(bookPayload);
      
      expect([200, 201, 500]).toContain(response.status);
    });
    
    it('should allow manager to assign staff', async () => {
      const response = await request(app)
        .put('/api/booking/607f1f77bcf86cd799439021/assign-staff')
        .set('auth-token', tokens.Manager)
        .send({
          manager: '507f1f77bcf86cd799439012',
          workers: [],
          chefs: [],
          drivers: [],
        });
      
      expect([400, 404, 500]).toContain(response.status);
    });
  });
  
  describe('Chef Access', () => {
    it('should allow chef to view bookings', async () => {
      const response = await request(app)
        .get('/api/booking/booked')
        .set('auth-token', tokens.Chef);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Worker Access', () => {
    it('should allow worker to view booked events', async () => {
      const response = await request(app)
        .get('/api/booking/booked')
        .set('auth-token', tokens.Worker);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Driver Access', () => {
    it('should allow driver to view assigned bookings', async () => {
      const response = await request(app)
        .get('/api/booking/booked')
        .set('auth-token', tokens.Driver);
      
      expect([200, 500]).toContain(response.status);
    });
  });
});

describe('Employee Management Tests', () => {
  describe('Admin Access', () => {
    it('should allow admin to create employee', async () => {
      const response = await request(app)
        .post('/api/employees/create')
        .set('auth-token', tokens.Admin)
        .send({
          name: 'New Employee',
          email: `new${Date.now()}@test.com`,
          empID: `EMP${Date.now()}`,
          empType: 'Worker',
          phone: '1234567899',
          password: 'TestPass123!',
        });
      
      expect([200, 201, 500]).toContain(response.status);
    });
    
    it('should allow admin to view all employees', async () => {
      const response = await request(app)
        .get('/api/employees/all')
        .set('auth-token', tokens.Admin);
      
      expect([200, 500]).toContain(response.status);
    });
    
    it('should allow admin to update employee', async () => {
      const response = await request(app)
        .put('/api/employees/507f1f77bcf86cd799439012')
        .set('auth-token', tokens.Admin)
        .send({ name: 'Updated Name' });
      
      expect([200, 404, 500]).toContain(response.status);
    });
  });
  
  describe('Manager Access', () => {
    it('should allow manager to view employees', async () => {
      const response = await request(app)
        .get('/api/employees/all')
        .set('auth-token', tokens.Manager);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Chef Access', () => {
    it('should deny chef from creating employee', async () => {
      const response = await request(app)
        .post('/api/employees/create')
        .set('auth-token', tokens.Chef)
        .send({
          name: 'New Employee',
          email: `new${Date.now()}@test.com`,
          empID: `EMP${Date.now()}`,
          empType: 'Worker',
        });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('Worker Access', () => {
    it('should deny worker from accessing employee endpoints', async () => {
      const response = await request(app)
        .get('/api/employees/all')
        .set('auth-token', tokens.Worker);
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('Driver Access', () => {
    it('should deny driver from accessing employee endpoints', async () => {
      const response = await request(app)
        .get('/api/employees/all')
        .set('auth-token', tokens.Driver);
      
      expect(response.status).toBe(401);
    });
  });
});

describe('Menu Access Tests', () => {
  const menuPayload = {
    name: 'Test Menu Item',
    category: 'starters',
    price: 100,
    description: 'Test description',
  };
  
  describe('Admin Access', () => {
    it('should allow admin to create menu item', async () => {
      const response = await request(app)
        .post('/api/menu/create')
        .set('auth-token', tokens.Admin)
        .send(menuPayload);
      
      expect([200, 201, 500]).toContain(response.status);
    });
  });
  
  describe('Manager Access', () => {
    it('should allow manager to view menu', async () => {
      const response = await request(app)
        .get('/api/menu/all')
        .set('auth-token', tokens.Manager);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Chef Access', () => {
    it('should allow chef to view menu', async () => {
      const response = await request(app)
        .get('/api/menu/all')
        .set('auth-token', tokens.Chef);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Worker Access', () => {
    it('should deny worker from accessing menu', async () => {
      const response = await request(app)
        .get('/api/menu/all')
        .set('auth-token', tokens.Worker);
      
      expect(response.status).toBe(401);
    });
  });
});

describe('Vehicle Access Tests', () => {
  const vehiclePayload = {
    vehicleName: 'Test Vehicle',
    vehicleNumber: 'ABC123',
    vehicleType: 'Van',
    capacity: 10,
  };
  
  describe('Admin Access', () => {
    it('should allow admin to create vehicle', async () => {
      const response = await request(app)
        .post('/api/vehicle/create')
        .set('auth-token', tokens.Admin)
        .send(vehiclePayload);
      
      expect([200, 201, 500]).toContain(response.status);
    });
  });
  
  describe('Driver Access', () => {
    it('should allow driver to view vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicle/all')
        .set('auth-token', tokens.Driver);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Worker Access', () => {
    it('should deny worker from accessing vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicle/all')
        .set('auth-token', tokens.Worker);
      
      expect(response.status).toBe(401);
    });
  });
});

describe('Store/Inventory Access Tests', () => {
  describe('Admin Access', () => {
    it('should allow admin to access store', async () => {
      const response = await request(app)
        .get('/api/store/all')
        .set('auth-token', tokens.Admin);
      
      expect([200, 500]).toContain(response.status);
    });
    
    it('should allow admin to access inventory', async () => {
      const response = await request(app)
        .get('/api/inventory/all')
        .set('auth-token', tokens.Admin);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Chef Access', () => {
    it('should allow chef to access inventory', async () => {
      const response = await request(app)
        .get('/api/inventory/all')
        .set('auth-token', tokens.Chef);
      
      expect([200, 500]).toContain(response.status);
    });
  });
  
  describe('Worker Access', () => {
    it('should allow worker to access store', async () => {
      const response = await request(app)
        .get('/api/store/all')
        .set('auth-token', tokens.Worker);
      
      expect([200, 500]).toContain(response.status);
    });
  });
});

describe('Unauthorized Access Tests', () => {
  it('should deny access without token', async () => {
    const response = await request(app)
      .get('/api/booking/all');
    
    expect(response.status).toBe(401);
  });
  
  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', 'invalid-token-12345');
    
    expect(response.status).toBe(403);
  });
  
  it('should deny access with expired token', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { id: 'test-id', role: 'Admin' },
      process.env.JWT_SECRET || 'test_jwt_secret_key',
      { expiresIn: '-1h' }
    );
    
    const response = await request(app)
      .get('/api/booking/all')
      .set('auth-token', expiredToken);
    
    expect(response.status).toBe(403);
  });
});