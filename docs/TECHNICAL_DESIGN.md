# Technical Design

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   React App                      │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────────┐  │   │
│  │  │ UploadZone│ │ PhotoList │ │ PrivacyBanner │  │   │
│  │  └─────┬─────┘ └─────┬─────┘ └───────────────┘  │   │
│  │        │             │                          │   │
│  │        └──────┬──────┘                          │   │
│  │               ▼                                 │   │
│  │        ┌─────────────┐                          │   │
│  │        │   Zustand   │ (files, status, results) │   │
│  │        └──────┬──────┘                          │   │
│  └───────────────┼─────────────────────────────────┘   │
│                  ▼                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ImageProcessor                      │   │
│  │  ┌─────────────┐        ┌──────────────────┐    │   │
│  │  │ libheif-js  │        │ Pyodide + Pillow │    │   │
│  │  │   (WASM)    │───────▶│     (WASM)       │    │   │
│  │  │ HEIC→RGBA   │        │  Add timestamp   │    │   │
│  │  └─────────────┘        └──────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. User drops files → UploadZone
2. Files added to Zustand store
3. User clicks "Process All"
4. For each file:
   ├─ HEIC? → libheif-js decode → RGBA bytes
   └─ Other? → Read as base64
5. Pillow adds timestamp → base64 output
6. Result stored in Zustand
7. PhotoList shows preview + download button
```

## State (Zustand)

```typescript
interface PhotoItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: string  // base64
  error?: string
}

interface AppState {
  photos: PhotoItem[]
  isLoading: boolean      // initial lib load
  loadingPhase: string    // "Loading Pyodide..."
  processingIndex: number // current photo being processed
  
  addPhotos: (files: File[]) => void
  removePhoto: (id: string) => void
  processAll: () => Promise<void>
  reset: () => void
}
```

## Components

| Component | Responsibility |
|-----------|----------------|
| `App` | Layout, orchestration |
| `PrivacyBanner` | Top banner with privacy message |
| `LoadingScreen` | Progress bar during initial load |
| `UploadZone` | Drag & drop, file picker |
| `PhotoList` | List of photos with status/preview |
| `PhotoItem` | Single photo row |
| `ProcessButton` | "Process All" button |

## Services

### imageProcessor.ts

```typescript
// Singleton - loads once, reuses
class ImageProcessor {
  private pyodide: any
  private libheif: any
  private ready: boolean
  
  async init(onProgress: (phase: string) => void): Promise<void>
  async processImage(file: File): Promise<string>  // returns base64
}
```

## File Structure

```
src/
├── components/
│   ├── App.tsx
│   ├── PrivacyBanner.tsx
│   ├── LoadingScreen.tsx
│   ├── UploadZone.tsx
│   ├── PhotoList.tsx
│   ├── PhotoItem.tsx
│   └── ProcessButton.tsx
├── services/
│   └── imageProcessor.ts
├── store/
│   └── useAppStore.ts
├── main.tsx
└── index.css
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18 | UI |
| zustand | ^4 | State management |
| pyodide | 0.24.1 | Python in browser (CDN) |
| libheif-js | 1.19.8 | HEIC decoding (CDN) |
| vite | ^5 | Build tool |
| typescript | ^5 | Type safety |

## Hosting

- GitHub Pages
- Static files only
- Pyodide/libheif loaded from CDN (jsdelivr)

## Future: Web Worker Migration

MVP runs on main thread. To migrate to Web Worker:

1. Move `ImageProcessor` to worker file
2. Use `postMessage` for communication
3. Main thread sends file data, receives base64 result
4. UI stays responsive during heavy processing
