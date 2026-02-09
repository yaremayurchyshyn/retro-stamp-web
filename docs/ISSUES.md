# Known Issues

## ISSUE-001: Download button not working on mobile

**Status**: Fixed in v0.2.2  
**Severity**: Critical  
**Found in**: v0.2.0  
**Fixed in**: v0.2.2

### Description

Download button does not trigger file download on iOS browsers (Safari, Chrome).

### Solution

Use Blob URL instead of data URL, append link to DOM before clicking.

---

## ISSUE-004: Chrome mobile crashes with multiple HEIC uploads

**Status**: Fixed in v0.6.2  
**Severity**: Critical  
**Found in**: v0.5.0  
**Fixed in**: v0.6.2

### Description

Page crashes when uploading/processing multiple HEIC images on Chrome mobile.

### Root Cause

Pyodide (Python WASM) memory not released after processing. Each HEIC processing used ~1GB that was never freed.

### Solution

- Move Pyodide to Web Worker
- Terminate worker after batch processing
- New worker created for next batch → fresh memory
- Memory reduced from 1.1GB to 296MB (74% reduction)

---

## ISSUE-003: PNG/JPEG without EXIF fails processing

**Status**: Fixed in v0.2.5  
**Severity**: Medium  
**Found in**: v0.2.0  
**Fixed in**: v0.2.5

### Description

PNG and JPEG files without EXIF date metadata show "Processing failed" error.

### Root Cause

Code threw error when no EXIF date found instead of using fallback.

### Solution

Use file's lastModified date as fallback when EXIF date unavailable.

---

## ISSUE-002: Image rotated incorrectly on mobile

**Status**: Fixed in v0.2.3  
**Severity**: Critical  
**Found in**: v0.2.1  
**Fixed in**: v0.2.3

### Description

HEIC images appear rotated 90° counter-clockwise after processing.

### Root Cause

libheif already applies EXIF orientation during decode. v0.2.2 applied it again, causing double rotation.

### Solution

For HEIC: Skip orientation (libheif handles it).
For JPEG: Apply orientation (Pillow doesn't auto-apply).

### Description

Download button does not trigger file download on mobile browsers (iOS Safari, Chrome Android).

### Steps to Reproduce

1. Open RetroStamp on mobile device
2. Upload and process a photo
3. Tap "Download" button
4. Nothing happens

### Root Cause

The `<a>` element download approach using `link.click()` doesn't work reliably on mobile browsers. Mobile Safari requires user gesture and has restrictions on programmatic downloads.

### Solution

Use `window.open()` with blob URL or trigger download via `<a>` element that user actually taps.

### Affected Files

- `src/components/PhotoItem.tsx`
- `src/components/DownloadAllButton.tsx`


---

## ISSUE-005: Cannot re-upload same file after deletion

**Status**: Fixed in v0.7.1  
**Severity**: Medium  
**Found in**: v0.7.0  
**Fixed in**: v0.7.1

### Description

When a user uploads a photo, deletes it, and tries to upload the same file again — nothing happens. The photo does not appear. Uploading a different file works fine.

### Root Cause

The HTML `<input type="file">` element doesn't fire `onChange` when the same file is selected again because the input's value hasn't changed.

### Solution

Reset the file input value (`e.target.value = ''`) after each file selection in `handleFileSelect`.

### Affected Files

- `src/components/UploadZone.tsx`

---

# Technical Debt

## TD-001: Python code as string literal
**Priority**: High  
**File**: pythonCode.ts (104 lines)

Python code stored as template string. No syntax highlighting, linting, or IDE support. Duplicated timestamp logic.

---

## TD-002: PhotoItem component doing too much
**Priority**: High  
**File**: PhotoItem.tsx (165 lines)

Handles thumbnail, date extraction, download, preview modal, and UI. Should split into smaller components.

---

## TD-003: Manual base64 conversion in download handler
**Priority**: Medium  
**File**: PhotoItem.tsx

Manual atob() and byte array conversion. DOM manipulation for download. Should extract to utility.

---

## TD-004: Magic numbers in Python code
**Priority**: Low  
**File**: pythonCode.ts

Hardcoded values: max_size=200, quality=70, quality=95. Should extract to constants.

---

## TD-005: CSS hardcoded values
**Priority**: Low  
**File**: PhotoItem.module.css (128 lines)

Repeated values (60px, 12px, 8px). Should use CSS custom properties.

---

## TD-006: Zustand store lacks computed selectors
**Priority**: Low  
**File**: useAppStore.ts

No memoized selectors for derived state. Components recalculate independently.
