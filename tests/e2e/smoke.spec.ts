import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check that the page loads without error
    await expect(page).toHaveTitle(/Vue Menu/i);
    
    // Check for key elements on the homepage
    await expect(page.getByText('ランダムサーチ')).toBeVisible();
    await expect(page.getByText('全てのメニューをランダムに表示')).toBeVisible();
    
    // Wait for the page to be fully loaded (no loading indicators)
    await page.waitForLoadState('networkidle');
    
    // Check that no console errors occurred
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate again to capture any console errors
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Assert no console errors (allowing some expected warnings)
    const criticalErrors = errors.filter(error => 
      !error.includes('warning') && 
      !error.includes('deprecated') &&
      !error.includes('favicon')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('menu list page loads without errors', async ({ page }) => {
    // Navigate to the menu list page
    await page.goto('/menuList');

    // Check that the page loads without major errors
    await page.waitForLoadState('networkidle');
    
    // Check for key elements on the menu list page
    await expect(page.getByText('全件表示')).toBeVisible();
    
    // Check that the data table is present
    await expect(page.locator('.v-data-table')).toBeVisible();
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to menu list using the navigation
    await page.click('text=一覧');
    await expect(page).toHaveURL(/.*menuList/);
    
    // Navigate back to home
    await page.click('text=ホーム');
    await expect(page).toHaveURL(/.*\//);
  });
});