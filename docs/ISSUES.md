# Known Issues

## ISSUE-001: Download button not working on mobile

**Status**: Fixed in v0.2.1  
**Severity**: Critical  
**Found in**: v0.2.0  
**Fixed in**: v0.2.1

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
