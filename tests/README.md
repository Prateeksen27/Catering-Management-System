# CMS Testing Suite

## Overview
This directory contains the complete end-to-end testing framework for the Catering Management System.

## Structure
```
tests/
├── api/                    # Backend API tests (Jest + Supertest)
├── e2e/                  # Frontend E2E tests (Playwright)
├── integration/            # Integration tests
├── security/              # Security tests
├── performance/           # Performance tests
├── fixtures/             # Test fixtures and data
└── config/               # Test configurations
```

## Test Types

### 1. API Tests (`tests/api/`)
- Authentication tests (login, JWT, tokens)
- Role-based access tests
- Booking lifecycle tests
- Resource locking tests
- Inventory tests
- Ticket system tests

### 2. E2E Tests (`tests/e2e/`)
- Admin workflow tests
- Manager workflow tests
- Chef workflow tests
- Driver workflow tests
- Worker workflow tests
- Navigation tests
- Form validation tests

### 3. Integration Tests (`tests/integration/`)
- Database consistency tests
- API integration tests
- Cross-module tests

### 4. Security Tests (`tests/security/`)
- Authentication security
- Authorization tests
- Rate limiting tests
- Input validation tests

### 5. Performance Tests (`tests/performance/`)
- API response times
- Concurrent request handling
- Load tests

## Running Tests

### Prerequisites
- MongoDB running (local or test instance)
- Node.js and npm
- All dependencies installed

### Install Dependencies
```bash
cd Server
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server
cd ../Admin_Dashboard
npm install --save-dev @playwright/test
```

### Run All Tests
```bash
npm run test           # Run API tests
npm run test:e2e      # Run E2E tests  
npm run test:all       # Run all tests
```

### Run Specific Test Suites
```bash
npm run test:api          # API tests only
npm run test:auth        # Auth tests
npm run test:booking      # Booking tests
npm run test:roles       # Role access tests
npm run test:e2e:admin  # Admin E2E tests
npm run test:e2e:chef   # Chef E2E tests
```

### Watch Mode
```bash
npm run test:watch       # Watch mode for API tests
```

## Test Environment Variables

Create `.env.test` in Server directory:
```env
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/cms_test
JWT_SECRET=your_test_jwt_secret_key
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
```

Create `.env` in Admin_Dashboard directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=test
```

## Test Database

Tests use a separate MongoDB database (`cms_test`) to avoid affecting production data.

## CI/CD

The testing framework supports CI/CD integration:
```bash
npm run test:ci          # Run all tests with JUnit XML output
```

## Contributing

When adding new features:
1. Add corresponding tests in appropriate test directory
2. Follow test naming conventions
3. Update this README with new test procedures