# Game Design Document (GDD) - Memories of You

## 1. Deskripsi Umum

**Memories of You** adalah sebuah _therapeutic narrative-driven game_ yang dirancang sebagai ruang aman bagi pemain untuk menavigasi labirin emosi di tengah masa kedukaan. Melalui pendekatan narasi simbolik dan interaksi reflektif, game ini membawa pemain melintasi lima tahapan berduka (_5 Stages of Grief_) bukan sekadar sebagai teori, melainkan sebagai perjalanan personal untuk menemukan kembali kepingan diri yang hilang.

Game ini menitikberatkan pada eksplorasi subjektivitas persepsi; bahwa narasi hidup kita sering kali terdistorsi oleh duka, dan melalui proses penerimaan, pemain diajak untuk membedakan antara "rasa sakit yang dirasakan" dengan "realitas yang sebenarnya".

### Tujuan Game

Menciptakan pengalaman interaktif yang memfasilitasi katarsis emosional dan rekonstruksi makna, dengan tujuan:

1. Memberikan ruang bagi pemain untuk mengenali dan memvalidasi setiap tahap duka tanpa penghakiman.
2. Membantu pemain menyadari bagaimana kondisi emosional dapat mendistorsi cara mereka memandang masa lalu dan kenyataan objektif.
3. Mengembangkan ketenangan batin (_mindfulness_) dan kemampuan regulasi diri melalui mekanik game yang bersifat reflektif.
4. Mendorong pemain untuk membangun narasi baru yang lebih sehat terhadap peristiwa kehilangan yang mereka alami.
5. Menjadi instrumen _self-healing_ non-klinis yang menjembatani antara pengalaman emosional personal dengan pemahaman psikologis yang mendalam.

---

## 2. Informasi Proyek

| Atribut              | Detail                                                                                                                      |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **Genre**            | Narrative Adventure, Therapeutic, Social Simulation                                                                         |
| **Platform**         | Web-based (PWA), PC-First                                                                                                   |
| **Engine/Framework** | React + Vite (Web, bukan Unity)                                                                                             |
| **Target Audiens**   | Dewasa awal (18–30 tahun)                                                                                                   |
| **USP**              | Expert System berbasis psikologi klinis (CBT) yang menyesuaikan dunia game dengan kondisi emosional pemain secara real-time |

> **Catatan Penting:** Game ini berbasis **Web (PWA)** menggunakan React + Vite. PDF referensi menyebut Unity/PC, namun keputusan final adalah web-based untuk aksesibilitas yang lebih luas.

---

## 3. Mekanik Gameplay

### 3.1 Core Loop Harian

```
Mulai Hari
    ↓
Rawat Kaktus (Siram/Amati)
    ↓
Eksplorasi Lokasi + Misi Harian (via Smartphone)
    ↓
Refleksi Malam (Percakapan dengan Kaktus → Input Expert System)
    ↓
Expert System Evaluasi
    ↓
Simpan + Tentukan Status Hari Berikutnya
    ↓
[Siap pindah tahap? → Event Kanon → Transisi Chapter]
```

### 3.2 Key Features

#### Virtual Smartphone

Alat utama navigasi. Tokoh Utama memiliki smartphone yang dapat **teleportasi ke lokasi** manapun di peta (tidak ada perjalanan kaki eksplisit). Apps yang tersedia:

- **Map** — Pilih & teleportasi ke lokasi. Lokasi yang tersedia berubah per chapter.
- **Chat** — Riwayat percakapan dengan Dia & NPC. Digunakan sebagai gameplay (Word Puzzle, Hold-to-Delete).
- **Gallery** — Koleksi foto kenangan yang terbuka bertahap. Memicu flashback jika diklik.
- **Music** — Putar musik adaptif yang berubah per stage.
- **Notes/Journal** — Catatan harian & surat yang ditulis Tokoh Utama.

#### Perawatan Kaktus

- Di awal setiap hari, pemain dapat **menyiram dan merawat kaktus**.
- Pemain **tidak dapat menentukan nasib kaktus secara langsung** — kondisi kaktus adalah cerminan state emosional dari Expert System, bukan hasil aksi pemain.
- Kaktus berfungsi sebagai **umpan balik visual** kondisi internal Tokoh Utama.

#### Refleksi Malam (Input Expert System)

- Di akhir hari, **percakapan dengan kaktus** (bukan sekadar journaling) menjadi input utama sistem pakar.
- Pemain memilih jawaban dari pilihan yang disediakan.
- Jawaban mempengaruhi variabel: `distress`, `hope`, `denial`, `rumination`.

