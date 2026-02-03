import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_TIMEOUT = 45000

test.describe('RetroStamp', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Drop photos here', { timeout: TEST_TIMEOUT })
  })

  test('shows privacy banner', async ({ page }) => {
    await expect(page.locator('text=Your photos never leave your device')).toBeVisible()
  })

  test('shows upload zone after loading', async ({ page }) => {
    await expect(page.locator('text=Drop photos here or click to select')).toBeVisible()
  })

  test('processes JPG file with EXIF date successfully', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('text=Waiting...')).toBeVisible()
    
    await page.click('button:has-text("Process All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
    
    // Verify download button exists
    const downloadBtn = page.getByRole('button', { name: 'Download', exact: true })
    await expect(downloadBtn).toBeVisible()
  })

  test('shows error for file without EXIF date', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.png')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await page.click('button:has-text("Process All")')
    await expect(page.locator('text=❌')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('shows version in footer', async ({ page }) => {
    await expect(page.locator('text=v0.')).toBeVisible()
  })
})
