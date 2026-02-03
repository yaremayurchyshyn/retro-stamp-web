import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_TIMEOUT = 45000

test.describe('RetroStamp MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for app to load (Pyodide takes ~12s)
    await page.waitForSelector('text=Drop photos here', { timeout: TEST_TIMEOUT })
  })

  test('shows privacy banner', async ({ page }) => {
    await expect(page.locator('text=Your photos never leave your device')).toBeVisible()
  })

  test('shows upload zone after loading', async ({ page }) => {
    await expect(page.locator('text=Drop photos here or click to select')).toBeVisible()
  })

  test('processes JPG file successfully', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('text=Waiting...')).toBeVisible()
    
    await page.click('button:has-text("Process All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
    await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
  })

  test('processes PNG file successfully', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.png')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await page.click('button:has-text("Process All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('processes multiple files in batch', async ({ page }) => {
    const jpgPath = path.join(__dirname, '../fixtures/test.jpg')
    const pngPath = path.join(__dirname, '../fixtures/test.png')
    
    await page.setInputFiles('input[type="file"]', [jpgPath, pngPath])
    await expect(page.locator('text=Waiting...')).toHaveCount(2)
    
    await page.click('button:has-text("Process All (2)")')
    await expect(page.locator('text=Done')).toHaveCount(2, { timeout: TEST_TIMEOUT })
    await expect(page.locator('button:has-text("Download All (2)")')).toBeVisible()
  })
})
