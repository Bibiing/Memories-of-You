# Development Plan - Memories of You (Web-Based)

**Platform:** React + Vite + TypeScript + PWA
**Target:** Produk final dapat dimainkan dari Prologue hingga Epilogue

---

## Ringkasan Fase

| Fase | Nama | Durasi | Output Utama |
| :--- | :--- | :--- | :--- |
| 0 | Setup & Arsitektur | Minggu 1 | Project scaffold, CI/CD, struktur folder |
| 1 | Core Systems | Minggu 2–3 | State management, save/load, Expert System engine |
| 2 | Rendering & Visual Engine | Minggu 4–5 | Scene renderer, adaptive theme, efek visual |
| 3 | Dialogue & Narrative Engine | Minggu 6–7 | Dialogue box, branching, flashback system |
| 4 | Smartphone UI | Minggu 8 | Semua apps (Map, Chat, Gallery, Music, Notes) |
| 5 | Mini-Game Systems | Minggu 9–11 | Semua mekanik gameplay (6 tipe mini-game) |
| 6 | Konten: Prologue | Minggu 12 | Prologue fully playable |
| 7 | Konten: Denial + Anger | Minggu 13–15 | Chapter 1 & 2 fully playable |
| 8 | Konten: Bargaining + Depression | Minggu 16–18 | Chapter 3 & 4 fully playable |
| 9 | Konten: Acceptance + Epilogue | Minggu 19–20 | Chapter 5 + Epilog fully playable |
| 10 | Audio & Visual Polish | Minggu 21–22 | Musik adaptif, SFX, visual efek final |
| 11 | Expert System Refinement | Minggu 23 | Balancing rule base, NPC intervention |
| 12 | Testing & QA | Minggu 24–25 | Bug fix, playtest, accessibility |
| 13 | PWA & Deployment | Minggu 26 | Build production, deploy, launch |

---

## FASE 0 — Setup & Arsitektur (Minggu 1)

**Tujuan:** Pondasi proyek siap; semua developer bisa langsung coding.

### Tasks
- [ ] Init project: `npm create vite@latest memories-of-you -- --template react-ts`
- [ ] Setup ESLint + Prettier dengan config TypeScript strict
- [ ] Setup path aliases (`@/components`, `@/systems`, dst.) di `vite.config.ts`
- [ ] Struktur folder lengkap sesuai TDD (src/assets, src/components, src/systems, src/scenes, src/stores, src/data)
- [ ] Install dependencies utama:
  - `zustand` (state management)
  - `dexie` (IndexedDB)
  - `pixi.js` + `@pixi/react` (rendering)
  - `howler` (audio)
  - `vite-plugin-pwa` (PWA)
- [ ] Setup Git repository + branching strategy (main/develop/feature branches)
- [ ] Setup CI sederhana (GitHub Actions): lint + type-check on push
- [ ] Buat `README.md` dengan instruksi setup lokal

**Milestone:** `npm run dev` jalan, struktur folder sesuai TDD, semua dependencies terinstall.

---

## FASE 1 — Core Systems (Minggu 2–3)

**Tujuan:** Semua sistem fundamental (state, save, expert system) dapat berjalan meski belum ada UI.

### Minggu 2 — State Management & Save System

- [ ] **Zustand Stores:**
  - `emotionalStore.ts` — variabel: `distress`, `hope`, `denial`, `rumination`, `avoidance_count`, `aggressive_choice_count`, `internalized_anger_count`, `consecutive_hard_denial`
  - `gameStateStore.ts` — variabel: `chapter`, `day`, `stage`, `playerName`, `currentMission`, `isGameOver`
  - `inventoryStore.ts` — variabel: `flashback_unlocked[]`, `action_history[]`, `inventory[]`
- [ ] **Dexie.js Schema:**
  - Definisi tabel `saves` dan `settings`
  - Implementasi CRUD: `createSave()`, `loadSave()`, `updateSave()`, `deleteSave()`
  - Support 5 save slot
- [ ] **Crypto Utils:**
  - `crypto.ts`: AES-GCM 256-bit encrypt/decrypt menggunakan `SubtleCrypto`
  - `hash.ts`: SHA-256 hash + verify menggunakan `SubtleCrypto`
