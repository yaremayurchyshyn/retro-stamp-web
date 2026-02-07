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
    await expect(page.locator('text=Ready to process')).toBeVisible()
    
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
    
    // Verify download button exists
    const downloadBtn = page.getByRole('button', { name: 'Download', exact: true })
    await expect(downloadBtn).toBeVisible()
  })

  test('processes PNG file using file date as fallback', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.png')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('processes HEIC file successfully', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.heic')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('shows loading state for HEIC file', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.heic')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('text=Loading')).toBeVisible()
    await expect(page.locator('text=Ready to process')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('shows date picker after upload', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('input[type="date"]')).toBeVisible()
  })

  test('allows changing date and reprocessing', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
    
    // Change date
    await page.fill('input[type="date"]', '2020-01-15')
    await expect(page.locator('text=Ready to process')).toBeVisible()
    
    // Reprocess
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })
  })

  test('opens preview modal on thumbnail click', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('input[type="date"]')).toBeVisible()
    
    // Click thumbnail
    await page.click('img[alt="test.jpg"]')
    
    // Verify overlay is visible
    await expect(page.locator('div[class*="overlay"]')).toBeVisible()
    
    // Close by clicking
    await page.click('div[class*="overlay"]')
    await expect(page.locator('div[class*="overlay"]')).not.toBeVisible()
  })

  test('removes photo from list', async ({ page }) => {
    const filePath = path.join(__dirname, '../fixtures/test.jpg')
    
    await page.setInputFiles('input[type="file"]', filePath)
    await expect(page.locator('text=test.jpg')).toBeVisible()
    
    await page.click('button:has-text("✕")')
    await expect(page.locator('text=test.jpg')).not.toBeVisible()
  })

  test('shows version in footer', async ({ page }) => {
    await expect(page.locator('text=v0.')).toBeVisible()
  })
})
