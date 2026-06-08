# Development Plan - Memories of You (Web-Based)

**Platform:** React + Vite + TypeScript + PWA
**Target:** Produk final dapat dimainkan dari Prologue hingga Epilogue

---

## Ringkasan Fase

| Fase | Nama | Durasi | Status | Output Utama |
| :--- | :--- | :--- | :--- | :--- |
| 0 | Setup & Arsitektur | Minggu 1 | ✅ SELESAI | Project scaffold, CI/CD, struktur folder |
| 1 | Core Systems | Minggu 2–3 | ✅ SELESAI | State management, save/load, Expert System engine |
| 2 | Rendering & Visual Engine | Minggu 4–5 | ✅ SELESAI | Scene renderer, adaptive theme, efek visual |
| 3 | Dialogue & Narrative Engine | Minggu 6–7 | ✅ SELESAI | Dialogue box, branching, flashback system |
| 4 | Smartphone UI | Minggu 8 | ✅ SELESAI | Semua apps (Map, Chat, Gallery, Music, Notes) |
| 5 | Mini-Game Systems | Minggu 9–11 | ✅ SELESAI | Semua 11 tipe mini-game + MiniGameHost |
| 6 | Konten: Prologue | Minggu 12 | 🔲 Belum | Prologue fully playable |
| 7 | Konten: Denial + Anger | Minggu 13–15 | 🔲 Belum | Chapter 1 & 2 fully playable |
| 8 | Konten: Bargaining + Depression | Minggu 16–18 | 🔲 Belum | Chapter 3 & 4 fully playable |
| 9 | Konten: Acceptance + Epilogue | Minggu 19–20 | 🔲 Belum | Chapter 5 + Epilog fully playable |
| 10 | Audio & Visual Polish | Minggu 21–22 | 🔲 Belum | Musik adaptif, SFX, visual efek final |
| 11 | Expert System Refinement | Minggu 23 | 🔲 Belum | Balancing rule base, NPC intervention |
| 12 | Testing & QA | Minggu 24–25 | 🔲 Belum | Bug fix, playtest, accessibility |
| 13 | PWA & Deployment | Minggu 26 | 🔲 Belum | Build production, deploy, launch |

---

## FASE 0 — Setup & Arsitektur (Minggu 1) ✅ SELESAI

**Tujuan:** Pondasi proyek siap; semua developer bisa langsung coding.
**Commit:** `2528620` — feat: Phase 0 — project scaffold & core architecture

### Tasks
- [x] Init project: `npm create vite@latest memories-of-you -- --template react-ts`
- [x] Setup ESLint + Prettier dengan config TypeScript strict
- [x] Setup path aliases (`@/components`, `@/systems`, dst.) di `vite.config.ts`
- [x] Struktur folder lengkap sesuai TDD (src/assets, src/components, src/systems, src/scenes, src/stores, src/data)
- [x] Install dependencies utama:
  - `zustand` (state management)
  - `dexie` (IndexedDB)
  - `pixi.js` + `@pixi/react` (rendering)
  - `howler` (audio)
  - `vite-plugin-pwa` (PWA)
- [x] Setup Git repository + branching strategy (main/develop/feature branches)
- [x] Setup CI sederhana (GitHub Actions): lint + type-check on push
- [x] Buat `README.md` dengan instruksi setup lokal

**Milestone:** ✅ `npm run dev` jalan, struktur folder sesuai TDD, semua dependencies terinstall.

---

## FASE 1 — Core Systems (Minggu 2–3) ✅ SELESAI

**Tujuan:** Semua sistem fundamental (state, save, expert system) dapat berjalan meski belum ada UI.
**Commit:** `6475d5c` — feat: Phase 1 — Core Systems complete

### Minggu 2 — State Management & Save System

- [x] **Zustand Stores:**
  - `emotionalStore.ts` — variabel: `distress`, `hope`, `denial`, `rumination`, `avoidance_count`, `aggressive_choice_count`, `internalized_anger_count`, `consecutive_hard_denial`
  - `gameStateStore.ts` — variabel: `chapter`, `day`, `stage`, `playerName`, `currentMission`, `isGameOver`
  - `inventoryStore.ts` — variabel: `flashback_unlocked[]`, `action_history[]`, `inventory[]`
