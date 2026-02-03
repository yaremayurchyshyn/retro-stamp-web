# Implementation Plan - MVP

## Phase: MVP
## Status: Not Started

---

## 1. Project Setup

- [ ] 1.1 Create Vite + React + TypeScript project
  ```bash
  npm create vite@latest app -- --template react-ts
  ```
- [ ] 1.2 Move into `app/` directory, install dependencies
- [ ] 1.3 Install Zustand
  ```bash
  npm install zustand
  ```
- [ ] 1.4 Clean up default Vite files (remove App.css content, logo, default markup)
- [ ] 1.5 Create folder structure:
  ```
  src/
  ├── components/
  ├── services/
  └── store/
  ```
- [ ] 1.6 Configure Vite for GitHub Pages (base path in vite.config.ts)
- [ ] 1.7 Verify dev server runs: `npm run dev`

---

## 2. Zustand Store

- [ ] 2.1 Create `src/store/useAppStore.ts`
- [ ] 2.2 Define `PhotoItem` interface:
  - id: string
  - file: File
  - status: 'pending' | 'processing' | 'done' | 'error'
  - result?: string (base64)
  - error?: string
- [ ] 2.3 Define `AppState` interface:
  - photos: PhotoItem[]
  - isLoading: boolean
  - loadingPhase: string
  - processingIndex: number
- [ ] 2.4 Implement actions:
  - addPhotos(files: File[])
  - removePhoto(id: string)
  - setLoading(isLoading: boolean, phase?: string)
  - setPhotoStatus(id: string, status, result?, error?)
  - setProcessingIndex(index: number)
  - reset()

---

## 3. Image Processor Service

- [ ] 3.1 Create `src/services/imageProcessor.ts`
- [ ] 3.2 Define ImageProcessor class with private fields:
  - pyodide: any
  - libheif: any
  - ready: boolean
- [ ] 3.3 Implement `init(onProgress: (phase: string) => void)`:
  - [ ] 3.3.1 Load libheif-js from CDN (jsdelivr)
  - [ ] 3.3.2 Initialize libheif factory
  - [ ] 3.3.3 Load Pyodide from CDN
  - [ ] 3.3.4 Load Pillow package
  - [ ] 3.3.5 Run Python code to define `add_timestamp` and `add_timestamp_from_rgba` functions
  - [ ] 3.3.6 Call onProgress at each step
- [ ] 3.4 Implement `isHeic(file: File): boolean`
  - Check file extension (.heic, .heif) and MIME type
- [ ] 3.5 Implement `decodeHeic(file: File): Promise<{rgba: Uint8Array, width: number, height: number}>`
  - Read file as ArrayBuffer
  - Use libheif HeifDecoder
  - Return RGBA data via display() callback
- [ ] 3.6 Implement `processImage(file: File): Promise<string>`
  - [ ] 3.6.1 If HEIC: decode with decodeHeic(), call Python add_timestamp_from_rgba
  - [ ] 3.6.2 If other: read as base64, call Python add_timestamp
  - [ ] 3.6.3 Return base64 result
- [ ] 3.7 Export singleton instance

---

## 4. Components - Loading Screen

- [ ] 4.1 Create `src/components/LoadingScreen.tsx`
- [ ] 4.2 Props: phase (string), visible (boolean)
- [ ] 4.3 UI: centered container, spinner/progress bar, phase text
- [ ] 4.4 Style: full-screen overlay, semi-transparent background

---

## 5. Components - Privacy Banner

- [ ] 5.1 Create `src/components/PrivacyBanner.tsx`
- [ ] 5.2 UI: top banner, green background, shield icon (emoji or SVG)
- [ ] 5.3 Text: "🛡️ Your photos never leave your device - all processing happens in your browser"
- [ ] 5.4 Style: fixed top, subtle but visible

---

## 6. Components - Upload Zone

- [ ] 6.1 Create `src/components/UploadZone.tsx`
- [ ] 6.2 Implement drag & drop:
  - [ ] 6.2.1 onDragOver: prevent default, set drag state
  - [ ] 6.2.2 onDragLeave: reset drag state
  - [ ] 6.2.3 onDrop: prevent default, extract files, call addPhotos
- [ ] 6.3 Implement file input button:
  - [ ] 6.3.1 Hidden input with accept="image/jpeg,image/png,image/heic,image/heif,image/webp,.heic,.HEIC"
  - [ ] 6.3.2 Button triggers input click
  - [ ] 6.3.3 onChange: extract files, call addPhotos
