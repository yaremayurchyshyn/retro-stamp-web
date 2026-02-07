import exifr from 'exifr'

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>
  }
}

interface PyodideInterface {
  loadPackage: (name: string) => Promise<void>
  runPythonAsync: (code: string) => Promise<string>
  globals: {
    set: (name: string, value: unknown) => void
  }
}

interface HeifImage {
  get_width: () => number
  get_height: () => number
  display: (
    config: { data: Uint8Array; width: number; height: number },
    callback: (result: { data: Uint8Array } | null) => void
  ) => void
}

interface HeifDecoder {
  decode: (data: Uint8Array) => HeifImage[]
}

interface LibHeif {
  HeifDecoder: new () => HeifDecoder
}

// Default date format: DD.MM.YYYY

const PYTHON_CODE = `
from PIL import Image, ImageDraw, ImageFont
import io
import base64

def apply_orientation(img, orientation):
    if orientation == 2:
        return img.transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation == 3:
        return img.rotate(180)
    elif orientation == 4:
        return img.transpose(Image.FLIP_TOP_BOTTOM)
    elif orientation == 5:
        return img.transpose(Image.FLIP_LEFT_RIGHT).rotate(90, expand=True)
    elif orientation == 6:
        return img.rotate(270, expand=True)
    elif orientation == 7:
        return img.transpose(Image.FLIP_LEFT_RIGHT).rotate(270, expand=True)
    elif orientation == 8:
        return img.rotate(90, expand=True)
    return img

def rgba_to_jpeg(rgba_base64, width, height):
    rgba_bytes = base64.b64decode(rgba_base64)
    img = Image.frombytes("RGBA", (width, height), rgba_bytes)
    img = img.convert("RGB")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def add_timestamp(input_base64, date_str, orientation=1):
    image_bytes = base64.b64decode(input_base64)
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGBA")
    img = apply_orientation(img, orientation)
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    
    color = (255, 160, 50, 200)
    font = ImageFont.load_default()
    
    bbox = font.getbbox(date_str)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    target_height = int(min(img.width, img.height) * 0.04)
    scale = target_height / text_height if text_height > 0 else 1
    
    margin = int(min(img.width, img.height) * 0.03)
    x = img.width - int(text_width * scale) - margin
    y = img.height - int(text_height * scale) - margin
    
    txt_img = Image.new("RGBA", (text_width + 2, text_height + 2), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((0, 0), date_str, font=font, fill=color)
    
    scaled_size = (int(txt_img.width * scale), int(txt_img.height * scale))
    txt_img = txt_img.resize(scaled_size, Image.BILINEAR)
    
    overlay.paste(txt_img, (x, y), txt_img)
    
    result = Image.alpha_composite(img, overlay)
    result = result.convert("RGB")
    
    buffer = io.BytesIO()
    result.save(buffer, format="JPEG", quality=95)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def add_timestamp_from_rgba(rgba_base64, width, height, date_str, orientation=1):
    rgba_bytes = base64.b64decode(rgba_base64)
    img = Image.frombytes("RGBA", (width, height), rgba_bytes)
    img = apply_orientation(img, orientation)
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    
    color = (255, 160, 50, 200)
    font = ImageFont.load_default()
    
    bbox = font.getbbox(date_str)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    target_height = int(min(img.width, img.height) * 0.04)
    scale = target_height / text_height if text_height > 0 else 1
    
    margin = int(min(img.width, img.height) * 0.03)
    x = img.width - int(text_width * scale) - margin
    y = img.height - int(text_height * scale) - margin
    
    txt_img = Image.new("RGBA", (text_width + 2, text_height + 2), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((0, 0), date_str, font=font, fill=color)
    
    scaled_size = (int(txt_img.width * scale), int(txt_img.height * scale))
    txt_img = txt_img.resize(scaled_size, Image.BILINEAR)
    
    overlay.paste(txt_img, (x, y), txt_img)
    
    result = Image.alpha_composite(img, overlay)
    result = result.convert("RGB")
    
    buffer = io.BytesIO()
    result.save(buffer, format="JPEG", quality=95)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')
`

const LIBHEIF_URL = 'https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.mjs'
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs'

async function loadModule(url: string): Promise<unknown> {
  return await Function(`return import("${url}")`)()
}

const BYTES_PER_PIXEL = 4

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

class ImageProcessor {
  private pyodide: PyodideInterface | null = null
  private libheif: LibHeif | null = null
  private ready = false

