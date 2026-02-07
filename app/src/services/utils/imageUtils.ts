import exifr from 'exifr'

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function uint8ArrayToBase64(data: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }
  return btoa(binary)
}

export async function extractExifDate(file: File): Promise<string> {
  try {
    const exif = await exifr.parse(file, ['DateTimeOriginal', 'CreateDate', 'ModifyDate'])
    const date = exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate
    if (date instanceof Date) {
      return formatDate(date)
    }
  } catch (e) {
    console.error('EXIF extraction failed:', e)
  }
  return formatDate(new Date(file.lastModified))
}

export async function getExifOrientation(file: File): Promise<number> {
  try {
    const exif = await exifr.parse(file, ['Orientation'])
    return exif?.Orientation || 1
  } catch {
    return 1
  }
}