#### Misi Harian

- Muncul secara **acak** dari pool misi yang tersedia untuk chapter tersebut.
- Setiap misi berbeda mekaniknya (lihat Bagian 5).
- Misi tidak dapat dikerjakan ulang kecuali semua misi dalam pool telah diselesaikan.

#### Adaptive Environment

- Visual, warna, dan musik berubah otomatis berdasarkan chapter/tahap duka aktif.
- Detail artstyle per chapter → lihat Bagian 6.

---

## 4. Karakter

### 4.1 Tokoh Utama ("Aku" / MC)

- Protagonis, avatar pemain. Namanya sesuai input pemain di awal game.
- Arc: Dari ketergantungan emosional menuju kemandirian dan penerimaan.
- Merepresentasikan perspektif pemain dan mengalami perkembangan di sepanjang cerita.

### 4.2 Katalis ("Dia")

- Sosok penting yang hilang/menjauh dari kehidupan Tokoh Utama.
- Hanya muncul secara **langsung** di Prolog dan Epilog.
- Hadir melalui flashback, proyeksi emosional, dan percakapan chat di chapter lainnya.

### 4.3 Simbol ("Kaktus")

- Manifestasi visual hubungan dan kondisi mental Tokoh Utama.
- Peliharaan milik Tokoh Utama yang didapat bersama Dia.
- Status kaktus berubah per chapter (lihat Bagian 7).

### 4.4 NPC

| NPC                      | Gender        | Kepribadian       | Fungsi Naratif                                                                                     |
| :----------------------- | :------------ | :---------------- | :------------------------------------------------------------------------------------------------- |
| **Teman Hangout**        | Cowok         | Lucu, asik, ceria | Pengalih perhatian; teman dekat MC                                                                 |
| **Teman Curhat**         | Cewek         | Kalem, bijaksana  | Pemberi perspektif logis; teman dekat MC                                                           |
| **Teman yang Mirip Dia** | Cowok         | Misterius         | MC tidak kenal, tapi setiap melihatnya MC teringat dan ter-trigger soal Dia karena kemiripan fisik |
| **Temannya Dia**         | Cowok         | Netral            | MC tidak kenal tapi tahu dia berteman dengan Dia; trigger asosiasi dengan Dia                      |
| **Teman Satu Proyek**    | Cewek & Cowok | Kolaboratif       | Kerja bersama MC dalam proyek kampus; konteks akademis                                             |

---

## 5. Misi Harian per Chapter

### PROLOGUE — "Membeli Kaktus Bersama Dia"

| No  | Tipe                     | Deskripsi                                                                                                             |
| :-- | :----------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| 1   | Cutscene                 | MC dan Dia janjian bertemu di taman.                                                                                  |
| 2   | Gameplay                 | Dia menggunakan HP untuk mencari jalan (Move the Block: Slide Puzzle + labirin jalan keluar) berbentuk peta kota.     |
| 3   | Cutscene                 | MC dan Dia berangkat ke pasar.                                                                                        |
| 4   | Gameplay                 | Di pasar, cari 10 kaktus (GeoGuesser-style + observation duty; geser panah, rotasi kamera, klik LMB untuk menemukan). |
| 5   | Cutscene                 | Dia membantu MC memilih 1 kaktus terbaik. MC refleks memilih yang sama dengan pilihan Dia.                            |
| 6   | Cutscene + Mini Gameplay | MC menaruh kaktus di meja belajar dan merawatnya (gameplay tipis: ambil & tuang air).                                 |
| 7   | Cutscene                 | Timelapse x hari, fokus kaktus + jendela, matahari naik-turun + awan bergerak.                                        |
| 8   | Cutscene                 | Camera panning ke meja belajar; chat MC–Dia muncul (janjian di rooftop).                                              |
| 9   | Cutscene + Mini Gameplay | Transisi rooftop; percakapan MC dan Dia (gameplay tipis: jalan kaki ke rooftop).                                      |
| 10  | Cutscene                 | Setelah obrolan, muncul title screen.                                                                                 |

---

### DENIAL — Misi Harian (Acak dari Pool)