- [ ] 6.4 Filter files: only accept supported formats
- [ ] 6.5 UI: dashed border area, icon, "Drop photos here or click to select"
- [ ] 6.6 Visual feedback: highlight on drag over

---

## 7. Components - Photo Item

- [ ] 7.1 Create `src/components/PhotoItem.tsx`
- [ ] 7.2 Props: photo (PhotoItem)
- [ ] 7.3 UI states:
  - [ ] 7.3.1 Pending: show filename, thumbnail (from File), "Waiting..."
  - [ ] 7.3.2 Processing: show spinner, "Processing..."
  - [ ] 7.3.3 Done: show result image preview, download button
  - [ ] 7.3.4 Error: show error message, retry button (optional for MVP)
- [ ] 7.4 Implement thumbnail generation from File (URL.createObjectURL)
- [ ] 7.5 Implement download button:
  - Create blob from base64
  - Create download link
  - Trigger click
  - Revoke object URL

---

## 8. Components - Photo List

- [ ] 8.1 Create `src/components/PhotoList.tsx`
- [ ] 8.2 Get photos from Zustand store
- [ ] 8.3 Render list of PhotoItem components
- [ ] 8.4 Show empty state if no photos
- [ ] 8.5 Style: vertical list, gap between items

---

## 9. Components - Process Button

- [ ] 9.1 Create `src/components/ProcessButton.tsx`
- [ ] 9.2 Get state from store: photos, processingIndex
- [ ] 9.3 Disabled states:
  - No photos uploaded
  - Already processing
  - All photos already done
- [ ] 9.4 Button text:
  - "Process All" (default)
  - "Processing 3/10..." (while processing)
- [ ] 9.5 onClick: trigger processAll action

---

## 10. Components - Download All Button

- [ ] 10.1 Create `src/components/DownloadAllButton.tsx`
- [ ] 10.2 Show only when at least one photo is done
- [ ] 10.3 onClick: loop through done photos, trigger download for each
- [ ] 10.4 Small delay between downloads (100ms) to avoid browser blocking

---

## 11. App Component - Assembly

- [ ] 11.1 Update `src/components/App.tsx`
- [ ] 11.2 On mount: call imageProcessor.init() with progress callback
- [ ] 11.3 Update store loading state during init
- [ ] 11.4 Implement processAll function:
  - [ ] 11.4.1 Loop through pending photos
  - [ ] 11.4.2 Set status to 'processing'
  - [ ] 11.4.3 Call imageProcessor.processImage()
  - [ ] 11.4.4 On success: set status 'done', store result
  - [ ] 11.4.5 On error: set status 'error', store friendly message
  - [ ] 11.4.6 Update processingIndex
- [ ] 11.5 Layout:
  ```
  PrivacyBanner
  LoadingScreen (conditional)
  UploadZone
  ProcessButton + DownloadAllButton
  PhotoList
  ```

---

## 12. Styling

- [ ] 12.1 Update `src/index.css` with base styles:
  - Reset/normalize
  - Font family (system fonts)
  - Color variables
- [ ] 12.2 Mobile-first responsive design
- [ ] 12.3 Style each component (inline or CSS modules)
- [ ] 12.4 Consistent spacing, colors, borders

---

## 13. Testing & Polish

- [ ] 13.1 Test with JPEG file
- [ ] 13.2 Test with PNG file
- [ ] 13.3 Test with HEIC file (iOS 17+)
- [ ] 13.4 Test batch upload (5+ files)
- [ ] 13.5 Test error handling (corrupt file)
- [ ] 13.6 Test on mobile browser (iOS Safari)
- [ ] 13.7 Test download individual
- [ ] 13.8 Test download all
- [ ] 13.9 Fix any UI/UX issues found

---

## 14. Deployment

- [ ] 14.1 Build production: `npm run build`
- [ ] 14.2 Test build locally: `npm run preview`
- [ ] 14.3 Create GitHub repository (if not exists)
- [ ] 14.4 Push code to GitHub
- [ ] 14.5 Configure GitHub Pages:
  - Settings → Pages → Source: GitHub Actions
  - Or: deploy from `dist/` folder
- [ ] 14.6 Add GitHub Actions workflow for auto-deploy (optional)
- [ ] 14.7 Verify live site works
- [ ] 14.8 Update README.md with live link

---

## Done Criteria

All checkboxes marked `[x]` = MVP complete.
