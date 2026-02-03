# RetroStamp

Add retro-style date stamps to your photos — like vintage film cameras.

🔗 **[Try it live](https://yaremayurchyshyn.github.io/retro-stamp-web/)**

## Features

- 📷 Supports JPEG, PNG, HEIC (iPhone photos)
- 🔒 100% client-side — your photos never leave your device
- 📦 Batch processing — stamp multiple photos at once
- ⬇️ Download individually or all at once

## Privacy

All processing happens in your browser using WebAssembly. No server, no uploads, no tracking.

## Tech Stack

- React + TypeScript
- Pyodide (Python in browser)
- libheif-js (HEIC decoding)
- Vite
- GitHub Pages

## Development

```bash
cd app
npm install
npm run dev
```

## Testing

```bash
npm run lint
npx playwright test
```

## License

MIT