  async init(onProgress: (phase: string) => void): Promise<void> {
    onProgress('Loading HEIC decoder...')
    const libheifModule = await loadModule(LIBHEIF_URL) as { default: () => Promise<LibHeif> }
    this.libheif = await libheifModule.default()

    onProgress('Loading Python runtime...')
    const pyodideModule = await loadModule(PYODIDE_URL) as { loadPyodide: () => Promise<PyodideInterface> }
    this.pyodide = await pyodideModule.loadPyodide()

    if (!this.pyodide) throw new Error('Failed to load Pyodide')

    onProgress('Loading image library...')
    await this.pyodide.loadPackage('pillow')

    onProgress('Preparing processor...')
    await this.pyodide.runPythonAsync(PYTHON_CODE)

    this.ready = true
  }

  isReady(): boolean {
    return this.ready
  }

  private isHeic(file: File): boolean {
    const name = file.name.toLowerCase()
    return (
      name.endsWith('.heic') ||
      name.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif'
    )
  }

  private async extractDateAndOrientation(file: File): Promise<{ dateStr: string; orientation: number }> {
    let orientation = 1
    try {
      const exif = await exifr.parse(file, ['DateTimeOriginal', 'CreateDate', 'ModifyDate', 'Orientation'])
      const date = exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate
      orientation = exif?.Orientation || 1
      
      console.log('EXIF extracted:', { date, orientation, fileName: file.name })
      
      if (date instanceof Date) {
        return { dateStr: formatDate(date), orientation }
      }
    } catch (e) {
      console.error('EXIF extraction failed:', e)
    }
    // Fallback to file's last modified date
    return { dateStr: formatDate(new Date(file.lastModified)), orientation }
  }

  async extractDate(file: File): Promise<string> {
    const { dateStr } = await this.extractDateAndOrientation(file)
    return dateStr
  }

  private async decodeHeic(file: File): Promise<{ rgba: Uint8Array; width: number; height: number }> {
    if (!this.libheif) throw new Error('libheif not initialized')
    
    const arrayBuffer = await file.arrayBuffer()
    const decoder = new this.libheif.HeifDecoder()
    const data = decoder.decode(new Uint8Array(arrayBuffer))

    if (!data || data.length === 0) {
      throw new Error('Failed to decode HEIC file')
    }

    const image = data[0]
    const width = image.get_width()
    const height = image.get_height()

    const rgba = await new Promise<Uint8Array>((resolve, reject) => {
      const buffer = new Uint8Array(width * height * BYTES_PER_PIXEL)
      image.display({ data: buffer, width, height }, (displayData: { data: Uint8Array } | null) => {
        if (!displayData) {
          reject(new Error('Failed to get image data'))
        } else {
          resolve(displayData.data)
        }
      })
    })

    return { rgba, width, height }
  }

  async processImage(file: File, customDateStr?: string): Promise<string> {
    if (!this.ready || !this.pyodide) {
      throw new Error('Processor not initialized')
    }

    const { dateStr: extractedDate, orientation } = await this.extractDateAndOrientation(file)
    const dateStr = customDateStr || extractedDate

    if (this.isHeic(file)) {
      const { rgba, width, height } = await this.decodeHeic(file)

      let binary = ''
      for (let i = 0; i < rgba.length; i++) {
        binary += String.fromCharCode(rgba[i])
      }
      const rgbaBase64 = btoa(binary)

      this.pyodide.globals.set('rgba_data', rgbaBase64)
      this.pyodide.globals.set('img_width', width)
      this.pyodide.globals.set('img_height', height)
      this.pyodide.globals.set('date_str', dateStr)
      this.pyodide.globals.set('orientation', orientation)

      return await this.pyodide.runPythonAsync(
        'add_timestamp_from_rgba(rgba_data, img_width, img_height, date_str, orientation)'
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64Input = btoa(binary)

    this.pyodide.globals.set('input_data', base64Input)
    this.pyodide.globals.set('date_str', dateStr)
    this.pyodide.globals.set('orientation', orientation)
    return await this.pyodide.runPythonAsync('add_timestamp(input_data, date_str, orientation)')
  }

  async decodeHeicToBase64(file: File): Promise<string> {
    if (!this.ready || !this.pyodide) {
      throw new Error('Processor not initialized')
    }

    const { rgba, width, height } = await this.decodeHeic(file)

    let binary = ''
    for (let i = 0; i < rgba.length; i++) {
      binary += String.fromCharCode(rgba[i])
    }
    const rgbaBase64 = btoa(binary)

    this.pyodide.globals.set('rgba_data', rgbaBase64)
    this.pyodide.globals.set('img_width', width)
    this.pyodide.globals.set('img_height', height)

    return await this.pyodide.runPythonAsync(
      'rgba_to_jpeg(rgba_data, img_width, img_height)'
    )
  }
}

export const imageProcessor = new ImageProcessor()