| Misi                                        | Mekanik                            | Deskripsi Singkat                                                                                                                                                          |
| :------------------------------------------ | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Menyusun Rencana Bertemu Dia**            | Drag & Drop Scheduling             | Susun jadwal harian yang padat untuk menyelipkan waktu luang bertemu Dia. Memicu narasi harapan palsu.                                                                     |
| **Mencari Tanda-tanda Greenflag Dia**       | Hidden Object                      | Klik benda peninggalan Dia di lokasi kenangan untuk mencari "pembenaran subjektif" kebaikan Dia. Menonaktifkan Denial State sementara, Distress naik tersembunyi.          |
| **Membicarakan yang Baik-baik tentang Dia** | Timed Dialogue Choice              | Saat interaksi dengan NPC teman hangout, pilih opsi dialog paling positif tentang Dia dalam waktu singkat. Terlambat memilih → visual glitch (representasi konflik batin). |
| **Mencari-cari Alasan untuk Chat Dia**      | Word Puzzle                        | Rangkai kata dari huruf acak untuk membentuk alasan chat yang terlihat "logis dan tidak agresif". Berhasil → False Hope (Hope naik, tapi semu).                            |
| **Menenggelamkan Diri dalam Proyek**        | Mini Game Mengetik / Coding Puzzle | Interaksi dengan laptop di Lab untuk "menenggelamkan diri". Progress bar proyek. Avoidance mechanic yang menunda dialog reflektif.                                         |
| **Membeli Hadiah untuk Dia**                | Point & Click                      | Di pusat perbelanjaan, bandingkan atribut benda (harga vs nilai emosional). Hadiah dipilih masuk inventori dan dapat memicu flashback.                                     |

---

### ANGER — Misi Harian (Acak dari Pool)

| Misi                                        | Mekanik                     | Deskripsi Singkat                                                                                                                                             |
| :------------------------------------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Menulis Surat Kekecewaan kepada Dia**     | Pilihan Frasa Emosional     | Di Kamar, pilih frasa berbobot emosional tinggi untuk menyusun surat ekspresi perasaan. Surat ini adalah instrumen pemutus hubungan jika Dia tidak merespons. |
| **Mencari Tanda-tanda Redflag Dia**         | Hidden Object               | Klik benda di lokasi memori untuk mencari "bukti perilaku negatif Dia" (persepsi subjektif). Menurunkan Denial State secara drastis.                          |
| **Main di Rage Room**                       | Point & Click Agresif / QTE | Di visualisasi surealis "rage room", pecahkan benda yang merepresentasikan memori tertentu. Menurunkan Distress sementara melalui mekanisme Venting.          |
| **Menghapus Chat-Chat Lama dari Dia**       | Hold to Delete              | Di smartphone, tahan tombol pada gelembung chat tertentu yang menyakitkan. Efek visual teks memudar perlahan = upaya memutus kontak total.                    |
| **Menggosipkan Keburukan Dia kepada Teman** | Pilihan Dialog              | Ceritakan sisi negatif Dia kepada NPC teman curhat atau hangout untuk mendapat validasi sosial. Jika NPC setuju → Hope terkunci sementara (Brooding intens).  |

---

### BARGAINING — Misi Harian (Acak dari Pool)

| Misi                           | Mekanik                          | Deskripsi Singkat                                                                                                                                                      |
| :----------------------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Belanja Self-Reward**        | Hidden Object                    | Di pusat perbelanjaan, cari benda diinginkan MC di etalase toko sebagai self-reward mengisi kehampaan. Hope naik sementara jika tidak dibarengi rencana konkret.       |
| **Main Boardgame**             | Logic Puzzle Minigame            | Puzzle logika kompetitif melawan NPC teman hangout. Mengalihkan pikiran dari Dia melalui tantangan kognitif.                                                           |
| **Makan-makan Bersama Teman**  | Dialogue Choice + Menu Selection | Pilih menu & dialog santai di taman/pusat perbelanjaan. Jika terlalu banyak bertanya tentang Dia kepada teman → Distress naik.                                         |
| **Nonton di Bioskop**          | Point & Click                    | Pilih genre film: film sentimental → memicu flashback; film komedi → menstabilkan distress. Mempengaruhi Rumination Mode.                                              |
| **Menghapus Dia dari Ingatan** | Archiving / Mass Delete          | Di smartphone, hapus semua jejak digital Dia. Sistem mendeteksi apakah pemain benar-benar siap atau sekadar Emotional Performance (berdasarkan waktu respons pilihan). |
| **Puzzle Manajemen Proyek**    | Block Sorting Puzzle             | Susun blok tugas kuliah/lab dalam urutan benar tanpa tekanan waktu berlebihan. Mendukung variabel Pathways (fokus pada perencanaan masa depan).                        |

---

### DEPRESSION — Misi Harian (Acak dari Pool)

