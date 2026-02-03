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
**Status**: Released  
**Date**: 2026-02-03

- [x] Fix download button on mobile (ISSUE-001)

---

### v0.2.0 - EXIF Date
**Status**: Released  
**Date**: 2026-02-03

- [x] Extract date from photo EXIF metadata (DateTimeOriginal, CreateDate, ModifyDate)
- [x] Show error if photo has no date metadata
- [x] Default format: DD.MM.YYYY

---

### v0.3.0 - Per-photo Controls
**Status**: Planned

- [ ] Process button per photo
- [ ] Remove photo from list

---

### v0.4.0 - Internationalization
**Status**: Planned

- [ ] i18n setup
- [ ] English language
- [ ] Ukrainian language
- [ ] Auto-detect browser language
- [ ] Ukrainian for Russian locale

---

### v0.5.0 - ZIP Download
**Status**: Planned

- [ ] Download all as ZIP file

---

### v0.6.0 - Preview
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
