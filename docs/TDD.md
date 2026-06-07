# Technical Design Document (TDD) - Memories of You (Web-Based)

## 1. Deskripsi Umum

**Memories of You** adalah sebuah *therapeutic narrative-driven game* berbasis web (PWA) yang menggunakan Expert System berbasis psikologi klinis (CBT) untuk menyesuaikan narasi dengan kondisi emosional pemain.

> **Platform: Web-Based (PWA)** — Game ini dibangun menggunakan React + Vite, bukan Unity. Keputusan ini diprioritaskan untuk aksesibilitas lintas platform tanpa instalasi.

---

## 2. Arsitektur Sistem

### 2.1 Alur Sistem (Flowchart)

```
Mulai
  ↓
Input Nama
  ↓
Menu Utama ──── Keluar
  ↓
[Lanjut / Game Baru]
  ↓
Ambil Variabel (IndexedDB)          ← Inisialisasi Variabel (Game Baru)
  ↓
╔══════════════ SIKLUS HARIAN ══════════════╗
║  Mulai Hari                               ║
║    ↓                                      ║
║  Rawat Kaktus                             ║
║    ↓                                      ║
║  Misi Harian (Acak dari Pool Chapter)     ║
║    ↓                                      ║
║  Refleksi Malam (Input Expert System)     ║
║    ↓                                      ║
║  Expert System Evaluasi                   ║
║    ↓                                      ║
║  Siap Pindah Tahap? ─── Tidak ──→ Loop   ║
║    ↓ Ya                                   ║
║  Event Kanon → Pindah Chapter             ║
║    ↓                                      ║
║  Simpan (Auto-Save)                       ║
╚═══════════════════════════════════════════╝
```

### 2.2 Tech Stack

| Layer | Teknologi | Alasan |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Component-based UI, HMR cepat untuk development |
| **Language** | TypeScript | Type safety untuk variabel emosional yang kompleks |
| **State Management** | Zustand | Ringan & sinkron; ideal untuk variabel emotional state global |
| **Database Lokal** | Dexie.js (IndexedDB) | Auto-save lokal, offline-first, API Promise-based |
| **Styling** | CSS Modules + CSS Variables | Kontrol penuh estetika; adaptive theme via CSS variables |
| **Rendering 2D** | PixiJS (via `@pixi/react`) | Performa tinggi untuk sprite, animasi, dan efek visual |
| **Audio** | Howler.js | Spatial audio, audio sprite, adaptive music layering |
| **PWA** | Vite PWA Plugin (Workbox) | Service worker, manifest, offline caching |
| **Enkripsi** | SubtleCrypto API (AES-GCM) | Native browser crypto, tidak perlu library eksternal |
| **Hashing** | SubtleCrypto API (SHA-256) | Integrity check pada data save |

> **Catatan tentang Rendering:** PixiJS dipilih dibanding Three.js/React Three Fiber karena game ini adalah 2D narrative dengan sprite + efek filter, bukan 3D penuh. PixiJS lebih ringan dan lebih cocok untuk target web/PWA.

---

## 3. Struktur Folder Proyek

```
src/
├── assets/           # Sprite, background, audio, font
│   ├── characters/
│   ├── locations/
│   ├── ui/
│   └── audio/
├── components/       # Reusable UI components
│   ├── dialogue/     # DialogueBox, ChoiceList, TextTyper
│   ├── smartphone/   # SmartphoneFrame, apps/
│   ├── minigames/    # SliderPuzzle, HiddenObject, WordPuzzle, dll.
│   ├── cactus/       # CactusRenderer (state-based)
│   └── effects/      # GlitchFilter, BlurOverlay, FadeTransition
├── scenes/           # Layar/scene utama
│   ├── MainMenu/
│   ├── Prologue/
│   ├── chapters/     # Chapter1Denial/, Chapter2Anger/, dst.
│   └── Epilogue/
├── systems/
│   ├── expertSystem/ # Forward chaining engine + rule base
│   ├── saveSystem/   # Encrypt/decrypt, Dexie schema, auto-save
│   ├── dialogueEngine/ # Branching narrative parser
│   ├── flashbackSystem/ # Trigger & playback flashback
│   └── audioSystem/  # Adaptive music manager (Howler.js)
├── stores/           # Zustand stores
│   ├── emotionalStore.ts   # distress, hope, denial, rumination
│   ├── gameStateStore.ts   # chapter, day, stage, flags
│   └── inventoryStore.ts   # flashback unlocked, action history
├── data/             # Static data (JSON)
│   ├── dialogues/    # Script dialog per chapter
│   ├── missions/     # Mission pool per chapter
│   ├── flashbacks/   # Flashback scripts
│   └── ruleBase.ts   # Expert System rules
└── utils/            # Helper functions
    ├── crypto.ts     # AES-GCM encrypt/decrypt
    ├── hash.ts       # SHA-256 hash
    └── color.ts      # Color interpolation untuk adaptive palette
```