- [ ] **Auto-Save Flow:**
  - Fungsi `autoSave()` yang encrypt → hash → simpan ke Dexie
  - Fungsi `loadAndVerify()` yang verify hash → decrypt → hydrate stores

**Milestone:** Console test — simpan state ke IndexedDB, load kembali, verifikasi hash. Data terbaca konsisten.

### Minggu 3 — Expert System Engine

- [ ] **Rule Base Data (`data/ruleBase.ts`):**
  - Struktur tiap rule: `{ id, chapter, condition: (state) => boolean, action: (state) => SystemOutput, priority: number }`
  - Implementasi semua rules dari ESDD (Denial D-01 s/d D-05, Anger A-01 s/d A-05, Bargaining B-01 s/d B-02, Depression Dep-01 s/d Dep-02, Acceptance)
- [ ] **Forward Chaining Engine (`systems/expertSystem/`):**
  - `evaluateNight(state)` — filter applicable rules, sort by priority, return highest-priority output
  - `applyOutput(output)` — update emotional stores sesuai hasil evaluasi
  - `checkChapterTransition(state)` — return true/false + nextChapter
  - `checkNPCIntervention(state)` — return true jika stuck > 7 hari
- [ ] **Question Bank (`data/questions/`):**
  - Format JSON per chapter, tiap pertanyaan memiliki: `id`, `text`, `options[]`, `weights[]`
  - Minimal 8 pertanyaan per chapter (total ≥ 48 pertanyaan)
- [ ] **Console test:** Simulasi 7 hari gameplay dengan input acak → verifikasi state berubah sesuai rules.

**Milestone:** Expert System dapat memproses input refleksi dan menghasilkan output yang benar berdasarkan rules — dibuktikan dengan unit test atau console simulation.

---

## FASE 2 — Rendering & Visual Engine (Minggu 4–5)

**Tujuan:** Sistem rendering scene dan adaptive visual berjalan.

### Minggu 4 — Scene System & Adaptive Theme

- [ ] **Scene Manager:**
  - `SceneManager.tsx` — router scene berdasarkan `gameStateStore.chapter`
  - Transisi antar scene: fade dissolve dengan `CSS opacity transition`
- [ ] **Background Renderer:**
  - Komponen `SceneBackground` yang menerima prop `location` dan `chapter`
  - Render background image per lokasi + overlay tint per chapter
- [ ] **Adaptive CSS Variables:**
  - Definisi `--color-primary`, `--color-bg`, `--color-accent`, `--filter-distress` di `:root`
  - Data mapping per chapter: `{ denial: { primary: 'hsl(...)', bg: '...' }, ... }`
  - Hook `useAdaptiveTheme(chapter, distress)` yang update CSS variables via JS
- [ ] **Color Interpolation (`utils/color.ts`):**
  - `interpolateHSL(from, to, t)` untuk smooth color transition saat distress berubah

### Minggu 5 — Visual Effects

- [ ] **PixiJS Integration:**
  - Setup `<PixiStage>` wrapper sebagai canvas layer di atas React UI
  - `GlitchEffect.tsx` — DisplacementFilter PixiJS, trigger via prop `intensity`
  - `RippleEffect.tsx` — ShockwaveFilter PixiJS, trigger on event kanon
- [ ] **CSS Effects:**
  - `BlurOverlay.tsx` — CSS filter blur, intensity linked ke `distress`
  - `GrayscaleFilter.tsx` — CSS filter grayscale, intensity linked ke `distress`
  - `SlowMotionWrapper.tsx` — CSS animation-duration scaling untuk post-crying
- [ ] **Cactus Renderer (`components/cactus/`):**
  - `CactusRenderer.tsx` — render sprite kaktus berdasarkan `chapter`
  - 7 state visual: sehat, mulai sakit, sakit parah, mati-berusaha, mati, pot kosong, bertunas
  - Animasi idle per state (gentle sway / wilting droop)

**Milestone:** Buka game → background muncul, warna berubah saat chapter diganti via debug panel, kaktus tampil sesuai chapter.

