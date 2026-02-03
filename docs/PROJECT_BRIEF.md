# Project Brief: retro-stamp-web

## Overview

A web application that allows anyone to add retro-style timestamps to their photos, without technical knowledge. Photos are processed entirely in the browser - they never leave the user's device.

## Problem Statement

Adding vintage date stamps to photos before printing is tedious. Users must either:
- Manually edit each photo in image software
- Use technical tools like our retro-stamp Python library

This app makes it simple: upload photos → download stamped photos.

## Goals

- Provide a simple, one-page UI for adding timestamps to photos
- Support iPhone photos (HEIC format) - primary use case
- Process photos 100% client-side (browser) for maximum privacy
- Zero cost hosting (GitHub Pages)
- No user accounts required

## Target Users

- Anyone who wants to print photos with date stamps
- Non-technical users who can't use command-line tools
- Privacy-conscious users who don't want to upload photos to servers

## Killer Feature

**Photos never leave your device.** All processing happens in your browser. No server, no uploads, no data collection.

## Scope

### MVP (In Scope)
- Single-page web app
- Upload multiple photos (up to 10-30)
- Process all photos with fixed timestamp style (orange, bottom-right, DD.MM.YYYY)
- Download results as individual files (or ZIP if simple)
- Support: JPEG, PNG, HEIC, WEBP
- Client-side only processing
- Host on GitHub Pages

### Future (Out of Scope for MVP)
- Configurable styling (color, position, format)
- Per-photo settings
- ZIP download
- Usage metrics/analytics
- Preview before download

## Technical Direction

- **Frontend**: React (single-page app)
- **Processing**: JavaScript implementation of timestamp logic
- **HEIC Support**: `heic2any` library (converts HEIC→JPEG in browser)
- **Hosting**: GitHub Pages (free, static hosting)
- **Backend**: None (client-only)

## Relationship to retro-stamp Library

This is a separate project that provides a web UI for the same functionality as the `retro-stamp` Python library. The core timestamp logic will be reimplemented in JavaScript for browser compatibility.

The Python library remains the source of truth for:
- Timestamp styling (color, position, size ratios)
- Date format
- EXIF extraction logic

## Privacy Commitment

- No server-side processing
- No photo uploads
- No cookies or tracking (MVP)
- No user accounts
- Open source code for transparency

## Success Criteria

A non-technical user can:
1. Open the website
2. Select photos from their phone/computer (including iPhone HEIC)
3. Click one button
4. Download all photos with timestamps added
5. Trust that their photos were never sent anywhere