| Misi                                            | Mekanik                       | Deskripsi Singkat                                                                                                                                                            |
| :---------------------------------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Menangis**                                    | Ritme Napas (Point & Click)   | Ikuti ritme napas tidak teratur via indikator visual. Berhasil → visual blur + audio redam (pelepasan emosi). Distress turun, tapi karakter bergerak Slow Movement.          |
| **Detach dari Lingkungan**                      | Avoidance Zone                | Di lokasi publik (Kampus/Taman), interaksi NPC dibatasi. Jauhkan karakter dari kerumunan ke "zona nyaman". Terlalu lama dekat kerumunan → visual glitch (kecemasan sosial).  |
| **Bercermin untuk Mengamati Perubahan Tatapan** | Find the Difference           | Temukan detail kecil yang berubah di wajah/tatapan mata MC dibanding foto profil lama. Merepresentasikan krisis identitas.                                                   |
| **Menahan Diri untuk Tidak Menghubungi Dia**    | Struggle Button + Mini Puzzle | Notifikasi impulsif untuk buka profil Dia. Tekan tombol berulang atau selesaikan mini puzzle cepat untuk "mengunci" niat menghubungi. Gagal → osilasi kembali ke Bargaining. |
| **Mengarsipkan Semua Kenangan tentang Dia**     | Drag & Drop                   | Kumpulkan semua benda peninggalan Dia (dari Denial + Anger) ke kotak penyimpanan. Setiap benda memicu narasi singkat perpisahan. Mempersiapkan transisi ke Acceptance.       |

---

### ACCEPTANCE — Misi Harian (Acak dari Pool)

| Misi                                   | Mekanik                        | Deskripsi Singkat                                                                                                                                                   |
| :------------------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Menyusun Rencana Masa Depan**        | Dialogue Choice (Vision Board) | Di Kamar, pilih rencana jangka panjang konkret (target karier/akademis). Berdasarkan teori Pathways → menaikkan Hope secara signifikan.                             |
| **Ikut Lomba**                         | Skill-based Mini Game          | Di Kampus/Lab, selesaikan proyek perlombaan. Keberhasilan → poin Hope terbesar karena merepresentasikan kembalinya Agency tanpa ketergantungan pada Dia.            |
| **Berkenalan dengan Orang-Orang Baru** | Dialogue + NPC Interaction     | Di Taman/Jalanan Kota, perkenalan dengan NPC baru. Pilih opsi dialog yang tidak membandingkan orang baru dengan Dia → menandakan hilangnya filter emosional dingin. |
| **Belajar Skill Baru**                 | Minigame Memori / Ritme        | Pilih hobi/skill baru melalui interaksi objek tertentu. Mempercepat transisi menuju Growth Ending.                                                                  |
| **Menata Ulang Kamar**                 | Room Decoration (Sims-like)    | Geser furnitur, ganti warna dinding, tata ulang kamar. Visual berubah dari ungu indigo dingin menjadi gradasi pastel cerah dan hangat.                              |
| **Menanam Bibit Baru di Pot Lain**     | Planting Minigame              | Interaksi dengan pot baru (terpisah dari pot kaktus lama). Tanam bibit tanaman berbeda = metafora awal kehidupan baru. Keberhasilan memicu Epilogue.                |

---

### EPILOGUE

| Misi                                        | Mekanik                   | Deskripsi                                                                                                                                                      |
| :------------------------------------------ | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Menulis Surat Pelepasan (Tanpa Dikirim)** | Free-form / Pilihan Frasa | Tulis surat pengakuan bahwa "Dia" pernah menjadi bagian penting hidup MC, tapi sudah saatnya melangkah masing-masing. Surat tidak dikirim — disimpan di Notes. |

---

## 6. Worldbuilding

### Setting

Dunia nyata dengan latar tempat di **kampus Institut Teknologi Sepuluh Nopember (ITS) Surabaya** dan **Kota Surabaya**.

### Daftar Lokasi