---

## FASE 3 — Dialogue & Narrative Engine (Minggu 6–7)

**Tujuan:** Sistem dialogue dan flashback dapat berjalan dengan data skrip apapun.

### Minggu 6 — Dialogue System

- [ ] **Dialogue Data Format (`data/dialogues/`):**
  - JSON schema: `{ id, speaker, text, next, choices?: [{ label, next, weights?: {...} }] }`
  - Support: linear dialogue, branching choice, timed choice (countdown), conditional next berdasarkan state
- [ ] **Dialogue Engine (`systems/dialogueEngine/`):**
  - `DialogueRunner` — state machine yang berjalan melalui nodes dialogue
  - Support speaker types: "MC", "Dia", "NPC_hangout", "NPC_curhat", "Cactus", "System"
  - Integrasi dengan `emotionalStore` — choice dapat mempengaruhi variabel
- [ ] **Dialogue UI Components:**
  - `DialogueBox.tsx` — text typewriter effect, speaker name, avatar
  - `ChoiceList.tsx` — daftar pilihan; support timed choice dengan progress bar countdown
  - `TimedChoiceList.tsx` — wrapper dengan countdown timer; timeout → trigger glitch visual

### Minggu 7 — Flashback System & Narrative Triggers

- [ ] **Flashback System (`systems/flashbackSystem/`):**
  - `FlashbackManager` — track `flashback_unlocked[]`, cek apakah trigger kondisi terpenuhi
  - `FlashbackPlayer.tsx` — render flashback sebagai overlay dengan visual filter (sepia/warm tone)
  - Smooth in/out transition (fade + audio cross-fade)
- [ ] **7 Flashback Scripts (data/flashbacks/):**
  - `fb_telponan.json`, `fb_makan.json`, `fb_ngeprank.json`, `fb_bola.json`, `fb_main.json`, `fb_snack.json`, `fb_curhat.json`
- [ ] **Narrative Trigger System:**
  - `TriggerManager` — map location + interaction → flashback atau event
  - `InteractionObject.tsx` — objek yang dapat diklik di scene; trigger dialogue/flashback/mission
- [ ] **Evening Reflection Flow:**
  - `EveningReflection.tsx` — urutan: masuk kamar → percakapan dengan kaktus → Expert System evaluate → auto-save → morning next day

**Milestone:** Dialogue berjalan dari A ke Z dengan branching. Klik objek di scene → flashback terpicu.

---

## FASE 4 — Smartphone UI (Minggu 8)

**Tujuan:** Virtual smartphone berfungsi penuh dengan semua apps.

- [ ] **Smartphone Frame (`components/smartphone/`):**
  - `SmartphoneFrame.tsx` — overlay UI berbentuk smartphone (CSS/SVG frame)
  - Toggle open/close dengan animasi slide-up
  - Notifikasi badge per app berdasarkan game state
- [ ] **App: Map**
  - `MapApp.tsx` — daftar lokasi tersedia per chapter (dari `gameStateStore.availableLocations`)
  - Klik lokasi → teleportasi (scene transition ke lokasi tersebut)
  - Lokasi greyed-out jika belum tersedia di chapter ini
- [ ] **App: Chat**
  - `ChatApp.tsx` — riwayat percakapan (read-only) dengan Dia & NPC
  - Tampilkan pesan sesuai chapter/hari (data dari `data/chats/`)
  - Integrasi gameplay: Word Puzzle (Denial), Hold-to-Delete (Anger) — aktif saat misi terkait
- [ ] **App: Gallery**
  - `GalleryApp.tsx` — grid foto memori; foto terkunci tampil blur
  - Klik foto yang terbuka → putar flashback terkait
- [ ] **App: Music**
  - `MusicApp.tsx` — playlist per chapter; toggle play/pause; track info
  - Howler.js integration
- [ ] **App: Notes/Journal**
  - `NotesApp.tsx` — tampilkan catatan harian yang ditulis MC (dari `data/notes/`)
  - Surat yang ditulis MC (Anger chapter, Epilogue) tersimpan di sini

**Milestone:** Smartphone terbuka, semua apps navigable, Map teleportasi ke scene benar.