- [x] **Dexie.js Schema:**
  - Definisi tabel `saves` dan `settings`
  - Implementasi CRUD: `saveGame()`, `loadGame()`, `listSaves()`, `deleteSave()`
  - Support 5 save slot
- [x] **Crypto Utils:**
  - `crypto.ts`: AES-GCM 256-bit encrypt/decrypt menggunakan `SubtleCrypto`
  - `hash.ts`: SHA-256 hash + verify menggunakan `SubtleCrypto`
- [x] **Auto-Save Flow:**
  - Fungsi `autoSave()` yang encrypt → hash → simpan ke Dexie
  - Fungsi `loadAndVerify()` yang verify hash → decrypt → hydrate stores

**Milestone:** ✅ 82 unit & integration tests pass — simpan state ke IndexedDB, load kembali, verifikasi hash, data identik.

### Minggu 3 — Expert System Engine

- [x] **Rule Base Data (`data/ruleBase.ts`):**
  - Struktur tiap rule: `{ id, chapter, condition, action, priority }`
  - Implementasi semua rules dari ESDD (D-01→D-05, A-01→A-05, B-01→B-02, DEP-01→DEP-02, ACC-01, G-01)
- [x] **Forward Chaining Engine (`systems/expertSystem/`):**
  - `evaluateNight(state)` — filter applicable rules, sort by priority
  - `applyOutput(output)` + `applyOutputs(outputs)` — update stores
  - `checkChapterTransition(state)` — return true/false + nextChapter
  - `checkNPCIntervention(state)` — return true jika stuck ≥ 7 hari
- [x] **Question Bank (`data/questions/`):**
  - 58 pertanyaan total — prologue (8), denial (10), anger (8), bargaining (8), depression (8), acceptance (8)
  - Bobot psikologis CBT per opsi: distress/hope/denial/rumination/counter weights
- [x] **Console test:** Simulasi 7 hari gameplay — verifikasi state berubah sesuai rules

**Milestone:** ✅ Expert System memproses input dan menghasilkan output benar — dibuktikan 82 passing tests.

---

## FASE 2 — Rendering & Visual Engine (Minggu 4–5) ✅ SELESAI

**Tujuan:** Sistem rendering scene dan adaptive visual berjalan.
**Commit:** `ecafaf3` — feat: Phase 2 — Rendering & Visual Engine

### Minggu 4 — Scene System & Adaptive Theme

- [x] **Scene Manager:**
  - `SceneManager.tsx` — router scene berdasarkan `gameStateStore.scene`
  - Transisi antar scene: fade dissolve dengan CSS opacity transition
- [x] **Background Renderer:**
  - `SceneBackground.tsx` — menerima prop `location` dan `chapter`
  - 14 SVG placeholder backgrounds per lokasi + overlay tint per chapter
- [x] **Adaptive CSS Variables:**
  - `useAdaptiveTheme.ts` — hook yang update CSS variables via JS
  - Dipanggil otomatis saat chapter/distress berubah
- [x] **Color Interpolation (`utils/color.ts`):**
  - `interpolateHSL(from, to, t)` — smooth color transition (selesai Phase 0)

### Minggu 5 — Visual Effects

- [x] **PixiJS Integration:**
  - `GlitchEffect.tsx` — DisplacementFilter PixiJS, trigger via prop `intensity`
  - `RippleEffect.tsx` — ShockwaveFilter PixiJS, trigger on canon event
- [x] **CSS Effects:**
  - `BlurOverlay.tsx` — CSS filter blur, intensity linked ke `distress`
  - `GrayscaleFilter.tsx` — CSS filter grayscale, intensity linked ke `distress`
  - `SlowMotionWrapper.tsx` — CSS animation-duration scaling
- [x] **Cactus Renderer (`components/cactus/`):**
  - `CactusRenderer.tsx` — render SVG kaktus berdasarkan chapter
  - 7 SVG assets: healthy/sick/very-sick/dead-trying/dead/empty-pot/sprouting
  - Animasi idle per state (gentle sway / wilting droop via CSS keyframes)
- [x] **SVG Placeholder Assets:**
  - 14 lokasi background SVGs (kamar, rooftop, kelas, lab, dll.)
  - 7 cactus state SVGs
