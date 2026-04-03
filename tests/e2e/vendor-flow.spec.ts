import { test, expect } from '@playwright/test';

test.describe('Vendor and E2E Flow', () => {
  // Use seeded users
  const tenantEmail = 'tenant@example.com';
  const managerEmail = 'manager@example.com';
  const vendorEmail = 'vendor@example.com';
  const password = 'password123';

  test('Complete flow: Tenant submits request -> Manager assigns Vendor -> Vendor updates status', async ({ page }) => {
    // 1. Tenant logs in and submits a request
    await page.goto('/login');
    await page.fill('input[name="email"]', tenantEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/requests/);

    await page.click('text="Submit Request"');
    await expect(page).toHaveURL(/.*\/requests\/new/);
    
    const requestTitle = `Test Request ${Date.now()}`;
    await page.fill('input[name="title"]', requestTitle);
    await page.fill('textarea[name="description"]', 'The sink is leaking.');
    // Select unit if there is a dropdown, else it's hidden/prefilled
    // Wait for the form to be ready
    await page.click('button:has-text("Submit")');
    
    // Expect to be redirected to requests list and see the new request
    await expect(page).toHaveURL(/.*\/requests/);
    await expect(page.locator('body')).toContainText(requestTitle);
    await expect(page.locator('body')).toContainText('OPEN');

    // Tenant logs out
    await page.goto('/api/auth/signout');
    await page.click('button:has-text("Sign out")');

    // 2. Manager logs in and assigns vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', managerEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Find the request by title and click it
    await page.click(`text="${requestTitle}"`);
    await expect(page).toHaveURL(/.*\/requests\/.*/);

    // Assign Vendor (Select dropdown)
    // shadcn select interaction:
    await page.click('button[role="combobox"]:has-text("Select a vendor")');
    await page.click('div[role="option"]:has-text("Dummy Vendor")');
    await page.click('button:has-text("Save Changes")');

    // Expect the vendor name to appear
    await expect(page.locator('body')).toContainText('Dummy Vendor');

    // Manager logs out
    await page.goto('/api/auth/signout');
    await page.click('button:has-text("Sign out")');

    // 3. Vendor logs in and updates status
    await page.goto('/login');
    await page.fill('input[name="email"]', vendorEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    // Vendor is redirected to /vendor/requests
    await expect(page).toHaveURL(/.*\/vendor\/requests/);

    // See the assigned request
    await expect(page.locator('body')).toContainText(requestTitle);
    await page.click(`text="${requestTitle}"`);
    // wait, is there a detail page for vendors? 
    // In T058, it says "vendor view fetching GET /api/requests ... renders list with RequestStatusBadge, request title, property name, and unit number"
    // Wait, let's just check if it appears in the list. Vendors might not have a detail page, they might change status from the list or just view.
    // Let me check if there's a vendor requests page.
  });
});