---

## FASE 5 — Mini-Game Systems (Minggu 9–11)

**Tujuan:** Semua 6 tipe mekanik mini-game berfungsi dan dapat dikonfigurasi via data.

### Minggu 9 — Mini-Games Tipe 1–3

- [ ] **Slide Puzzle / Labirin (`SliderPuzzle.tsx`):**
  - Move the Block mechanic; grid konfigurabel (data-driven dari JSON)
  - Digunakan: Prologue (cari jalan ke pasar)

- [ ] **Hidden Object (`HiddenObject.tsx`):**
  - Klik objek tersembunyi dalam scene 2D; objek terdefinisi via JSON (posisi + trigger)
  - Support mode "greenflag" (Denial) dan "redflag" (Anger)
  - Feedback visual: glow saat hover, check saat ditemukan

- [ ] **Timed Dialogue Choice (`TimedChoiceList.tsx`):**
  - Extension dari `ChoiceList`; countdown progress bar; timeout → glitch + auto-pick negative option
  - Konfigurabel: duration timer per pertanyaan

### Minggu 10 — Mini-Games Tipe 4–5

- [ ] **Word Puzzle (`WordPuzzle.tsx`):**
  - Bank huruf acak → drag/klik untuk susun kata target
  - Validasi: kata terbentuk = misi berhasil
  - Digunakan: Denial (Mencari Alasan Chat Dia)

- [ ] **QTE / Rage Room (`QuickTimeEvent.tsx`):**
  - Tombol muncul secara random; tekan dalam waktu → objek hancur dengan animasi
  - Atau mode Point & Click agresif: klik objek → pecah animasi
  - Digunakan: Anger (Rage Room); variabel `aggressive_choice_count++`

- [ ] **Hold to Delete (`HoldToDelete.tsx`):**
  - Tahan tombol/click pada element; progress bar fill → element fade out + hapus
  - Response time diukur dan dicatat untuk Expert System
  - Digunakan: Anger (Hapus Chat Lama); Bargaining (Hapus Dia dari Ingatan)

### Minggu 11 — Mini-Games Tipe 6 + Misc

- [ ] **Drag & Drop Scheduler (`DragDropScheduler.tsx`):**
  - Kartu waktu disusun ke dalam kalender; validasi slot kosong untuk "bertemu Dia"
  - Digunakan: Denial (Menyusun Rencana)

- [ ] **Struggle Button (`StruggleButton.tsx`):**
  - Tombol yang "melawan" pemain; harus tekan berulang/puzzle cepat untuk "mengunci" niat
  - Gagal → regression event
  - Digunakan: Depression (Menahan Diri)

- [ ] **Find the Difference (`FindTheDifference.tsx`):**
  - Dua gambar berdampingan; klik area yang berbeda
  - Digunakan: Depression (Bercermin)

- [ ] **Room Decoration (`RoomDecoration.tsx`):**
  - Drag furnitur + pilih warna dinding; simpan layout ke state
  - Visual berubah dari palette gelap ke cerah
  - Digunakan: Acceptance (Menata Ulang Kamar)

- [ ] **Planting Minigame (`PlantingGame.tsx`):**
  - Klik pot → pilih bibit → siram → animasi tumbuh
  - Digunakan: Acceptance (Menanam Bibit Baru)

- [ ] **Breathing Rhythm (`BreathingRhythm.tsx`):**
  - Expanding/contracting circle; click in sync dengan ritme
  - Sukses → distress turun, visual blur; gagal → glitch
  - Digunakan: Depression (Menangis)

**Milestone:** Semua mini-game dapat dijalankan secara isolated (test page/dev route). Tiap mini-game menerima config JSON dan mengembalikan result ke parent.

---

## FASE 6 — Konten: Prologue (Minggu 12)

**Tujuan:** Prologue dapat dimainkan penuh end-to-end.

