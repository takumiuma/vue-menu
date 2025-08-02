import { test, expect } from '@playwright/test'

// Mock menu data for E2E tests
const mockMenuData = {
  menus: [
    {
      menuId: 1,
      menuName: 'ハンバーガー',
      genreIds: [5],
      categoryIds: [1],
    },
    {
      menuId: 2,
      menuName: 'ラーメン',
      genreIds: [1],
      categoryIds: [5],
    },
    {
      menuId: 3,
      menuName: 'パスタ',
      genreIds: [3],
      categoryIds: [5],
    },
  ],
}

test.describe('Smoke Tests', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Mock API responses to avoid backend dependency
    await page.route('**/v1/menus', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMenuData),
      })
    })

    // Navigate to the homepage
    await page.goto('/')

    // Check that the page loads without error
    await expect(page).toHaveTitle(/Vue Menu/i)

    // Check for key elements on the homepage
    await expect(page.getByText('ランダムサーチ')).toBeVisible()
    await expect(page.getByText('全てのメニューをランダムに表示')).toBeVisible()

    // Wait for the page to be fully loaded (no loading indicators)
    await page.waitForLoadState('networkidle')

    // Check that no console errors occurred
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Navigate again to capture any console errors
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Assert no console errors (allowing some expected warnings)
    const criticalErrors = errors.filter(error =>
      !error.includes('warning')
      && !error.includes('deprecated')
      && !error.includes('favicon'),
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('menu list page loads without errors', async ({ page }) => {
    // Mock API responses to avoid backend dependency
    await page.route('**/v1/menus', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMenuData),
      })
    })

    // Navigate to the menu list page
    await page.goto('/menuList')

    // Check that the page loads without major errors
    await page.waitForLoadState('networkidle')

    // Check for key elements on the menu list page
    await expect(page.getByText('全件表示')).toBeVisible()

    // Check that the data table is present
    await expect(page.locator('.v-data-table')).toBeVisible()
  })

  test('navigation between pages works', async ({ page }) => {
    // Mock API responses for both pages
    await page.route('**/v1/menus', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMenuData),
      })
    })

    await page.goto('/')

    // Open navigation drawer by clicking the nav icon
    await page.locator('.v-app-bar-nav-icon').click()
    await page.waitForTimeout(500) // Wait for drawer animation

    // Navigate to menu list using the navigation
    await page.locator('.v-list-item').filter({ hasText: 'メニューリスト' }).click()
    await expect(page).toHaveURL(/.*menuList/)

    // Open navigation drawer again for going back
    await page.locator('.v-app-bar-nav-icon').click()
    await page.waitForTimeout(500) // Wait for drawer animation

    // Navigate back to home
    await page.locator('.v-list-item').filter({ hasText: 'ホーム' }).click()
    await expect(page).toHaveURL(/.*\//)
  })
})
