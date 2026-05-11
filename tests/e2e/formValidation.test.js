/**
 * Form Validation E2E Tests
 * Tests for form validation using Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Login Form Validation', () => {
  test('should show error for empty empID', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for empty password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for empty empType', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
});

test.describe('Employee Form Validation', () => {
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
  
  test('should show error for invalid email format', async ({ page }) => {
    await page.click('text=Add Employee');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=email')).toBeVisible();
  });
  
  test('should show error for invalid phone number', async ({ page }) => {
    await page.click('text=Add Employee');
    await page.fill('input[name="phone"]', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=phone')).toBeVisible();
  });
  
  test('should show error for empty required fields', async ({ page }) => {
    await page.click('text=Add Employee');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
});

test.describe('Booking Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Bookings');
    await page.waitForURL(/bookings/);
    await page.click('text=Inquire');
  });
  
  test('should show error for empty event name', async ({ page }) => {
    await page.click('text=New Booking');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for empty venue', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="eventDetails.eventName"]', 'Test Event');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=venue')).toBeVisible();
  });
  
  test('should show error for empty client name', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="eventDetails.eventName"]', 'Test Event');
    await page.fill('input[name="eventDetails.venue"]', 'Test Venue');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=client')).toBeVisible();
  });
  
  test('should show error for invalid email', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="clientDetails.email"]', 'invalid');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=email')).toBeVisible();
  });
  
  test('should show error for invalid phone', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="clientDetails.phone"]', 'abc');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=phone')).toBeVisible();
  });
  
  test('should show error for zero pax', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="eventDetails.pax"]', '0');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for negative pax', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="eventDetails.pax"]', '-5');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=positive')).toBeVisible();
  });
  
  test('should show error for past date', async ({ page }) => {
    await page.click('text=New Booking');
    await page.fill('input[name="eventDetails.eventDate"]', '2020-01-01');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=date')).toBeVisible();
  });
});

test.describe('Menu Form Validation', () => {
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
  
  test('should show error for empty menu name', async ({ page }) => {
    await page.click('text=Add Menu Item');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for invalid price', async ({ page }) => {
    await page.click('text=Add Menu Item');
    await page.fill('input[name="price"]', '-10');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=positive')).toBeVisible();
  });
});

test.describe('Store Form Validation', () => {
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
  
  test('should show error for empty item name', async ({ page }) => {
    await page.click('text=Add Item');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for negative stock', async ({ page }) => {
    await page.click('text=Add Item');
    await page.fill('input[name="currentStock"]', '-10');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=positive')).toBeVisible();
  });
  
  test('should show error for zero stock', async ({ page }) => {
    await page.click('text=Add Item');
    await page.fill('input[name="currentStock"]', '0');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
});

test.describe('Vehicle Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.click('text=Vehicles');
    await page.waitForURL(/vehicles/);
  });
  
  test('should show error for empty vehicle name', async ({ page }) => {
    await page.click('text=Add Vehicle');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for empty vehicle number', async ({ page }) => {
    await page.click('text=Add Vehicle');
    await page.fill('input[name="vehicleName"]', 'Test Vehicle');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=required')).toBeVisible();
  });
  
  test('should show error for negative capacity', async ({ page }) => {
    await page.click('text=Add Vehicle');
    await page.fill('input[name="capacity"]', '-5');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=positive')).toBeVisible();
  });
});

test.describe('Profile Form Validation', () => {
  test('should validate profile update', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    
    await page.click('text=Profile');
    await expect(page).toHaveURL(/profile/);
    
    await page.fill('input[name="email"]', 'invalid');
    await page.click('text=Save');
    
    await expect(page.locator('text=email')).toBeVisible();
  });
});