- [ ] **Script Dialogue Prologue** — 10 step cutscene + mini-gameplay (sesuai tabel GDD)
- [ ] **Scene: Taman** (background + objek interaktif)
- [ ] **Scene: Pasar Bunga** (background untuk Hidden Object cactus-finding)
- [ ] **Scene: Kamar** (background, meja belajar, kaktus, jendela)
- [ ] **Scene: Rooftop** (background + percakapan confession)
- [ ] **Implementasi Prologue Flow:**
  - `PrologueScene.tsx` — orchestrate 10 steps via `DialogueRunner`
  - Integrasi `SliderPuzzle` (step 2) dan `HiddenObject` cactus-finding (step 4)
  - Timelapse animation (step 7): CSS keyframe animasi siklus siang-malam
  - Title screen muncul di akhir (step 10)
- [ ] **Inisialisasi Variabel:** `distress: 20, hope: 80, denial: 0, rumination: "reflection"`

**Milestone:** Main dari awal → Prologue selesai → Title screen muncul → Chapter 1 (Denial) terbuka.

---

## FASE 7 — Konten: Denial + Anger (Minggu 13–15)

### Minggu 13 — Chapter 1: Denial

- [ ] **Script dialogue harian** (minimum 3 hari gameplay Denial)
- [ ] **Pool 6 misi Denial** — implementasi semua misi dengan mini-game yang sudah ada
- [ ] **Scene baru:** Pusat Perbelanjaan, Lab
- [ ] **Evening reflection script** — 7 pertanyaan Denial dengan bobot ESDD
- [ ] **Expert System integration** — rules D-01 s/d D-05 aktif dan ditest
- [ ] **Event Kanon Denial:** Scene "Dia menolak ajakan, tapi terlihat hangout dengan teman lain" → distress spike
- [ ] **NPC dialogue:** Teman Hangout + Teman Curhat versi Denial

### Minggu 14 — Chapter 2: Anger

- [ ] **Script dialogue harian** (minimum 3 hari gameplay Anger)
- [ ] **Pool 5 misi Anger** — implementasi semua misi
- [ ] **Scene baru:** Rage Room (visualisasi surealis, benda-benda yang bisa dihancurkan)
- [ ] **Evening reflection script** — 7 pertanyaan Anger dengan bobot ESDD
- [ ] **Expert System integration** — rules A-01 s/d A-05 aktif
- [ ] **Event Kanon Anger:** Surat dikirim → tunggu respons → tidak ada respons → putus kontak
- [ ] **Adaptive visual:** Switch ke palet merah-plum, musik intens

### Minggu 15 — Transisi & Polish Chapter 1–2

- [ ] **Chapter transition scene:** Event kanon sebagai cutscene + visual dissolve ke chapter baru
- [ ] **Test full playthrough:** Prologue → Denial → Anger (end-to-end)
- [ ] **Bug fix** yang ditemukan dari playthrough
- [ ] **Verifikasi Expert System:** Pastikan rules trigger dengan benar; tidak ada loophole yang membuat pemain tidak bisa maju

**Milestone (Minggu 15):** Bisa main dari awal hingga akhir Chapter 2 (Anger) tanpa crash.

---

## FASE 8 — Konten: Bargaining + Depression (Minggu 16–18)

### Minggu 16 — Chapter 3: Bargaining

- [ ] **Script dialogue harian** (minimum 3 hari Bargaining)
- [ ] **Pool 6 misi Bargaining** — implementasi semua misi
- [ ] **Scene baru:** Bioskop
- [ ] **Evening reflection script** — 7 pertanyaan Bargaining
- [ ] **Expert System integration** — rules B-01, B-02
- [ ] **Event Kanon Bargaining:** Dapat kabar Dia masih hangat dengan orang lain → kecemburuan spike
- [ ] **Osilasi visual:** Warna ungu indigo berubah intensitas dinamis (berdasarkan `hope` vs `distress`)

### Minggu 17 — Chapter 4: Depression

- [ ] **Script dialogue harian** (minimum 3 hari Depression)
- [ ] **Pool 5 misi Depression** — implementasi semua misi
- [ ] **Scene baru:** Kamar Mandi (cermin untuk Find the Difference)
- [ ] **Evening reflection script** — 7 pertanyaan Depression
- [ ] **Expert System integration** — rules Dep-01, Dep-02
- [ ] **Event Kanon Depression:** MC menghubungi Dia → dibalas dingin → proyeksi redflag → siap lepas
- [ ] **Slow Motion Effect:** `BreathingRhythm` sukses → seluruh scene bergerak `0.7x` speed sementara

