# Requirements

## Product

**Name**: RetroStamp  
**Tagline**: "Date your memories"

---

## Functional Requirements

### FR-01: Photo Upload
- User can select multiple photos via file picker
- User can drag & drop photos onto the page
- Supported formats: JPEG, PNG, HEIC, WEBP
- No hard limit on photo count (degrade gracefully if performance suffers)

### FR-02: Processing
- "Process All" button starts batch processing
- Photos processed sequentially
- Preview shown as each photo completes
- Progress indicator: "Processing 3/10..."

### FR-03: Timestamp Style (MVP - Fixed)
- Position: bottom-right corner
- Date format: DD.MM.YYYY
- Color: Orange (#FFA032), semi-transparent
- Size: 4% of image's smaller dimension
- Date source: Current date (EXIF date in Phase 2)

### FR-04: Download
- Individual download button per photo
- "Download All" button for batch
- Output: JPEG for HEIC input, original format for others
- Quality: 95%

### FR-05: Privacy
- All processing in browser (client-side only)
- No server requests for photo data
- Privacy banner at top of page

### FR-06: Error Handling
- Failed photos are skipped, processing continues
- User-friendly error message (no technical details)
- Retry option for failed photos

---

## Non-Functional Requirements

### NFR-01: Performance
- Initial load: < 15 seconds (with progress indicator)
- Processing: < 5 seconds per photo
- UI remains responsive during processing

### NFR-02: Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Chrome Android
- Desktop and mobile responsive

### NFR-03: Hosting
- GitHub Pages (static, free)
- No backend

---

## UI/UX Requirements

### UX-01: Layout
- Vertical list for uploaded/processed photos
- Mobile-first responsive design

### UX-02: Loading State
- Progress bar during initial library load (~12s)
- Phase indicators (e.g., "Loading image processor...")
- Time estimate if possible

### UX-03: Privacy Banner
- Top of page, always visible
- Trust-building styling (green, shield icon)
- Text: "Your photos never leave your device"

### UX-04: Error Display
- Friendly message, no technical jargon
- Retry and skip options
- Visual indicator on failed photos

---

## Future Requirements (Post-MVP)

### Phase 2
- EXIF date extraction
- Preview before/after comparison
- ZIP download
- i18n: English + Ukrainian (Ukrainian for ru locale)

### Phase 3
- Per-photo customization (color, position, format, font)
- Reprocess individual photos on setting change

### Phase 4
- Google Analytics integration
- Preset styles
- Remember preferences (localStorage)
