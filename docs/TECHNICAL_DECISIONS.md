# Technical Decisions

## Decision 001: Client-side Processing Approach

**Date**: 2026-02-03  
**Status**: ✅ Decided - Pyodide

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A) JS Rewrite** | Reimplement retro-stamp logic in JavaScript | Fast, small (~500KB), native browser | Duplicate code, two codebases to maintain |
| **B) Pyodide** | Run Python + Pillow in browser via WebAssembly | Reuse Pillow, proven image processing | Heavy (~15MB), slow startup |
| **C) Server-side** | Backend processes photos | Simple, full library support | Photos leave device, privacy concern, hosting cost |

### Decision

**Option B (Pyodide)** - validated by POC.

### POC Results

- ✅ Pyodide + Pillow loads in ~12s
- ✅ JPEG/PNG processing works
- ✅ HEIC works via `libheif-js@1.19.8`
- ✅ 100% client-side

---

## Decision 002: HEIC Decoding

**Date**: 2026-02-03  
**Status**: ✅ Decided - libheif-js

### Problem

`pillow-heif` cannot run in browser (native C dependencies). Need JS-based HEIC decoder.

### Options Tested

| Library | Result |
|---------|--------|
| `heic2any` | ❌ Fails on iOS 17+ HEIC |
| `libheif-js@1.17` | ❌ API issues |
| `libheif-js@1.19.8` | ✅ Works |

### Decision

Use `libheif-js@1.19.8` (WASM build of libheif 1.19).

### Architecture

```
HEIC → libheif-js (decode to RGBA) → Pillow (add timestamp) → JPEG output
JPEG/PNG → Pillow directly → JPEG/PNG output
```

---

## Decision 003: Output Format

**Date**: 2026-02-03  
**Status**: ✅ Decided

| Input | Output | Reason |
|-------|--------|--------|
| JPEG | JPEG | Preserve format |
| PNG | PNG | Preserve format |
| HEIC | JPEG | No HEIC encoder in browser |

Accepted limitation for MVP.