---

## 4. Expert System — Implementasi Teknis

### 4.1 Metode
**Forward Chaining** — Sistem mengevaluasi rules dari kondisi saat ini untuk menentukan output.

### 4.2 Alur Kerja

```typescript
// Pseudocode alur Expert System per akhir hari
function evaluateNight(state: EmotionalState): SystemOutput {
  const applicableRules = ruleBase
    .filter(rule => rule.condition(state))
    .sort((a, b) => b.priority - a.priority);

  return applicableRules[0]?.action(state) ?? defaultOutput(state);
}
```

### 4.3 Input Sources
1. **Jawaban Refleksi Malam** — Pilihan ganda dari percakapan dengan kaktus (5–7 pertanyaan/malam).
2. **Pola Perilaku Implisit** — Pilihan misi harian, waktu respons, pola penghindaran yang direkam.
3. **Action History** — Akumulasi pilihan dari hari-hari sebelumnya dalam chapter yang sama.

---

## 5. Manajemen Data & Schema

### 5.1 Save Data Schema (JSON)

| Variabel | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `timestamp` | datetime | Waktu auto-save |
| `name` | string | Nama pemain (input awal) |
| `stage` | string | Tahap buka aktif (prologue/denial/anger/...) |
| `day` | int | Hari ke-berapa dalam tahap aktif |
| `distress` | float (0–100) | Level distress pemain |
| `hope` | float (0–100) | Level hope pemain |
| `denial` | float (0–100) | Level denial aktif |
| `rumination` | string ("brooding" / "reflection") | Mode berpikir pemain |
| `avoidance_count` | int | Hitungan pilihan avoidance berturut-turut |
| `internalized_anger_count` | int | Hitungan anger terpendam berturut-turut |
| `aggressive_choice_count` | int | Hitungan pilihan agresif berturut-turut |
| `consecutive_hard_denial` | int | Hitungan hard denial berurutan |
| `flashback_unlocked` | list[string] | ID flashback yang sudah dibuka |
| `action_history` | list[string] | ID misi yang telah diselesaikan |
| `inventory` | list[string] | Benda yang dikumpulkan (memori/hadiah) |

### 5.2 Dexie.js Schema

```typescript
class MemoDatabase extends Dexie {
  saves!: Table<SaveData, string>;  // key: save_slot_id
  settings!: Table<Settings, string>;

  constructor() {
    super('MemoriesOfYouDB');
    this.version(1).stores({
      saves: 'id, timestamp, name, stage',
      settings: 'key'
    });
  }
}
```

### 5.3 Auto-Save Flow
- Dipanggil otomatis setiap kali hari berakhir (setelah Expert System evaluasi).
- Data dienkripsi (AES-GCM) sebelum dimasukkan ke IndexedDB.
- Hash SHA-256 disimpan bersama data untuk verifikasi integritas.

---

## 6. Security

### 6.1 Data Encryption (AES-GCM 256-bit)
```typescript
async function encryptSave(data: SaveData): Promise<EncryptedBlob> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { cipher, iv };
}
```

### 6.2 Data Integrity Check (SHA-256)
File save JSON disertai nilai hash SHA-256 menggunakan `crypto.subtle.digest`. Saat load, hash dihitung ulang dan dibandingkan. Ketidaksesuaian → data ditolak dan pemain diperingatkan.

### 6.3 Code Obfuscation
Kode yang mengatur logika Expert System (rule base + variabel emosional) akan di-obfuscate saat build production menggunakan `vite-plugin-obfuscator` agar logika tidak mudah dibongkar (*reverse engineered*).

### 6.4 Local Privacy
Data 100% disimpan di lokal (IndexedDB browser). Tidak ada pengiriman data ke server luar. Tidak ada analytics eksternal.

---

## 7. UI/UX Specifications

### 7.1 Adaptive Theme (CSS Variables)
```css
:root {
  --color-primary: hsl(270, 60%, 50%);    /* Default: ungu */
  --color-bg: hsl(240, 30%, 10%);
  --color-text: hsl(0, 0%, 90%);
  --filter-distress: grayscale(0%) blur(0px);
}

/* Contoh: Chapter Depression */
[data-chapter="depression"] {
  --color-primary: hsl(220, 70%, 20%);   /* Midnight blue */
  --color-bg: hsl(220, 40%, 5%);
  --filter-distress: grayscale(60%) blur(1px);
}
```