| Lokasi               | Keterangan                                                                                                  |
| :------------------- | :---------------------------------------------------------------------------------------------------------- |
| Kamar Tokoh Utama    | Hub utama. Tempat kaktus, meja belajar, laptop. Refleksi malam terjadi di sini.                             |
| Rooftop              | Lokasi Event Kanon Prolog (confession).                                                                     |
| Kelas                | Akademis. Misi proyek/tugas.                                                                                |
| Lab                  | Misi skripsi/proyek. Flashback "Snack sebagai Penyemangat" dan "Curhat dan Sambat Kehidupan" (koridor lab). |
| Taman                | Misi hangout. Flashback "Ngobrol Sambil Makan".                                                             |
| Pusat Perbelanjaan   | Misi self-reward, belanja, makan bersama teman.                                                             |
| Jalanan Kota         | Eksplorasi, berkenalan orang baru (Acceptance).                                                             |
| Venue Pameran        | Event Kanon Epilog (reunion).                                                                               |
| Lapangan             | Flashback "Ajakan Bermain Bola".                                                                            |
| Restoran             | Flashback "Ngeprank".                                                                                       |
| Tempat Main (Arcade) | Flashback "Main Bareng Boardgame".                                                                          |
| Bioskop              | Misi Bargaining "Nonton di Bioskop".                                                                        |
| Kamar Mandi          | Misi Depression "Bercermin" (Find the Difference).                                                          |

---

## 7. Artstyle & Visual per Chapter

| Chapter        | Palet Warna                                                             | Presentasi "Dia"                            | Musik                         |
| :------------- | :---------------------------------------------------------------------- | :------------------------------------------ | :---------------------------- |
| **Prolog**     | Ungu lavender + emas golden hour                                        | Hangat dan tulus                            | Lembut, sentimental           |
| **Denial**     | Ungu violet ke arah magenta (memanas)                                   | Ramah, tapi terasa palsu dan dibuat-buat    | Dreamy tapi sedikit janggal   |
| **Anger**      | Merah membara + aksen ungu plum tua (area gelap)                        | Ramah, tapi terasa menyebalkan              | Tegang, intens, dramatis      |
| **Bargaining** | Ungu indigo berubah-ubah intensitas (kadang kemerahan, kadang kebiruan) | Dingin dan jauh                             | Reflektif, mengalir           |
| **Depression** | Biru tua (midnight blue) hampir hitam, monokrom                         | Dingin dan jahat                            | Melankolis, kelam             |
| **Acceptance** | Gradasi biru muda ke ungu lembut                                        | Jahat dan membuat tidak nyaman              | Lembut, tenang                |
| **Epilog**     | Spektrum warna penuh, dominasi ungu violet                              | Biasa saja; hangatnya tidak sehangat Prolog | Damai, nostalgia, bittersweet |

**Visual Metaphors:**

- Objek melayang, warna memudar, glitch visual = distorsi persepsi akibat duka.
- `distress_meter` tinggi → CSS filter grayscale + blur intensitas naik.
- Transisi chapter → shader fade/dissolve antar palet warna.

---

## 8. Status Kaktus per Chapter

| Chapter    | Status Kaktus                         |
| :--------- | :------------------------------------ |
| Prolog     | Hidup, sehat, dan segar               |
| Denial     | Mulai sakit                           |
| Anger      | Sakit parah                           |
| Bargaining | Mati, tetapi berusaha ditanam kembali |
| Depression | Mati                                  |
| Acceptance | Pot kosong, hanya berisi tanah        |
| Epilog     | Bertunas kembali                      |

---

## 9. Main Menu & UI Screens

- **Main Menu** — Background dan suasana berubah sesuai tahap buka pemain. Tombol: New Game, Load, Quit.
- **Pause Menu** — Resume, Options, Main Menu, Quit Game.
- **Load System** — Tampilkan daftar save slot (maks. 5) dengan info: nama MC, tahap, tanggal simpan.
- **Name Input** — Dialog modal saat New Game untuk input nama Tokoh Utama.

---

## 10. Batasan (Limitations)

1. **Auto-Save Harian** — Progres hanya disimpan sekali per hari di akhir sesi. Tidak ada manual save.
2. **Offline-Only** — Semua data tersimpan lokal; tidak ada sinkronisasi cloud; multiplayer tidak didukung.
3. **Expert System Dependency** — Transisi chapter tergantung penuh pada status variabel emosional. Chapter selanjutnya tidak terbuka sampai pemain siap menurut sistem.
4. **Misi Harian** — Misi muncul acak tapi terikat chapter; tidak dapat dikerjakan ulang sampai semua misi pool habis.
5. **Interaksi NPC & Objek** — Dibatasi pada aksi yang sudah ditentukan per chapter. Pemain tidak bisa mengubah nasib kaktus secara langsung.
6. **Narrative Scope** — Narasi linear. Tidak ada branching ending alternatif di luar yang sudah dirancang Expert System.
7. **Performa Web** — Efek visual surealis (glitch, floating, dissolve) dapat menurunkan performa di perangkat rendah; perlu optimasi progressive loading.