- [x] **Debug Panel (dev-only):**
  - Toggle chapter/scene/distress untuk verifikasi visual milestone

**Milestone:** ✅ Buka game → background muncul, warna berubah saat chapter diganti via debug panel, kaktus tampil sesuai chapter.

---

## FASE 3 — Dialogue & Narrative Engine (Minggu 6–7) ✅ SELESAI

**Tujuan:** Sistem dialogue dan flashback dapat berjalan dengan data skrip apapun.
**Commit:** `03091a1` — feat: Phase 3 — Dialogue & Narrative Engine

### Minggu 6 — Dialogue System

- [x] **Dialogue Data Format (`data/dialogues/`):**
  - JSON schema: `{ id, speaker, text, next, choices?: [{ label, next, weights?: {...} }] }`
  - Support: linear dialogue, branching choice, timed choice, conditional next
- [x] **Dialogue Engine (`systems/dialogueEngine/runner.ts`):**
  - Functional runner — `createRunner`, `advance`, `choose` (immutable state)
  - Support speaker types: "MC", "Dia", "NPC_hangout", "NPC_curhat", "Cactus", "System"
  - Integrasi dengan `emotionalStore` — choice weights diterapkan otomatis
  - `dialogueStore` (Zustand) — wraps runner untuk React integration
- [x] **Dialogue UI Components:**
  - `DialogueBox.tsx` — typewriter effect, speaker name, skip on click
  - `ChoiceList.tsx` — daftar pilihan dengan hover animation
  - `TimedChoiceList.tsx` — countdown progress bar; timeout → callback

### Minggu 7 — Flashback System & Narrative Triggers

- [x] **Flashback System (`systems/flashbackSystem/`):**
  - `flashbackManager.ts` — trigger lookup by location+chapter, unlock tracking via inventoryStore
  - `FlashbackPlayer.tsx` — local runner, sepia CSS filter overlay, inventory unlock on view
- [x] **7 Flashback Scripts (data/flashbacks/):**
  - `fb_telponan.json` — Pukul Satu Dini Hari (phone call)
  - `fb_makan.json` — Satu Porsi Berdua (shared meal)
  - `fb_ngeprank.json` — Operasi Lembar Jawaban (campus prank)
  - `fb_bola.json` — Gol Bunuh Diri (futsal own goal)
  - `fb_main.json` — Boneka dari Claw Machine (arcade)
  - `fb_snack.json` — Langit Malam dan Chiki (rooftop midnight snack)
  - `fb_curhat.json` — Tentang Ketakutan Kita (rooftop heart-to-heart)
- [x] **Narrative Trigger System:**
  - `triggerData.ts` — 8 triggers di 6 lokasi dengan koordinat % scene
  - `triggerManager.ts` — filter by location+chapter, one-time trigger consumption
  - `InteractionObject.tsx` — pulsing dot UI, hover label, accessible
- [x] **Evening Reflection Flow:**
  - `EveningReflection.tsx` — dialogue → expert system → auto-save → increment day
  - 6 evening scripts: prologue, denial, anger, bargaining, depression, acceptance
  - DebugPanel "Evening Reflection" quick-action button untuk testing

**Milestone:** ✅ Dialogue berjalan A→Z dengan branching. Klik objek di rooftop/lapangan/dll → flashback memory terpicu dengan overlay sepia.

---

## FASE 4 — Smartphone UI (Minggu 8) ✅ SELESAI

**Tujuan:** Virtual smartphone berfungsi penuh dengan semua apps.
**Commit:** `a19a845` — feat: Phase 4 & 5 — Smartphone UI and Mini-Game Systems

- [x] **Smartphone Frame (`components/smartphone/`):**
  - `SmartphoneFrame.tsx` — overlay UI berbentuk smartphone dengan slide-up animation
  - HomeScreen dengan 5 app icons + badge notifikasi
  - Toggle open/close via SceneManager; badge cleared saat app dibuka
- [x] **App: Map** (`MapApp.tsx`)
  - Daftar 14 lokasi; tersedia/unavailable per `availableLocations`
  - Klik lokasi → `setLocation(loc)` + close phone (teleportasi)
  - Lokasi greyed-out + disabled jika unavailable; "di sini" badge untuk current location