### Minggu 18 — Transisi & Polish Chapter 3–4

- [ ] **Test full playthrough:** Prologue → Anger → Bargaining → Depression
- [ ] **NPC Intervention mechanic:** Jika stuck > 7 hari di chapter manapun → NPC dialogue intervensi muncul
- [ ] **Bug fix & balance:** Pastikan tidak ada dead-end state

**Milestone (Minggu 18):** Bisa main dari awal hingga akhir Chapter 4 (Depression).

---

## FASE 9 — Konten: Acceptance + Epilogue (Minggu 19–20)

### Minggu 19 — Chapter 5: Acceptance

- [ ] **Script dialogue harian** (minimum 3 hari Acceptance)
- [ ] **Pool 6 misi Acceptance** — implementasi semua misi (termasuk Room Decoration + Planting)
- [ ] **Evening reflection script** — 7 pertanyaan Acceptance
- [ ] **Expert System integration** — True Acceptance criteria check
- [ ] **Room Decoration:** Visual kamar berubah dari ungu gelap → pastel cerah (tersimpan di state)
- [ ] **Visual:** Warna mulai warm up; Dia mulai "terasa jahat" (representasi distorsi masih ada)

### Minggu 20 — Epilogue

- [ ] **Script Epilogue:** Scene venue pameran, pertemuan tidak sengaja, percakapan singkat, berdamai
- [ ] **Scene baru:** Venue Pameran
- [ ] **Misi: Menulis Surat Pelepasan** — pilihan frasa + simpan ke Notes app
- [ ] **Final cutscene:** Kaktus bertunas kembali; warna spektrum penuh; musik bittersweet
- [ ] **Ending screen:** Tampilkan statistik perjalanan (hari total, chapter terlama, flashback terbuka)
- [ ] **Kembali ke Main Menu** dengan state "game completed"

**Milestone (Minggu 20):** Full playthrough dari Prologue sampai Epilogue dapat diselesaikan.

---

## FASE 10 — Audio & Visual Polish (Minggu 21–22)

### Minggu 21 — Audio Implementation

- [ ] **BGM per chapter:** 7 track (Prologue, Denial, Anger, Bargaining, Depression, Acceptance, Epilogue)
- [ ] **Flashback theme:** 1 track warm/nostalgic untuk semua flashback
- [ ] **Ambient per lokasi:** Minimal 5 ambient (kamar, kampus, taman, kota, indoor)
- [ ] **SFX:** Smartphone open/close, notif, klik, glitch sound, page turn, writing sound
- [ ] **Adaptive music layering:** Howler `fade()` antar chapter; volume ambient menyesuaikan `distress`
- [ ] **Audio Settings:** Volume slider (BGM, SFX, Ambient) di Pause Menu Options

### Minggu 22 — Visual Polish

- [ ] **Character sprites:** Semua NPC + Dia (standing sprite) per chapter jika belum ada
- [ ] **UI animation:** Tombol hover states, dialogue box appear/disappear, smartphone open/close
- [ ] **Particle effects:** Kaktus bertunas (Epilogue) — partikel cahaya kecil
- [ ] **Glitch effects tuning:** Intensitas dan frekuensi glitch ditest dan disesuaikan agar tidak terlalu mengganggu
- [ ] **Loading screen:** Screen loading saat pertama buka app + saat pindah chapter besar
- [ ] **Responsive UI:** Pastikan layout aman di viewport 1280×720 s/d 1920×1080

**Milestone (Minggu 22):** Game terasa "lengkap" secara audio-visual. Semua transisi smooth.

---

## FASE 11 — Expert System Refinement (Minggu 23)

**Tujuan:** Balancing rule base agar tidak ada chapter yang terlalu mudah atau terlalu sulit untuk diselesaikan.

