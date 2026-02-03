# POC Results

## Status: ✅ SUCCESS

## Validated
1. ✅ Pyodide + Pillow loads in browser (~10-15s)
2. ✅ JPEG/PNG processing works
3. ✅ HEIC (iOS 17+) works with `libheif-js@1.19.8`
4. ✅ 100% client-side - no server needed

## Key Findings

### HEIC Support
- `heic2any` - ❌ fails on iOS 17+ HEIC
- `libheif-js@1.19.8` - ✅ works (uses libheif 1.19)
- Native `pillow-heif` uses libheif 1.20.2

### Architecture
```
HEIC file → libheif-js (WASM) → RGBA data → Pyodide/Pillow → JPEG output
JPEG/PNG  → Pyodide/Pillow directly → JPEG output
```

### Performance (4284x5712 HEIC)
- Initial load: ~12s (Pyodide + Pillow + libheif WASM)
- HEIC decode + timestamp: ~3s

## Limitations (Accepted for MVP)
- HEIC outputs as JPEG (no HEIC encoding in browser)
- Uses current date (not EXIF date) - TODO for main project
- Default Pillow font (scaled up)

## Libraries
- `pyodide@0.24.1` - Python runtime in browser
- `pillow` - Image processing (via Pyodide)
- `libheif-js@1.19.8` - HEIC decoding (WASM)