- [x] **App: Chat** (`ChatApp.tsx`)
  - Thread list → message view, pesan difilter per `currentDay`
  - Bubble styling: MC (kanan), Dia/NPC (kiri)
  - Data: 7 file JSON per chapter (`data/chats/`)
- [x] **App: Gallery** (`GalleryApp.tsx`)
  - Grid foto; foto terkunci tampil "???"; foto terbuka tampil warna aksen
  - Klik foto terbuka → tutup phone → putar flashback terkait
  - Data: `data/gallery.ts` (7 foto, `flashbackId` ke flashback system)
- [x] **App: Music** (`MusicApp.tsx`)
  - Playlist per chapter; play/pause toggle; volume slider
  - Howler.js via `musicPlayer.ts` (module-level); UI state via `musicStore` (Zustand)
  - Graceful error handling jika audio file belum ada
- [x] **App: Notes/Journal** (`NotesApp.tsx`)
  - Menampilkan catatan harian dari `data/notes/` (7 file JSON per chapter)
  - Filtered by `currentDay`; ditampilkan reverse-chronological
- [x] **Data layer:** `data/chats/`, `data/notes/`, `data/gallery.ts`, `data/playlists.ts`
- [x] **CSS:** Phase 4 smartphone styles di `global.css` (~200 lines)
- [x] **Tests:** 3 test files, 24 test cases (SmartphoneFrame, MapApp, GalleryApp)

**Milestone:** ✅ Smartphone terbuka, semua apps navigable, Map teleportasi, Gallery trigger flashback.

---

## FASE 5 — Mini-Game Systems (Minggu 9–11) ✅ SELESAI

**Tujuan:** Semua 11 tipe mekanik mini-game berfungsi dan dapat dikonfigurasi via data.
**Commit:** `a19a845` — feat: Phase 4 & 5 — Smartphone UI and Mini-Game Systems

### Semua 11 Mini-Games Implemented

- [x] **Slider Puzzle (`SliderPuzzle.tsx`)** — Grid maze, D-pad + keyboard arrow keys, findStart() scan untuk posisi awal
- [x] **Hidden Object (`HiddenObject.tsx`)** — Klik area tersembunyi; ripple feedback; timeout → fail
- [x] **Word Puzzle (`WordPuzzle.tsx`)** — Bank huruf; klik untuk susun kata target; backspace; time limit
- [x] **Quick Time Event (`QuickTimeEvent.tsx`)** — Spawn targets random; klik dalam waktu; score counter
- [x] **Hold to Delete (`HoldToDelete.tsx`)** — Tahan pointer; progress bar fill; elemen fade out saat selesai
- [x] **Drag & Drop Scheduler (`DragDropScheduler.tsx`)** — HTML5 drag API; assign tasks ke time slots; submit check
- [x] **Struggle Button (`StruggleButton.tsx`)** — Klik berulang; counter menuju target; time limit countdown
- [x] **Find the Difference (`FindTheDifference.tsx`)** — Dua panel; klik perbedaan; timeout → fail
- [x] **Room Decoration (`RoomDecoration.tsx`)** — Drag items ke slot posisi yang tepat; validasi item-to-slot
- [x] **Planting Game (`PlantingGame.tsx`)** — Sequential steps dalam urutan benar; wrong step → shake feedback
- [x] **Breathing Rhythm (`BreathingRhythm.tsx`)** — Inhale → Hold → Exhale cycles; animasi lingkaran scale
- [x] **MiniGameHost (`MiniGameHost.tsx`)** — Router by `MiniGameType`; `config: any` dengan eslint-disable; dispatch ke 11 komponen
- [x] **Type definitions (`types/minigame.ts`)** — `MiniGameProps<T>`, `MiniGameResult`, 11 config types, `MiniGameType` union
- [x] **CSS:** Phase 5 mini-game styles di `global.css` (~450 lines)
- [x] **DebugPanel integration:** Tombol launch tiap mini-game dari debug panel
- [x] **Tests:** 21 test cases covering 6 mini-games + MiniGameHost routing