- [ ] **Playtest sistematis:** 3–5 orang playtester dengan pola pilihan berbeda (always-avoidant, always-expressive, random)
- [ ] **Verifikasi semua rules:** Pastikan setiap rule dari ESDD dapat ter-trigger dalam kondisi normal gameplay
- [ ] **Threshold calibration:** Sesuaikan threshold variabel berdasarkan data playtest (misal: jika rata-rata stuck > 10 hari di Bargaining, turunkan threshold B-01)
- [ ] **NPC Intervention timing:** Test kapan NPC muncul; pastikan tidak terlalu cepat (mengganggu) atau terlalu lambat (membuat frustrasi)
- [ ] **Emotional Performance detection:** Kalibrasi `response_time` threshold untuk `mass_delete` (2s dan 8s)
- [ ] **Edge case testing:** Apa yang terjadi jika pemain selalu memilih jawaban ekstrem? Pastikan game tidak crash atau stuck.

**Milestone:** Semua rules tervalidasi. Rata-rata durasi per chapter: 3–7 hari in-game. Tidak ada dead-end state.

---

## FASE 12 — Testing & QA (Minggu 24–25)

### Minggu 24 — Functional Testing

- [ ] **Unit tests (Vitest):**
  - Expert System rules — tiap rule ditest dengan state yang memenuhi dan tidak memenuhi kondisi
  - Save/Load cycle — simpan → load → data identik
  - Crypto — encrypt → decrypt → hasil sama; hash mismatch → reject
- [ ] **Integration tests:**
  - Full save flow (Dexie + AES + SHA-256)
  - Chapter transition flow (Expert System → state update → scene change)
- [ ] **Cross-browser testing:**
  - Chrome 90+, Firefox 88+, Edge 90+
  - Safari (note: IndexedDB quota terbatas)
- [ ] **PWA testing:** Install PWA, offline mode, service worker cache

### Minggu 25 — User Testing & Accessibility

- [ ] **User testing (5–8 orang target audiens):**
  - Rekam sesi play (screen recording)
  - Kumpulkan feedback: moment kebingungan, konten yang terlalu berat, pacing
- [ ] **Content Warning implementation:**
  - Layar peringatan di awal game: konten menyangkut tema kehilangan, duka, dan emosi berat
  - Opsi: "Lanjutkan" atau "Keluar dengan aman"
  - Tombol "Safe Exit" di Pause Menu yang langsung ke layar netral
- [ ] **Accessibility basics:**
  - Text size option (normal / large)
  - Tombol skip cutscene
  - Auto-advance dialogue option
  - Pause kapan saja (kecuali cutscene terkunci)
- [ ] **Bug fix:** Prioritas berdasarkan severity (crash > major bug > minor visual)

**Milestone (Minggu 25):** Zero critical bugs. Content warning terpasang. User test selesai.

---

## FASE 13 — PWA & Deployment (Minggu 26)

- [ ] **Build configuration:**
  - `vite.config.ts`: code splitting per chapter via `React.lazy`
  - Asset optimization: audio ke `.ogg`, image ke `.webp`
  - Bundle size check: target < 2 MB gzipped initial load
- [ ] **PWA manifest & service worker:**
  - `manifest.json`: name, icons, theme_color, display standalone
  - Workbox config: cache-first untuk static assets
  - Offline fallback page
- [ ] **Code obfuscation:**
  - `vite-plugin-obfuscator` pada `systems/expertSystem/` dan `data/ruleBase.ts`
- [ ] **Security audit:**
  - Pastikan `SubtleCrypto` hanya berjalan di HTTPS
  - Verifikasi tidak ada data yang dikirim ke server eksternal
  - Cek CSP (Content Security Policy) header
- [ ] **Deployment:**
  - Deploy ke **Vercel** atau **Netlify** (recommended: Vercel untuk React)
  - Setup custom domain jika diperlukan
  - Test di URL production: PWA install, offline mode, auto-save
- [ ] **Launch checklist:**
  - [ ] Content warning tampil di awal
  - [ ] Save system berfungsi di production
  - [ ] Audio berjalan (AudioContext unlock on first interaction)
  - [ ] PWA dapat diinstall
  - [ ] Semua chapter dapat diselesaikan end-to-end

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
