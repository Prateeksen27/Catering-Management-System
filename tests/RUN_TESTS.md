# CMS Testing Suite - Quick Start Guide

## Prerequisites

1. **Node.js** v18 or higher
2. **MongoDB** running locally or accessible connection string
3. **npm** or **yarn**

## Installation

### Backend (API) Testing Dependencies

```bash
cd Server
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server
```

### Frontend (E2E) Testing Dependencies

```bash
cd Admin_Dashboard
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

### Test Package

```bash
cd tests
npm install
```

## Environment Setup

Create `.env` file in Server directory:

```env
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/cms_test
JWT_SECRET=your_test_jwt_secret_key_min_32_chars
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
```

## Running Tests

### Run All Tests

```bash
cd tests
npm run test:all
```

### Run API Tests Only

```bash
npm run test
# or
npx jest --config=tests/jest.config.js
```

### Run E2E Tests Only

```bash
npm run test:e2e
# or
npx playwright test --config=tests/playwright.config.js
```

### Run Specific Test Suites

| Command | Description |
|---------|-------------|
| `npm run test:auth` | Authentication tests |
| `npm run test:roles` | Role-based access tests |
| `npm run test:booking` | Booking lifecycle tests |
| `npm run test:inventory` | Inventory tests |
| `npm run test:tickets` | Ticket system tests |
| `npm run test:e2e:admin` | Admin E2E workflow tests |
| `npm run test:e2e:chef` | Chef E2E workflow tests |
| `npm run test:e2e:forms` | Form validation tests |
| `npm run test:security` | Security tests |
| `npm run test:watch` | Watch mode |

### CI Mode

```bash
npm run test:ci
# Generates JUnit XML reports in tests/e2e/junit-results.xml
```

## Test Structure

```
tests/
├── api/                    # Backend API tests (Jest)
│   ├── auth.test.js       # Authentication tests
│   ├── roles.test.js     # Role-based access tests
│   ├── bookingLifecycle.test.js  # Booking workflow tests
│   ├── resourceLocking.test.js # Resource locking tests
│   ├── inventory.test.js # Inventory tests
│   └── tickets.test.js  # Ticket system tests
├── e2e/                   # Frontend E2E tests (Playwright)
│   ├── adminWorkflow.test.js
│   ├── roleWorkflows.test.js
│   └── formValidation.test.js
├── security/              # Security tests
│   └── security.test.js
├── fixtures/              # Test data
│   └── index.js
├── config/                # Test configurations
│   ├── setup.js
│   ├── database.js
│   └── testHelper.js
├── scripts/               # Test runner scripts
│   └── run-tests.js
├── jest.config.js         # Jest configuration
└── playwright.config.js   # Playwright configuration
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Start MongoDB
mongod --dbpath /data/db

# Or use MongoDB Atlas
export MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cms_test
```

### Port Already in Use

```bash
# Kill process on port 5000
fkill -f :5000
```

### Playwright Issues

```bash
# Reinstall browsers
npx playwright install

# Update browsers
npx playwright install --with-deps
```

### Test Data Conflicts

```bash
# Clear test database
mongosh
use cms_test
db.dropAllCollections()
```

## Expected Test Results

### Authentication Tests
- Valid login with all 5 roles
- Invalid password handling
- Invalid credentials handling
- JWT token validation
- Rate limiting

### Role-Based Access Tests
- Admin full access
- Manager partial access
- Chef limited access
- Worker basic access
- Driver vehicle access
- Unauthorized blocking

### Booking Lifecycle Tests
- Create booking
- Status transitions (valid and invalid)
- Staff assignment
- Vehicle assignment
- Timeline tracking
- Resource locking

### Inventory Tests
- Create/update items
- Stock deduction
- Low stock alerts
- Negative stock prevention
- Concurrent updates

### Ticket Tests
- Create/update tickets
- Assignment
- Status updates
- Role permissions

### E2E Tests
- Login workflows
- Navigation
- Form validation
- Role-specific dashboards

## Coverage

- **API Tests**: ~85% coverage target
- **E2E Tests**: Key user workflows covered
- **Security Tests**: JWT, injection, rate limiting

## CI Integration

The test suite generates JUnit XML reports compatible with:
- Jenkins
- GitHub Actions
- GitLab CI
- CircleCI

Reports location:
- API: `coverage/`
- E2E: `tests/e2e/junit-results.xml`