import type { ImageStrategy } from './types'
import { extractExifDate, getExifOrientation, uint8ArrayToBase64 } from '../utils/imageUtils'
import { pythonWorker } from '../pyodide/PythonWorker'

export class JpegPngStrategy implements ImageStrategy {
  canHandle(file: File): boolean {
    return /\.(jpe?g|png)$/i.test(file.name.toLowerCase())
  }

  async extractDate(file: File): Promise<string> {
    return extractExifDate(file)
  }

  async generateThumbnail(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const base64 = uint8ArrayToBase64(new Uint8Array(arrayBuffer))
    return `data:${file.type || 'image/jpeg'};base64,${base64}`
  }

  async process(file: File, dateStr: string): Promise<string> {
    const orientation = await getExifOrientation(file)
    const base64Input = await this.fileToBase64(file)

    return pythonWorker.run(
      'add_timestamp(input_data, date_str, orientation)',
      { input_data: base64Input, date_str: dateStr, orientation }
    )
  }

  private async fileToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    return uint8ArrayToBase64(new Uint8Array(arrayBuffer))
  }
}
