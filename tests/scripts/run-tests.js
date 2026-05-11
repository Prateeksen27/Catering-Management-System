#!/usr/bin/env node

/**
 * CI Test Runner
 * Runs all tests and generates reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const testType = args[0] || 'all';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    log('blue', `Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } });
    return true;
  } catch (error) {
    log('red', `Command failed: ${command}`);
    return false;
  }
}

async function runTests() {
  const serverDir = path.join(process.cwd(), 'Server');
  const adminDir = path.join(process.cwd(), 'Admin_Dashboard');
  const testsDir = path.join(process.cwd(), 'tests');
  
  log('magenta', '\n===== CMS Test Suite =====\n');
  
  let allPassed = true;
  
  if (testType === 'api' || testType === 'all') {
    log('yellow', '\n--- Running API Tests ---\n');
    
    const apiTests = [
      { name: 'Authentication', pattern: 'tests/api/auth.test.js' },
      { name: 'Role Access', pattern: 'tests/api/roles.test.js' },
      { name: 'Booking Lifecycle', pattern: 'tests/api/bookingLifecycle.test.js' },
      { name: 'Resource Locking', pattern: 'tests/api/resourceLocking.test.js' },
      { name: 'Inventory', pattern: 'tests/api/inventory.test.js' },
      { name: 'Tickets', pattern: 'tests/api/tickets.test.js' },
    ];
    
    for (const test of apiTests) {
      log('blue', `\nRunning ${test.name}...`);
      try {
        execSync(`npx jest ${test.pattern} --config=${testsDir}/jest.config.js`, {
          cwd: process.cwd(),
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'test' },
        });
      } catch (e) {
        allPassed = false;
      }
    }
  }
  
  if (testType === 'e2e' || testType === 'all') {
    log('yellow', '\n--- Running E2E Tests ---\n');
    
    if (!runCommand('npx playwright test --config=tests/playwright.config.js', process.cwd())) {
      allPassed = false;
    }
  }
  
  if (testType === 'security' || testType === 'all') {
    log('yellow', '\n--- Running Security Tests ---\n');
    
    if (!runCommand('npx jest tests/security/ --config=tests/jest.config.js', process.cwd())) {
      allPassed = false;
    }
  }
  
  if (testType === 'integration' || testType === 'all') {
    log('yellow', '\n--- Running Integration Tests ---\n');
    
    if (!runCommand('npx jest tests/integration/ --config=tests/jest.config.js', process.cwd())) {
      allPassed = false;
    }
  }
  
  if (testType === 'performance' || testType === 'all') {
    log('yellow', '\n--- Running Performance Tests ---\n');
    
    if (!runCommand('npx jest tests/performance/ --config=tests/jest.config.js', process.cwd())) {
      allPassed = false;
    }
  }
  
  if (testType === 'ci') {
    log('yellow', '\n--- Running Full CI Suite ---\n');
    
    log('blue', 'Installing dependencies...');
    runCommand('npm install', serverDir);
    runCommand('npm install --save-dev @playwright/test', adminDir);
    
    log('blue', 'Running API tests...');
    runCommand('npx jest --config=tests/jest.config.js --ci --coverage --testResultsProcessor=jest-json-summary', process.cwd());
    
    log('blue', 'Running E2E tests...');
    runCommand('npx playwright test --config=tests/playwright.config.js --reporter=junit', process.cwd());
  }
  
  log('magenta', '\n===== Test Suite Complete =====\n');
  
  if (allPassed) {
    log('green', 'All tests passed!');
    process.exit(0);
  } else {
    log('red', 'Some tests failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };