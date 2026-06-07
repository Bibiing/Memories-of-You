# Memories of You

> Therapeutic narrative-driven web game tentang perjalanan melewati lima tahapan berduka.

## Setup Lokal

### Prasyarat
- Node.js >= 20
- npm >= 10

### Instalasi

```bash
git clone <repo-url>
cd memories-of-you
npm install
npm run dev
```

Buka browser di `http://localhost:5173`

### Perintah

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Jalankan dev server dengan HMR |
| `npm run build` | Build production + PWA service worker |
| `npm run preview` | Preview build production secara lokal |
| `npm run lint` | Jalankan ESLint |

### Catatan Development
- **HTTPS diperlukan** untuk fitur enkripsi (`SubtleCrypto`) di production. `localhost` sudah HTTPS-equivalent secara default.
- **Browser target:** Chrome 90+, Firefox 88+, Edge 90+.
- Data disimpan di **IndexedDB** browser lokal. Hapus browser data = hapus save file.

## Struktur Proyek

```
src/
├── assets/           # Sprite, background, audio, font
├── components/       # Reusable UI components
├── data/             # Script JSON (dialogue, misi, flashback, ruleBase)
├── scenes/           # Layar/scene utama per chapter
├── stores/           # Zustand state management
├── systems/          # Core game systems (expert, save, dialogue, audio)
├── types/            # Shared TypeScript types
└── utils/            # Helper functions (crypto, hash, color)
```

## Branching Strategy

| Branch | Tujuan |
| :--- | :--- |
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/xxx` | Fitur baru (merge ke develop) |
| `fix/xxx` | Bug fix |

## Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| Framework | React 18 + Vite + TypeScript (strict) |
| State | Zustand |
| Database Lokal | Dexie.js (IndexedDB) |
| Rendering 2D | PixiJS + @pixi/react |
| Audio | Howler.js |
| PWA | vite-plugin-pwa (Workbox) |
| Enkripsi | SubtleCrypto — AES-GCM 256-bit |
| Integritas | SubtleCrypto — SHA-256 |
