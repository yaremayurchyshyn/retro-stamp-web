# Implementation Plan - MVP

## Phase: MVP
## Status: In Progress

---

## 1. Project Setup ✅

- [x] 1.1 Create Vite + React + TypeScript project
- [x] 1.2 Install dependencies + Zustand
- [x] 1.3 Create folder structure
- [x] 1.4 Configure Vite for GitHub Pages
- [x] 1.5 Deploy to GitHub Pages (verified live)

---

## 2. Zustand Store ✅

- [x] 2.1 Create `src/store/useAppStore.ts`
- [x] 2.2 Define PhotoItem and AppState interfaces
- [x] 2.3 Implement all actions

---

## 3. Image Processor Service ✅

- [x] 3.1 Create `src/services/imageProcessor.ts`
- [x] 3.2 Implement init, isHeic, decodeHeic, processImage
- [x] 3.3 Add HEIC preview support (decodeHeicToBase64)

---

## 4-11. Components ✅

- [x] LoadingScreen
- [x] PrivacyBanner
- [x] UploadZone (drag & drop + file picker)
- [x] PhotoItem (thumbnail, status, download)
- [x] PhotoList
- [x] ProcessButton
- [x] DownloadAllButton
- [x] App (assembly)

---

## 12. Styling ✅

- [x] CSS Modules for all components
- [x] Base styles in index.css
- [x] Clean Code: constants, no magic numbers

---

## 13. Testing

- [x] 13.1 Test with JPEG file
- [ ] 13.2 Test with PNG file
- [x] 13.3 Test with HEIC file (iOS 17+)
- [ ] 13.4 Test batch upload (5+ files)
- [ ] 13.5 Test error handling (corrupt file)
- [ ] 13.6 Test on mobile browser (iOS Safari)
- [x] 13.7 Test download individual
- [ ] 13.8 Test download all
- [ ] 13.9 Fix any UI/UX issues found

---

## 14. Deployment

- [x] 14.1 Build production
- [ ] 14.2 Test build locally: `npm run preview`
- [x] 14.3 GitHub repository exists
- [ ] 14.4 Push latest code to GitHub
- [x] 14.5 GitHub Pages configured
- [x] 14.6 GitHub Actions workflow
- [ ] 14.7 Verify live site works with latest code
- [ ] 14.8 Update README.md with live link

---

## Done Criteria

All checkboxes marked `[x]` = MVP complete.