### Lint & Type Check
- [x] `npm run lint` — 0 errors, 0 warnings (clean)
- [x] `npx tsc -b --noEmit` — 0 errors (strict TypeScript)
- [x] `npm test` — **181/181 tests passing**
- [x] `npm run build` — Build sukses, bundle: 27.45kB CSS, 124.59kB JS (main chunk)

**Milestone:** ✅ Semua 11 mini-game dapat dijalankan via DebugPanel. MiniGameHost routing benar. Build production clean.

---

## FASE 6 — Konten: Prologue (Minggu 12)

**Tujuan:** Prologue dapat dimainkan penuh end-to-end.

- [ ] **Script Dialogue Prologue** — 10 step cutscene + mini-gameplay
- [ ] **Scene: Taman** (background + objek interaktif)
- [ ] **Scene: Pasar Bunga** (background untuk Hidden Object)
- [ ] **Scene: Kamar** (background, meja belajar, kaktus, jendela)
- [ ] **Scene: Rooftop** (background + percakapan confession)
- [ ] **Implementasi Prologue Flow** (`PrologueScene.tsx`)
- [ ] **Inisialisasi Variabel:** `distress: 20, hope: 80, denial: 0, rumination: "reflection"`

**Milestone:** Main dari awal → Prologue selesai → Title screen muncul → Chapter 1 terbuka.

---

## FASE 7 — Konten: Denial + Anger (Minggu 13–15)

### Minggu 13 — Chapter 1: Denial
- [ ] Script dialogue harian (minimum 3 hari gameplay)
- [ ] Pool 6 misi Denial + mini-game integration
- [ ] Scene baru: Pusat Perbelanjaan, Lab
- [ ] Evening reflection + Expert System D-01→D-05 aktif
- [ ] Event Kanon Denial

### Minggu 14 — Chapter 2: Anger
- [ ] Script dialogue harian (minimum 3 hari)
- [ ] Pool 5 misi Anger + mini-game integration
- [ ] Scene baru: Rage Room
- [ ] Evening reflection + Expert System A-01→A-05 aktif
- [ ] Event Kanon Anger

### Minggu 15 — Transisi & Polish Chapter 1–2
- [ ] Chapter transition scene (cutscene + visual dissolve)
- [ ] Test full playthrough: Prologue → Denial → Anger
- [ ] Bug fix dari playthrough

**Milestone (Minggu 15):** Bisa main dari awal hingga akhir Chapter 2 (Anger) tanpa crash.

---

## FASE 8 — Konten: Bargaining + Depression (Minggu 16–18)

### Minggu 16 — Chapter 3: Bargaining
- [ ] Script dialogue + Pool 6 misi Bargaining
- [ ] Scene baru: Bioskop
- [ ] Expert System B-01, B-02 aktif
- [ ] Event Kanon Bargaining

### Minggu 17 — Chapter 4: Depression
- [ ] Script dialogue + Pool 5 misi Depression
- [ ] Scene baru: Kamar Mandi
- [ ] Expert System DEP-01, DEP-02 aktif
- [ ] Event Kanon Depression + Slow Motion Effect

### Minggu 18 — Transisi & Polish Chapter 3–4
- [ ] Test full playthrough: Prologue → Anger → Bargaining → Depression
- [ ] NPC Intervention mechanic test

**Milestone (Minggu 18):** Bisa main dari awal hingga akhir Chapter 4 (Depression).

---

## FASE 9 — Konten: Acceptance + Epilogue (Minggu 19–20)

### Minggu 19 — Chapter 5: Acceptance
- [ ] Script dialogue + Pool 6 misi Acceptance
- [ ] Expert System ACC-01 aktif
- [ ] Room Decoration + Planting mini-game integration

### Minggu 20 — Epilogue
- [ ] Script Epilogue: venue pameran, pertemuan, berdamai
- [ ] Scene baru: Venue Pameran
- [ ] Final cutscene + Ending screen statistik

**Milestone (Minggu 20):** Full playthrough Prologue sampai Epilogue dapat diselesaikan.

---

## FASE 10 — Audio & Visual Polish (Minggu 21–22)

### Minggu 21 — Audio
- [ ] BGM per chapter (7 track)
- [ ] Flashback theme
- [ ] Ambient per lokasi (5 ambient)
- [ ] SFX: smartphone, notif, klik, glitch, page turn
- [ ] Adaptive music layering + Audio Settings

