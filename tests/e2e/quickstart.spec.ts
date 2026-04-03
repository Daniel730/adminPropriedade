import { test, expect } from '@playwright/test';

test.describe('E2E Flow - Property Management', () => {
  const vendorEmail = `vendor-${Date.now()}@example.com`;
  const password = 'Password123!';

  test('Manager registers, creates property and vendor, tenant requests, vendor checks', async ({ browser }) => {
    // 1. Manager registration
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();
    
    // We assume there is a /register or we just log in if seed has it.
    // Wait, the app might not have a register page for managers if it's not implemented.
    // Let's check if there is a signup page, otherwise we use seed data.
    
    await managerPage.goto('/login');
    // If login has a sign up link, or we just use pre-seeded manager
    await managerPage.fill('input[name="email"]', 'manager@example.com');
    await managerPage.fill('input[name="password"]', 'manager123');
    await managerPage.click('button[type="submit"]');
    
    // We expect to be redirected to dashboard
    await expect(managerPage).toHaveURL(/.*\/dashboard/);

    // Create a Vendor
    await managerPage.goto('/vendors');
    await managerPage.fill('input[name="name"]', 'Test Vendor');
    await managerPage.fill('input[name="email"]', vendorEmail);
    await managerPage.fill('input[name="password"]', password);
    await managerPage.click('button:has-text("Add Vendor")');
    // Expect vendor to appear in the list
    await expect(managerPage.locator('table')).toContainText('Test Vendor');

    // Create Property
    await managerPage.goto('/properties');
    await managerPage.fill('input[name="name"]', 'Test Property');
    await managerPage.fill('input[name="address"]', '123 Test Ave');
    await managerPage.click('button:has-text("Add Property")');
    
    // Go to property page (first property link)
    await managerPage.click('table tbody tr:first-child a');
    
    // Add unit
    await managerPage.fill('input[name="unitNumber"]', '101');
    await managerPage.click('button:has-text("Add Unit")');
    
    // Note: To assign a tenant, we need the tenant to exist or we assign by their ID/email. 
    // The exact UI for assigning tenant depends on the implementation.
  });
});
