# Roadmap

## Vision

RetroStamp - a simple, privacy-first web tool for adding retro timestamps to photos. No accounts, no uploads, no tracking.

---

## Phase 1: MVP ← CURRENT

**Status**: In Progress  
**Tracking**: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

**Scope**:
- Single-page React app
- Upload multiple photos (drag & drop)
- Fixed timestamp style (orange, bottom-right, DD.MM.YYYY)
- Support JPEG, PNG, HEIC
- Download individual + all
- Privacy banner
- Progress indicators
- Deploy to GitHub Pages

**Success**: Users can stamp their iPhone photos without technical knowledge.

---

## Phase 2: Polish

**Status**: Not Started  
**Tracking**: TBD (GitHub Issues or IMPLEMENTATION_PLAN_PHASE2.md)

**Scope**:
- Use EXIF date instead of current date
- Preview before/after comparison
- ZIP download for batch
- i18n: English + Ukrainian (Ukrainian for ru locale)
- Improved error messages
- Better mobile UX

---

## Phase 3: Customization

**Status**: Not Started

**Scope**:
- Date format options (DD.MM.YYYY, MM/DD/YYYY, YYYY-MM-DD)
- Position options (4 corners)
- Color picker
- Font size adjustment
- Opacity control
- Per-photo settings

---

## Phase 4: Advanced

**Status**: Not Started

**Scope**:
- Google Analytics integration
- Preset styles (vintage, modern, minimal)
- Remember preferences (localStorage)
- Web Worker for non-blocking processing
- Service Worker for offline support

---

## Non-Goals

Explicitly out of scope forever:
- User accounts / authentication
- Server-side processing
- Cloud storage integration
- Social sharing
- Monetization / ads
