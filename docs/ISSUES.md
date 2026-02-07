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

**Status**: Fixed in v0.5.1  
**Severity**: Critical  
**Found in**: v0.5.0  
**Fixed in**: v0.5.1

### Description

Page crashes when uploading ~10 HEIC images on Chrome mobile.

### Root Cause

All HEIC thumbnails decoded in parallel, causing memory spike (~49MB per image for RGBA buffer).

### Solution

- Queue HEIC thumbnail decoding (one at a time)
- Generate smaller thumbnails (200px max, quality 70%)

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