### Minggu 22 — Visual Polish
- [ ] Character sprites (NPC + Dia) per chapter
- [ ] UI animations
- [ ] Particle effects (Epilogue)
- [ ] Glitch effects tuning
- [ ] Loading screen + Responsive UI

**Milestone (Minggu 22):** Game terasa "lengkap" secara audio-visual. Semua transisi smooth.

---

## FASE 11 — Expert System Refinement (Minggu 23)

- [ ] Playtest sistematis (3–5 orang, pola berbeda)
- [ ] Verifikasi semua rules ter-trigger dalam kondisi normal
- [ ] Threshold calibration berdasarkan data playtest
- [ ] NPC Intervention timing test
- [ ] Edge case testing

**Milestone:** Semua rules tervalidasi. Rata-rata durasi per chapter: 3–7 hari in-game. Tidak ada dead-end state.

---

## FASE 12 — Testing & QA (Minggu 24–25)

### Minggu 24 — Functional Testing
- [ ] Unit tests (Vitest): Expert System, Save/Load, Crypto
- [ ] Integration tests: full save flow, chapter transition
- [ ] Cross-browser testing (Chrome, Firefox, Edge, Safari)
- [ ] PWA testing: install, offline mode, service worker

### Minggu 25 — User Testing & Accessibility
- [ ] User testing (5–8 orang)
- [ ] Content Warning implementation
- [ ] Accessibility basics (text size, skip, auto-advance, pause)
- [ ] Bug fix berdasarkan severity

**Milestone (Minggu 25):** Zero critical bugs. Content warning terpasang. User test selesai.

---

## FASE 13 — PWA & Deployment (Minggu 26)

- [ ] Build configuration (code splitting, asset optimization)
- [ ] PWA manifest & service worker final
- [ ] Code obfuscation (Expert System + rule base)
- [ ] Security audit (SubtleCrypto HTTPS, CSP)
- [ ] Deploy ke Vercel/Netlify
- [ ] Launch checklist

**Milestone: LAUNCH — "Memories of You" v1.0 live dan dapat dimainkan.**

---

## Catatan Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| :--- | :--- | :--- |
| Konten terlalu berat secara emosional untuk playtester | Tinggi | Briefing sebelum sesi test; pastikan content warning ada; sediakan debrief session |
| IndexedDB data hilang saat browser clear | Sedang | Tambahkan peringatan di settings; pertimbangkan export save ke file JSON sebagai backup |
| Audio autoplay diblokir browser | Rendah | Howler.js menangani ini; pastikan ada "klik untuk mulai" sebelum audio pertama |
| Performa buruk di perangkat low-end | Sedang | Progressive loading; opsi "low quality mode" yang menonaktifkan efek berat |
| Expert System terlalu ketat → pemain tidak bisa maju | Tinggi | NPC Intervention mechanic + threshold calibration di Fase 11 |
| Scope creep (fitur tambahan) | Tinggi | Freeze scope setelah Fase 5. Fitur baru masuk backlog untuk v1.1 |

---

## Definisi "Done" per Deliverable

- **Scene:** Background muncul, objek interaktif berfungsi, adaptive theme diterapkan, audio ambient berjalan.
- **Chapter:** Semua misi pool dapat diakses, evening reflection berjalan, Expert System mengupdate state, event kanon terpicu, chapter transition terjadi ketika syarat terpenuhi.
- **Mini-game:** Menerima config JSON, menjalankan gameplay, mengembalikan result (success/fail) ke parent, mempengaruhi variabel emosional yang benar.
- **Expert System rule:** Rule ter-trigger jika dan hanya jika kondisinya terpenuhi (dibuktikan dengan unit test atau console simulation).

---

## Catatan Asset

**Yang tersedia (SVG vector, dibuat programatik):**
- 14 location backgrounds SVG (placeholder production-ready)
- 7 cactus state SVGs (placeholder production-ready)

**Yang dibutuhkan dari seniman/AI image generator:**
- Character sprite Dia (ekspresi per chapter)
- Character sprite NPC hangout + curhat
- Detailed background illustrations (pixel art / painted)
- UI decorative elements
- Particle effect sprites
