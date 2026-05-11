/**
 * Admin E2E Workflow Tests
 * Tests for complete admin user workflows using Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Admin Login Workflow', () => {
  test('should login as admin successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\// || /dashboard/);
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'WrongPassword');
    await page.selectOption('select[name="empType"]', 'Admin');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid password')).toBeVisible();
  });
});

test.describe('Admin Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });
  
  test('should access admin dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should navigate to employees page', async ({ page }) => {
    await page.click('text=Employees');
    await expect(page).toHaveURL(/employees/);
  });
  
  test('should navigate to bookings page', async ({ page }) => {
    await page.click('text=Bookings');
    await expect(page).toHaveURL(/bookings/);
  });
  
  test('should navigate to menu page', async ({ page }) => {
    await page.click('text=Menu');
    await expect(page).toHaveURL(/menu/);
  });
  
  test('should navigate to store page', async ({ page }) => {
    await page.click('text=Store');
    await expect(page).toHaveURL(/store/);
  });
  
  test('should navigate to vehicles page', async ({ page }) => {
    await page.click('text=Vehicles');
    await expect(page).toHaveURL(/vehicles/);
  });
});

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Employees');
    await page.waitForURL(/employees/);
  });
  
  test('should display employees list', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });
  
  test('should open create employee form', async ({ page }) => {
    await page.click('text=Add Employee');
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Booking Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Bookings');
    await page.waitForURL(/bookings/);
  });
  
  test('should display bookings tabs', async ({ page }) => {
    await expect(page.locator('text=Inquire')).toBeVisible();
    await expect(page.locator('text=Booked')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
  });
  
  test('should navigate to pending bookings', async ({ page }) => {
    await page.click('text=Pending');
    await expect(page).toHaveURL(/bookings\/pending/);
  });
  
  test('should navigate to booked events', async ({ page }) => {
    await page.click('text=Booked');
    await expect(page).toHaveURL(/bookings\/booked/);
  });
});

test.describe('Menu Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Menu');
    await page.waitForURL(/menu/);
  });
  
  test('should display menu categories', async ({ page }) => {
    await expect(page.locator('text=Starters')).toBeVisible();
    await expect(page.locator('text=Main Course')).toBeVisible();
    await expect(page.locator('text=Beverages')).toBeVisible();
    await expect(page.locator('text=Desserts')).toBeVisible();
  });
});

test.describe('Store Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Store');
    await page.waitForURL(/store/);
  });
  
  test('should display inventory items', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });
  
  test('should add new item', async ({ page }) => {
    await page.click('text=Add Item');
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Profile Access', () => {
  test('should access profile page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    
    await page.click('text=Profile');
    await expect(page).toHaveURL(/profile/);
  });
  
  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    
    await page.click('text=Logout');
    await expect(page).toHaveURL(/login/);
  });
});