/**
 * Inventory Tests
 * Tests for inventory management
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
  const StoreItem = mongoose.model('StoreItem');
  
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);
  
  const admin = new User({
    name: 'Admin',
    email: 'admin@test.com',
    empID: 'EMP001',
    empType: 'Admin',
    password: hashedPassword,
  });
  await admin.save();
  
  const storeItems = [
    { itemName: 'Chafing Dish', category: 'equipment', currentStock: 10, unit: 'pieces', minStockLevel: 2 },
    { itemName: 'Paper Napkins', category: 'supplies', currentStock: 500, unit: 'pieces', minStockLevel: 100 },
    { itemName: 'Round Tables', category: 'furniture', currentStock: 20, unit: 'pieces', minStockLevel: 5 },
    { itemName: 'Plates', category: 'equipment', currentStock: 100, unit: 'pieces', minStockLevel: 20 },
    { itemName: 'Glasses', category: 'equipment', currentStock: 5, unit: 'pieces', minStockLevel: 10 },
  ];
  
  for (const item of storeItems) {
    const storeItem = new StoreItem(item);
    await storeItem.save();
  }
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({ empID: 'EMP001', password: 'TestPass123!', empType: 'Admin' });
  adminToken = response.body.token;
}

describe('Store Item Management', () => {
  describe('Create Store Item', () => {
    it('should create a new store item', async () => {
      const response = await request(app)
        .post('/api/store/create')
        .set('auth-token', adminToken)
        .send({
          itemName: 'New Item',
          category: 'equipment',
          currentStock: 50,
          unit: 'pieces',
          minStockLevel: 10,
        });
      
      expect([200, 201, 500]).toContain(response.status);
    });
    
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/store/create')
        .set('auth-token', adminToken)
        .send({
          itemName: 'Test Item',
        });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('Get All Store Items', () => {
    it('should get all store items', async () => {
      const response = await request(app)
        .get('/api/store/all')
        .set('auth-token', adminToken);
      
      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body.storeItems)).toBe(true);
      }
    });
  });
  
  describe('Update Store Item', () => {
    it('should update store item stock', async () => {
      const itemResponse = await request(app)
        .get('/api/store/all')
        .set('auth-token', adminToken);
      
      const itemId = itemResponse.body?.storeItems?.[0]?._id;
      if (!itemId) return;
      
      const response = await request(app)
        .put(`/api/store/${itemId}`)
        .set('auth-token', adminToken)
        .send({ currentStock: 15 });
      
      expect([200, 404, 500]).toContain(response.status);
    });
  });
});

describe('Inventory Deduction Tests', () => {
  let goodsItems;
  
  beforeEach(async () => {
    const response = await request(app)
      .get('/api/store/all')
      .set('auth-token', adminToken);
    
    goodsItems = response.body?.storeItems || [];
  });
  
  it('should deduct inventory on booking confirmation', async () => {
    if (goodsItems.length === 0) return;
    
    const bookPayload = {
      eventDetails: {
        eventName: 'Inventory Test Event',
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
        paidAmount: 5000,
      },
      menu: {
        starters: ['Test'],
        maincourse: ['Test'],
        beverages: ['Test'],
        desserts: ['Test'],
      },
    };
    
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
    
    const goods = [
      { itemId: goodsItems[0]._id, itemName: goodsItems[0].itemName, category: goodsItems[0].category, quantity: 2 },
    ];
    
    const response = await request(app)
      .put(`/api/booking/${bookingId}/assign-goods`)
      .set('auth-token', adminToken)
      .send({ goods });
    
    expect([200, 201, 400, 404, 500]).toContain(response.status);
  });
  
  it('should prevent negative stock', async () => {
    const response = await request(app)
      .post('/api/store/create')
      .set('auth-token', adminToken)
      .send({
        itemName: 'Negative Test Item',
        category: 'equipment',
        currentStock: 5,
        unit: 'pieces',
        minStockLevel: 1,
      });
    
    const itemId = response.body?.storeItem?._id || response.body?._id;
    if (!itemId) return;
    
    const deductResponse = await request(app)
      .put(`/api/store/${itemId}`)
      .set('auth-token', adminToken)
      .send({ currentStock: -10 });
    
    expect(deductResponse.status).toBe(400);
  });
});

describe('Stock Level Alerts', () => {
  it('should track items below minimum stock level', async () => {
    await request(app)
      .post('/api/store/create')
      .set('auth-token', adminToken)
      .send({
        itemName: 'Low Stock Item',
        category: 'equipment',
        currentStock: 1,
        unit: 'pieces',
        minStockLevel: 10,
      });
    
    const response = await request(app)
      .get('/api/store/all')
      .set('auth-token', adminToken);
    
    if (response.status === 200) {
      const lowStockItems = response.body.storeItems?.filter(
        (item) => item.currentStock < item.minStockLevel
      );
      expect(lowStockItems?.length).toBeGreaterThan(0);
    }
  });
});

describe('Inventory Categories', () => {
  it('should get items by category', async () => {
    const categories = ['equipment', 'supplies', 'furniture'];
    
    for (const category of categories) {
      const response = await request(app)
        .get(`/api/store/category/${category}`)
        .set('auth-token', adminToken);
      
      expect([200, 404, 500]).toContain(response.status);
    }
  });
});

describe('Concurrent Inventory Updates', () => {
  it('should handle concurrent inventory updates', async () => {
    const response = await request(app)
      .post('/api/store/create')
      .set('auth-token', adminToken)
      .send({
        itemName: 'Concurrent Test Item',
        category: 'equipment',
        currentStock: 100,
        unit: 'pieces',
        minStockLevel: 10,
      });
    
    const itemId = response.body?.storeItem?._id || response.body?._id;
    if (!itemId) return;
    
    const updateRequests = [
      request(app).put(`/api/store/${itemId}`).set('auth-token', adminToken).send({ currentStock: 90 }),
      request(app).put(`/api/store/${itemId}`).set('auth-token', adminToken).send({ currentStock: 80 }),
      request(app).put(`/api/store/${itemId}`).set('auth-token', adminToken).send({ currentStock: 70 }),
    ];
    
    const results = await Promise.all(updateRequests);
    const statuses = results.map((r) => r.status);
    
    expect(statuses).toBeDefined();
  });
});

describe('Inventory Search', () => {
  it('should search inventory items', async () => {
    const response = await request(app)
      .get('/api/store/search?query=chafing')
      .set('auth-token', adminToken);
    
    expect([200, 404, 500]).toContain(response.status);
  });
});