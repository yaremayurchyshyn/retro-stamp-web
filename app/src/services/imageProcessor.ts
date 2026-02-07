import type { ImageStrategy } from './strategies/types'
import { JpegPngStrategy } from './strategies/JpegPngStrategy'
import { HeicStrategy } from './strategies/HeicStrategy'
import { pythonRunner } from './pyodide/PythonRunner'

class ImageProcessor {
  private strategies: ImageStrategy[] = []
  private heicStrategy: HeicStrategy
  private ready = false

  constructor() {
    this.heicStrategy = new HeicStrategy()
    this.strategies = [this.heicStrategy, new JpegPngStrategy()]
  }

  async init(onProgress: (phase: string) => void): Promise<void> {
    await this.heicStrategy.init(onProgress)
    await pythonRunner.init(onProgress)
    this.ready = true
  }

  isReady(): boolean {
    return this.ready && pythonRunner.isReady()
  }

  private getStrategy(file: File): ImageStrategy {
    const strategy = this.strategies.find((s) => s.canHandle(file))
    if (!strategy) {
      throw new Error(`Unsupported file format: ${file.name}`)
    }
    return strategy
  }

  async extractDate(file: File): Promise<string> {
    return this.getStrategy(file).extractDate(file)
  }

  async generateThumbnail(file: File): Promise<string> {
    return this.getStrategy(file).generateThumbnail(file)
  }

  async processImage(file: File, customDateStr?: string): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Processor not initialized')
    }

    const strategy = this.getStrategy(file)
    const dateStr = customDateStr || (await strategy.extractDate(file))
    return strategy.process(file, dateStr)
  }
}

export const imageProcessor = new ImageProcessor()

