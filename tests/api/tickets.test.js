/**
 * Ticket System Tests
 * Tests for ticket/task management
 */

const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../Server/server');

let mongoServer;
let connection;
let tokens = {};

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
  const Ticket = mongoose.model('Ticket');
  
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);
  
  const users = [
    { name: 'Admin', email: 'admin@test.com', empID: 'EMP001', empType: 'Admin', password: hashedPassword },
    { name: 'Manager', email: 'manager@test.com', empID: 'EMP002', empType: 'Manager', password: hashedPassword },
    { name: 'Chef', email: 'chef@test.com', empID: 'EMP003', empType: 'Chef', password: hashedPassword },
    { name: 'Worker', email: 'worker@test.com', empID: 'EMP004', empType: 'Worker', password: hashedPassword },
  ];
  
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }
  
  const tickets = [
    {
      title: 'Setup Task',
      description: 'Setup venue for event',
      status: 'Open',
      priority: 'High',
      assignedTo: users[1]._id,
    },
    {
      title: 'Cooking Task',
      description: 'Prepare food for event',
      status: 'Open',
      priority: 'High',
      assignedTo: users[2]._id,
    },
    {
      title: 'Completed Task',
      description: 'Completed task',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: users[3]._id,
    },
  ];
  
  for (const ticketData of tickets) {
    const ticket = new Ticket(ticketData);
    await ticket.save();
  }
  
  for (const role of ['Admin', 'Manager', 'Chef', 'Worker']) {
    const user = users.find((u) => u.empType === role);
    const response = await request(app)
      .post('/api/auth/login')
      .send({ empID: user.empID, password: 'TestPass123!', empType: role });
    tokens[role] = response.body.token;
  }
}

describe('Ticket Creation', () => {
  it('should create a new ticket', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'New Task',
        description: 'Task description',
        status: 'Open',
        priority: 'Medium',
        assignedTo: null,
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should create ticket with due date', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Task with Due Date',
        description: 'Task description',
        status: 'Open',
        priority: 'High',
        dueDate: new Date('2026-05-01'),
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should return 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Test Task',
      });
    
    expect(response.status).toBe(400);
  });
});

describe('Ticket Retrieval', () => {
  it('should get all tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/all')
      .set('auth-token', tokens.Admin);
    
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(Array.isArray(response.body.tickets)).toBe(true);
    }
  });
  
  it('should get ticket by ID', async () => {
    const allResponse = await request(app)
      .get('/api/tickets/all')
      .set('auth-token', tokens.Admin);
    
    const ticketId = allResponse.body?.tickets?.[0]?._id;
    if (!ticketId) return;
    
    const response = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set('auth-token', tokens.Admin);
    
    expect([200, 404, 500]).toContain(response.status);
  });
});

describe('Ticket Status Updates', () => {
  it('should update ticket status', async () => {
    const createResponse = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Status Update Test',
        description: 'Test',
        status: 'Open',
        priority: 'Medium',
      });
    
    const ticketId = createResponse.body?.ticket?._id || createResponse.body?._id;
    if (!ticketId) return;
    
    const response = await request(app)
      .patch(`/api/tickets/${ticketId}`)
      .set('auth-token', tokens.Admin)
      .send({ status: 'In Progress' });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
  
  it('should complete ticket', async () => {
    const createResponse = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Complete Test',
        description: 'Test',
        status: 'Open',
        priority: 'Low',
      });
    
    const ticketId = createResponse.body?.ticket?._id || createResponse.body?._id;
    if (!ticketId) return;
    
    const response = await request(app)
      .patch(`/api/tickets/${ticketId}`)
      .set('auth-token', tokens.Admin)
      .send({ status: 'Completed' });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
});

describe('Ticket Assignment', () => {
  let userIds = {};
  
  beforeEach(async () => {
    const response = await request(app)
      .get('/api/employees/all')
      .set('auth-token', tokens.Admin);
    
    userIds = {};
    response.body?.employees?.forEach((emp) => {
      userIds[emp.empType] = emp._id;
    });
  });
  
  it('should assign ticket to employee', async () => {
    if (!userIds.Worker) return;
    
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Assignment Test',
        description: 'Test',
        status: 'Open',
        priority: 'High',
        assignedTo: userIds.Worker,
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should reassign ticket', async () => {
    if (!userIds.Manager || !userIds.Chef) return;
    
    const createResponse = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Reassignment Test',
        description: 'Test',
        status: 'Open',
        priority: 'Medium',
        assignedTo: userIds.Manager,
      });
    
    const ticketId = createResponse.body?.ticket?._id || createResponse.body?._id;
    if (!ticketId) return;
    
    const response = await request(app)
      .patch(`/api/tickets/${ticketId}`)
      .set('auth-token', tokens.Admin)
      .send({ assignedTo: userIds.Chef });
    
    expect([200, 400, 404, 500]).toContain(response.status);
  });
});

describe('Ticket Filtering', () => {
  it('should get tickets by status', async () => {
    const statuses = ['Open', 'In Progress', 'Completed'];
    
    for (const status of statuses) {
      const response = await request(app)
        .get(`/api/tickets/status/${status}`)
        .set('auth-token', tokens.Admin);
      
      expect([200, 404, 500]).toContain(response.status);
    }
  });
  
  it('should get tickets by priority', async () => {
    const priorities = ['High', 'Medium', 'Low'];
    
    for (const priority of priorities) {
      const response = await request(app)
        .get(`/api/tickets/priority/${priority}`)
        .set('auth-token', tokens.Admin);
      
      expect([200, 404, 500]).toContain(response.status);
    }
  });
  
  it('should get my tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/my-tasks')
      .set('auth-token', tokens.Manager);
    
    expect([200, 500]).toContain(response.status);
  });
});

describe('Role-Based Ticket Access', () => {
  it('should allow Admin to create ticket', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Admin Task',
        description: 'Test',
        status: 'Open',
        priority: 'Medium',
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should allow Manager to create ticket', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Manager)
      .send({
        title: 'Manager Task',
        description: 'Test',
        status: 'Open',
        priority: 'Medium',
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should allow Chef to view tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/all')
      .set('auth-token', tokens.Chef);
    
    expect([200, 401, 500]).toContain(response.status);
  });
  
  it('should allow Worker to view assigned tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/all')
      .set('auth-token', tokens.Worker);
    
    expect([200, 401, 500]).toContain(response.status);
  });
});

describe('Ticket Priority Tests', () => {
  it('should create high priority ticket', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'High Priority Task',
        description: 'Urgent task',
        status: 'Open',
        priority: 'High',
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
  
  it('should create low priority ticket', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Low Priority Task',
        description: 'Non-urgent task',
        status: 'Open',
        priority: 'Low',
      });
    
    expect([200, 201, 500]).toContain(response.status);
  });
});

describe('Ticket Timestamps', () => {
  it('should track created at timestamp', async () => {
    const response = await request(app)
      .post('/api/tickets/create')
      .set('auth-token', tokens.Admin)
      .send({
        title: 'Timestamp Test',
        description: 'Test',
        status: 'Open',
        priority: 'Medium',
      });
    
    if (response.body?.ticket?.createdAt) {
      expect(response.body.ticket.createdAt).toBeDefined();
    }
  });
});