### 7.2 Visual Effects
| Efek | Implementasi | Trigger |
| :--- | :--- | :--- |
| Glitch | CSS animation + PixiJS DisplacementFilter | Timed dialogue timeout, Denial tinggi |
| Color shift | CSS Variable interpolation via JS | Transisi chapter |
| Blur/Grayscale | CSS filter + `distress_meter` | Distress > 70 |
| Slow Motion | CSS `animation-duration` scaling | Post-crying (Depression) |
| Screen ripple | PixiJS ShockwaveFilter | Event Kanon trigger |
| Fade dissolve | CSS opacity transition | Chapter transition |

### 7.3 UI Screens

**Main Menu**
- Background & suasana berubah sesuai stage terakhir pemain.
- Tombol: New Game, Load, Quit.
- Tidak ada title screen statis — langsung responsif terhadap state emosional.

**Pause Menu**
- Resume, Options (audio/text speed), Main Menu, Quit Game.
- Dapat diakses kapan saja kecuali saat cutscene terkunci.

**Load System**
- Daftar save slot (maks. 5 slot).
- Info per slot: Nama MC, Chapter aktif, Hari, Tanggal simpan.
- Highlight slot terbaru.

**Name Input**
- Dialog modal saat New Game.
- Input field dengan validasi (min 1 karakter, maks 20 karakter).
- Tombol: Cancel, Confirm.

**Smartphone UI**
- Overlay full-screen saat dibuka.
- Apps: Map, Chat, Gallery, Music, Notes.
- Notifikasi adaptif muncul berdasarkan game state.

---

## 8. Audio System (Howler.js)

### 8.1 Adaptive Music
- Setiap chapter memiliki 1 tema musik utama.
- Musik di-fade in/out saat transisi chapter menggunakan Howler `fade()`.
- Audio sprite digunakan untuk SFX pendek (notifikasi, klik, efek glitch).

### 8.2 Kategori Audio
| Kategori | Format | Keterangan |
| :--- | :--- | :--- |
| BGM per chapter | `.ogg` / `.mp3` | Loop terus; fade saat transisi |
| Flashback theme | `.ogg` | Dimainkan hanya selama flashback |
| SFX UI | audio sprite `.ogg` | Klik, swipe, notif smartphone |
| Ambience | `.ogg` (loop) | Suara lingkungan per lokasi |
| Emotional cues | `.ogg` | Dipicu oleh event emosional spesifik |

---

## 9. PWA Configuration

```json
// manifest.json
{
  "name": "Memories of You",
  "short_name": "MemoY",
  "display": "standalone",
  "background_color": "#1a0a2e",
  "theme_color": "#6b21a8",
  "start_url": "/",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service Worker Strategy:**
- Assets statis (JS, CSS, font, audio): Cache-first.
- Game data (IndexedDB): Lokal-only, tidak di-cache service worker.
- Offline fallback: Game dapat dimainkan penuh tanpa internet setelah first load.

---

## 10. Performance Budget (Web Target)

| Metrik | Target |
| :--- | :--- |
| First Load (bundle size) | < 2 MB (gzipped) |
| Time to Interactive | < 3 detik (koneksi 4G) |
| FPS target | 60 FPS (Chrome/Firefox desktop) |
| Audio latency | < 50 ms (Howler Web Audio API) |
| IndexedDB read/write | < 100 ms per operasi |

**Optimasi:**
- Code splitting per chapter (lazy loading via `React.lazy`).
- Asset audio di-compress ke `.ogg` (Vorbis).
- Sprite atlas untuk aset karakter (mengurangi draw call).
- CSS Variables untuk tema adaptif (tanpa JS re-render berlebihan).

---

## 11. Batasan Teknis

1. **Auto-Save Harian** — Progres hanya disimpan saat hari berakhir. Crash sebelum auto-save = hari tersebut diulang.
2. **Offline-Only** — IndexedDB tidak tersinkronisasi ke cloud. Data hilang jika browser data dihapus.
3. **Browser Compatibility** — Target: Chrome 90+, Firefox 88+, Edge 90+. Safari iOS terbatas (IndexedDB quota lebih ketat).
4. **Crypto API** — `SubtleCrypto` hanya tersedia di HTTPS. Development via `localhost` atau deploy ke HTTPS wajib.
5. **Audio Autoplay Policy** — Howler.js menangani unlock audio context via interaksi user pertama (klik apapun di layar).
