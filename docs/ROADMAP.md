# Roadmap

## Vision

RetroStamp - a simple, privacy-first web tool for adding retro timestamps to photos. No accounts, no uploads, no tracking.

---

## Versioning

We use [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

---

## Releases

### v0.1.0 - MVP ✅
**Status**: Released  
**Date**: 2026-02-03

- [x] Upload photos (JPEG, PNG, HEIC, WEBP)
- [x] Add date stamp (current date)
- [x] Batch processing
- [x] Download individual + all
- [x] Privacy banner
- [x] 100% client-side

---

### v0.1.x - Reserved for bug fixes
**Status**: Reserved

Space for critical bug fixes to v0.1.0.

---

### v0.2.1 - Mobile Download Fix
**Status**: Released (partial - iOS still broken)  
**Date**: 2026-02-03

- [x] Fix download button on mobile (ISSUE-001) - Android only

---

### v0.2.2 - iOS Fixes
**Status**: Released  
**Date**: 2026-02-03

- [x] Fix download on iOS using Blob URL (ISSUE-001)
- [x] Fix image rotation using EXIF orientation (ISSUE-002) - partial, caused double rotation for HEIC

---

### v0.2.3 - HEIC Rotation Fix
**Status**: Released  
**Date**: 2026-02-03

- [x] Fix HEIC double rotation - libheif already applies orientation (ISSUE-002)

---

### v0.2.0 - EXIF Date
**Status**: Released  
**Date**: 2026-02-03

- [x] Extract date from photo EXIF metadata (DateTimeOriginal, CreateDate, ModifyDate)
- [x] Show error if photo has no date metadata
- [x] Default format: DD.MM.YYYY

---

### v0.2.5 - EXIF Fallback Fix
**Status**: Released  
**Date**: 2026-02-07

- [x] Use file date as fallback when no EXIF date (ISSUE-003)
- [x] Add HEIC e2e test coverage

---

### v0.3.0 - Editable Date & Preview
**Status**: Released  
**Date**: 2026-02-07

- [x] Show date picker for each photo (editable before processing)
- [x] Preview modal on thumbnail click
- [x] Loading state for HEIC files
- [x] Reprocess after date change
- [x] Rename button to "Stamp All"

---

### v0.4.0 - Internationalization
**Status**: Released  
**Date**: 2026-02-07

- [x] i18n setup with English and Ukrainian
- [x] Auto-detect browser language (uk/ru → Ukrainian)
- [x] Language toggle in header
- [x] Persist language choice to localStorage

---

### v0.5.0 - Per-photo Controls
**Status**: Planned

- [ ] Process button per photo
- [ ] Remove photo from list

---

### v0.6.0 - ZIP Download
**Status**: Planned

- [ ] Download all as ZIP file

---

### v0.7.0 - Preview
**Status**: Planned

- [ ] Before/after comparison view

---

### v1.0.0 - Stable
**Status**: Planned

- [ ] All Phase 2 features complete
- [ ] Mobile UX polished
- [ ] Performance optimized

---

## Future Ideas (Backlog)

Not scheduled yet:
- Date format options
- Position options (4 corners)
- Color picker
- Font size adjustment
- Preset styles
- Google Analytics
- Remember preferences (localStorage)
- Web Worker for non-blocking processing

---

## Non-Goals

Explicitly out of scope:
- User accounts
- Server-side processing
- Cloud storage
- Social sharing
- Monetization
