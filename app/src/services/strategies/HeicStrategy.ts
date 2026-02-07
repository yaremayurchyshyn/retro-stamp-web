import type { ImageStrategy, LibHeif } from './types'
import { extractExifDate, uint8ArrayToBase64 } from '../utils/imageUtils'
import { pythonRunner } from '../pyodide/PythonRunner'
import { LIBHEIF_URL, BYTES_PER_PIXEL } from '../constants'

export class HeicStrategy implements ImageStrategy {
  private libheif: LibHeif | null = null
  private isProcessingThumbnail = false
  private pendingThumbnails: Array<{
    file: File
    resolve: (url: string) => void
    reject: (error: Error) => void
  }> = []

  async init(onProgress: (phase: string) => void): Promise<void> {
    onProgress('Loading HEIC decoder...')
    // Dynamic import via Function() required for CDN ESM modules
    const libheifModule = await Function(`return import("${LIBHEIF_URL}")`)() as { 
      default: () => Promise<LibHeif> 
    }
    this.libheif = await libheifModule.default()
  }

  canHandle(file: File): boolean {
    const name = file.name.toLowerCase()
    return name.endsWith('.heic') || name.endsWith('.heif') ||
           file.type === 'image/heic' || file.type === 'image/heif'
  }

  async extractDate(file: File): Promise<string> {
    return extractExifDate(file)
  }

  async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pendingThumbnails.push({ file, resolve, reject })
      this.processNextThumbnail()
    })
  }

  private async processNextThumbnail(): Promise<void> {
    if (this.isProcessingThumbnail || this.pendingThumbnails.length === 0) return
    
    this.isProcessingThumbnail = true
    const { file, resolve, reject } = this.pendingThumbnails.shift()!

    try {
      const { rgba, width, height } = await this.decodeHeic(file)
      pythonRunner.setGlobal('rgba_data', uint8ArrayToBase64(rgba))
      pythonRunner.setGlobal('img_width', width)
      pythonRunner.setGlobal('img_height', height)
      const base64 = await pythonRunner.run('rgba_to_thumbnail(rgba_data, img_width, img_height)')
      resolve(`data:image/jpeg;base64,${base64}`)
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Thumbnail generation failed'))
    }

    this.isProcessingThumbnail = false
    this.processNextThumbnail()
  }

  async process(file: File, dateStr: string): Promise<string> {
    const { rgba, width, height } = await this.decodeHeic(file)

    pythonRunner.setGlobal('rgba_data', uint8ArrayToBase64(rgba))
    pythonRunner.setGlobal('img_width', width)
    pythonRunner.setGlobal('img_height', height)
    pythonRunner.setGlobal('date_str', dateStr)
    pythonRunner.setGlobal('orientation', 1)

    return pythonRunner.run('add_timestamp_from_rgba(rgba_data, img_width, img_height, date_str, orientation)')
  }

  private async decodeHeic(file: File): Promise<{ rgba: Uint8Array; width: number; height: number }> {
    if (!this.libheif) throw new Error('libheif not initialized')

    const arrayBuffer = await file.arrayBuffer()
    const decoder = new this.libheif.HeifDecoder()
    const decodedImages = decoder.decode(new Uint8Array(arrayBuffer))

    if (!decodedImages || decodedImages.length === 0) {
      throw new Error('Failed to decode HEIC file')
    }

    const image = decodedImages[0]
    const width = image.get_width()
    const height = image.get_height()

    const rgba = await new Promise<Uint8Array>((resolve, reject) => {
      const buffer = new Uint8Array(width * height * BYTES_PER_PIXEL)
      image.display({ data: buffer, width, height }, (displayData) => {
        displayData ? resolve(displayData.data) : reject(new Error('Failed to get image data'))
      })
    })

    return { rgba, width, height }
  }
}
