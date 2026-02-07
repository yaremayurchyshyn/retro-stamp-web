export interface ImageStrategy {
  canHandle(file: File): boolean
  extractDate(file: File): Promise<string>
  generateThumbnail(file: File): Promise<string>
  process(file: File, dateStr: string): Promise<string>
}

export interface HeifImage {
  get_width: () => number
  get_height: () => number
  display: (
    config: { data: Uint8Array; width: number; height: number },
    callback: (result: { data: Uint8Array } | null) => void
  ) => void
}

export interface HeifDecoder {
  decode: (data: Uint8Array) => HeifImage[]
}

export interface LibHeif {
  HeifDecoder: new () => HeifDecoder
}
