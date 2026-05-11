/**
 * Test Database Helper
 * Utility functions for test database operations
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let connection;

/**
 * Connect to test database
 */
async function connectToTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  return uri;
}

/**
 * Disconnect from test database
 */
async function disconnectTestDB() {
  if (connection) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

/**
 * Clear all collections
 */
async function clearCollections() {
  const collections = mongoose.connection.collections;
  const deletePromises = Object.keys(collections).map((key) =>
    collections[key].deleteMany({})
  );
  await Promise.all(deletePromises);
}

/**
 * Seed test data
 */
async function seedTestData(models) {
  const seededData = {};
  
  for (const [modelName, data] of Object.entries(models)) {
    if (data && Array.isArray(data)) {
      seededData[modelName] = await Promise.all(
        data.map(async (doc) => {
          const Model = mongoose.models[modelName];
          if (Model) {
            return Model.create(doc);
          }
          return null;
        })
      );
    } else if (data && typeof data === 'object') {
      const Model = mongoose.models[modelName];
      if (Model) {
        seededData[modelName] = await Model.create(data);
      }
    }
  }
  
  return seededData;
}

/**
 * Get seeded user with hashed password
 */
async function createTestUser(User, userData) {
  const hashedPassword = await require('bcryptjs').hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  await user.save();
  return user;
}

/**
 * Create test booking with dependencies
 */
async function createTestBooking(PendingBooking, options = {}) {
  const booking = new PendingBooking({
    eventDetails: {
      eventName: options.eventName || 'Test Event',
      eventDate: options.eventDate || new Date('2026-05-01'),
      eventTime: options.eventTime || '18:00',
      pax: options.pax || 50,
      venue: options.venue || 'Test Venue',
    },
    clientDetails: {
      fullName: options.clientName || 'Test Client',
      email: options.clientEmail || 'test@client.com',
      phone: options.clientPhone || '1234567890',
    },
    Payment_Details: {
      estimatedAmount: options.amount || 10000,
      paidAmount: options.paidAmount || 0,
    },
    menu: options.menu || {
      starters: ['test starter'],
      maincourse: ['test main'],
      beverages: ['test beverage'],
      desserts: ['test dessert'],
    },
    status: options.status || 'PENDING_REVIEW',
  });
  
  await booking.save();
  return booking;
}

/**
 * Create multiple test bookings
 */
async function createMultipleBookings(PendingBooking, count, baseData = {}) {
  const bookings = [];
  
  for (let i = 0; i < count; i++) {
    const booking = await createTestBooking(PendingBooking, {
      ...baseData,
      eventName: `Test Event ${i + 1}`,
      eventDate: new Date(2026, 4, 1 + i),
    });
    bookings.push(booking);
  }
  
  return bookings;
}

module.exports = {
  connectToTestDB,
  disconnectTestDB,
  clearCollections,
  seedTestData,
  createTestUser,
  createTestBooking,
  createMultipleBookings,
};