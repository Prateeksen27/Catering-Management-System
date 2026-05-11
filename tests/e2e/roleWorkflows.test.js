/**
 * Role-Based E2E Workflow Tests
 * Tests for different role workflows using Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Manager Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP002');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Manager');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });
  
  test('should access manager dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should view assigned events', async ({ page }) => {
    await page.click('text=Assigned Events');
    await expect(page).toHaveURL(/assigned-events/);
  });
  
  test('should assign work to employees', async ({ page }) => {
    await page.click('text=Assign Work');
    await expect(page).toHaveURL(/assign-work/);
  });
  
  test('should view bookings', async ({ page }) => {
    await page.click('text=Bookings');
    await expect(page).toHaveURL(/bookings/);
  });
  
  test('should not access employee management', async ({ page }) => {
    const employeesLink = page.locator('text=Employees');
    await expect(employeesLink).not.toBeVisible();
  });
});

test.describe('Chef Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP003');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Chef');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });
  
  test('should access chef dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should view menu', async ({ page }) => {
    await page.click('text=Menu');
    await expect(page).toHaveURL(/menu/);
  });
  
  test('should view inventory', async ({ page }) => {
    await page.click('text=Inventory');
    await expect(page).toHaveURL(/inventory/);
  });
  
  test('should view my tasks', async ({ page }) => {
    await page.click('text=My Tasks');
    await expect(page).toHaveURL(/my-tasks/);
  });
  
  test('should not access bookings management', async ({ page }) => {
    const pendingLink = page.locator('text=Pending');
    await expect(pendingLink).not.toBeVisible();
  });
});

test.describe('Worker Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP004');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Worker');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });
  
  test('should access worker dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should view assigned work', async ({ page }) => {
    await page.click('text=Assigned Work');
    await expect(page).toHaveURL(/assigned-work/);
  });
  
  test('should view my tasks', async ({ page }) => {
    await page.click('text=My Tasks');
    await expect(page).toHaveURL(/my-tasks/);
  });
  
  test('should view store', async ({ page }) => {
    await page.click('text=Store');
    await expect(page).toHaveURL(/store/);
  });
  
  test('should not access admin features', async ({ page }) => {
    const employeesLink = page.locator('text=Employees');
    await expect(employeesLink).not.toBeVisible();
  });
});

test.describe('Driver Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP005');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Driver');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });
  
  test('should access driver dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should view vehicles', async ({ page }) => {
    await page.click('text=Vehicles');
    await expect(page).toHaveURL(/vehicles/);
  });
  
  test('should view assigned bookings', async ({ page }) => {
    await page.click('text=Bookings');
    await expect(page).toHaveURL(/bookings/);
  });
  
  test('should not access inventory', async ({ page }) => {
    const inventoryLink = page.locator('text=Inventory');
    await expect(inventoryLink).not.toBeVisible();
  });
});

test.describe('Unauthorized Access', () => {
  test('should redirect unauthorized users', async ({ page }) => {
    await page.goto('/employees');
    await expect(page).toHaveURL(/unauthorized/);
  });
  
  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('/unknown-route');
    await expect(page).toHaveURL(/not-found/);
  });
});

test.describe('Role Dashboard Redirect', () => {
  test('should redirect admin to admin dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP001');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Admin');
    await page.click('button[type="submit"]');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard\/admin/);
  });
  
  test('should redirect manager to manager dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP002');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Manager');
    await page.click('button[type="submit"]');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard\/manager/);
  });
  
  test('should redirect chef to chef dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP003');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Chef');
    await page.click('button[type="submit"]');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard\/chef/);
  });
  
  test('should redirect worker to worker dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP004');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Worker');
    await page.click('button[type="submit"]');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard\/worker/);
  });
  
  test('should redirect driver to driver dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="empID"]', 'EMP005');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.selectOption('select[name="empType"]', 'Driver');
    await page.click('button[type="submit"]');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard\/driver/);
  });
});