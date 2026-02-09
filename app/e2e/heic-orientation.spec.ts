import { test, expect, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_TIMEOUT = 45000

test.use({
  ...devices['iPhone 13'],
  defaultBrowserType: 'chromium',
})

test('processes HEIC with orientation 6 correctly on mobile', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('text=Drop photos here', { timeout: TEST_TIMEOUT })

  const filePath = path.join(__dirname, '../fixtures/IMG_6178.HEIC')

  await page.setInputFiles('input[type="file"]', filePath)
  await page.click('button:has-text("Stamp All")')
  await expect(page.locator('text=Done')).toBeVisible({ timeout: TEST_TIMEOUT })

  // Get the processed image and check it's portrait (height > width)
  const dimensions = await page.evaluate(async () => {
    const img = document.querySelector('img[alt="IMG_6178.HEIC"]') as HTMLImageElement
    if (!img?.src) return null

    return new Promise<{ width: number; height: number }>((resolve) => {
      const testImg = new Image()
      testImg.onload = () => resolve({ width: testImg.naturalWidth, height: testImg.naturalHeight })
      testImg.src = img.src
    })
  })

  expect(dimensions).not.toBeNull()
  // Original image is portrait (taken with orientation 6).
  // If correctly oriented, height should be greater than width.
  expect(dimensions!.height).toBeGreaterThan(dimensions!.width)
})
