import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_TIMEOUT = 180000

interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

test.describe('Memory Usage', () => {
  test('tracks memory during HEIC processing with worker reset', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT)
    
    await page.goto('/')
    await page.waitForSelector('text=Drop photos here', { timeout: 60000 })

    const getMemory = async (): Promise<MemoryInfo | null> => {
      return page.evaluate(() => {
        const perf = performance as Performance & { memory?: MemoryInfo }
        if (!perf.memory) return null
        return {
          usedJSHeapSize: perf.memory.usedJSHeapSize,
          totalJSHeapSize: perf.memory.totalJSHeapSize,
          jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
        }
      })
    }

    const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB'
    const logMemory = async (label: string) => {
      const mem = await getMemory()
      if (mem) console.log(`${label}: ${formatMB(mem.usedJSHeapSize)}`)
    }

    await logMemory('1. Initial')

    // Upload 3 HEIC files
    const filePath = path.join(__dirname, '../fixtures/test.heic')
    await page.setInputFiles('input[type="file"]', [filePath, filePath, filePath])
    await page.waitForSelector('text=Ready to process', { timeout: 60000 })
    await page.waitForTimeout(3000)
    await logMemory('2. After 3 uploads')

    // Process all
    await page.click('button:has-text("Stamp All")')
    await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 120000 })
    
    // Wait for worker reset
    await page.waitForTimeout(5000)
    await logMemory('3. After processing + worker reset')

    // Force GC
    await page.evaluate(() => {
      if ((window as unknown as { gc?: () => void }).gc) {
        (window as unknown as { gc: () => void }).gc()
      }
    })
    await page.waitForTimeout(2000)
    await logMemory('4. After GC')
  })
})
