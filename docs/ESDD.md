# Expert System Design Document (ESDD) - Memories of You

## 1. Deskripsi & Fungsi

Sistem Pakar dalam game ini berfungsi sebagai "psikolog digital" yang menganalisis input pemain setiap malam untuk:

1. **Mendeteksi** pemain berada di tahap berduka yang mana.
2. **Menentukan** apakah pemain sudah siap untuk pindah ke tahap selanjutnya.
3. **Memicu** event kanon di setiap transisi stage.
4. **Menambahkan** NPC sebagai teman untuk memberi dorongan kepada pemain agar tidak terjebak dalam satu tahap terus-menerus.
5. **Merespons** dengan narasi adaptif berdasarkan CBT (Cognitive Behavioral Therapy).

---

## 2. Landasan Teori

### 2.1 Variabel Emosional

#### Distress Meter
**Referensi:** Stroebe, M., & Schut, H. (2021). *Bereavement in Times of COVID-19: A Review and Theoretical Framework.*

Berdasarkan Dual Process Model (DPM), duka yang sehat adalah proses osilasi (ayunan) antara kesedihan dan pemulihan. Sistem menggunakan Distress Meter untuk memantau apakah pemain macet di satu kutub (sedih terus-menerus tanpa jeda). Jika Distress konsisten tinggi tanpa penurunan, sistem mendeteksinya sebagai risiko tidak normal yang menghambat adaptasi.

**Range:** 0–100. Threshold kritis: > 85.

#### Hope Meter
**Referensi:** Pathak, S., & Prusty, B. (2025). *Correlation Between Resilience and Hope and Post-Traumatic Growth After a Romantic Relationship.*

Membedakan antara sekadar bertahan dengan tumbuh. Orang yang kuat belum tentu punya harapan. Namun, orang yang punya harapan (*agency + pathways*) hampir pasti mengalami Pertumbuhan Pasca-Trauma (PTG). Hope sebagai variabel terpisah untuk menentukan ending: apakah pengguna hanya *survivor* atau benar-benar bertumbuh.

**Range:** 0–100. Hope tinggi (>80) di awal = Denial (harapan palsu). Hope tinggi (>80) di akhir = True Acceptance.

#### Denial State
**Referensi:** Moyer, L. M., & Enck, S. (2021). *Is my grief too public for you? The digitalization of grief on Facebook.*

Di era media sosial, berekspresi sering kali tidak sesuai dengan perasaan dari dalam (*Emotional Performance*). Individu merasa harus tampil tegar atau menyembunyikan duka agar diterima sosial, menciptakan disonansi kognitif. Variabel Denial State dirancang untuk mendeteksi gap ini: jika jawaban dialog eksplisit positif ("Aku oke"), tetapi pola perilaku implisit negatif (menghindar), sistem mencatatnya sebagai Denial.

**Range:** 0–100. Threshold kritis: > 60 menyembunyikan pilihan dialog logis/realistis.

#### Rumination Mode
**Referensi:**
- Eisma, M. C., Janshen, A., & de Haan, N. (2025). *Rumination, Hopelessness, Behavioural Avoidance and Psychopathology Symptoms After Bereavement.*
- Eisma, M. C., & Stroebe, M. S. (2021). *Emotion Regulatory Strategies in Complicated Grief: A Systematic Review.*

Tidak semua perenungan itu buruk. Terbukti bahwa Ruminasi dibagi menjadi **Brooding** (toxic: meratapi nasib, fokus pada masalah) dan **Reflection** (sehat: refleksi, fokus pada solusi). Pemisahan ini penting agar intervensi sistem tepat sasaran — apakah harus menghentikan pikiran (jika brooding) atau memfasilitasi pikiran (jika reflection).

**Nilai:** `"brooding"` (negatif/maladaptif) atau `"reflection"` (sehat/adaptif).

---

### 2.2 Basis Pertanyaan (Question Bank)

**Referensi:** Lenferink, L. I. M., et al. (2022). *The Traumatic Grief Inventory-Clinician Administered (TGI-CA): A psychometric evaluation.*

Untuk menjamin akurasi deteksi kondisi emosional, basis pertanyaan mengadaptasi item-item dari **Traumatic Grief Inventory-Clinician Administered (TGI-CA)** yang divalidasi untuk ICD-11 dan DSM-5-TR (Prolonged Grief Disorder). Sistem mengonversi item klinis menjadi dialog yang lebih kasual sesuai konteks permainan, tanpa mengurangi esensi diagnostiknya.

**Dua klaster gejala utama yang diukur:**

**Kriteria B (Distres Perpisahan)**
Gejala inti mencakup kerinduan mendalam dan preokupasi pikiran tentang orang yang hilang. Diimplementasikan pada pertanyaan awal untuk mengukur intensitas keterikatan pemain.

*Contoh pertanyaan:* "Seberapa sering kamu merasakan dorongan kuat untuk bertemu atau berbicara dengannya?" (Mengukur variabel Distress).

*Contoh bukti perilaku implisit:* Jam dinding menunjukkan pukul 11.00 malam. Biasanya, ini adalah jam wajib kalian 'login' Discord... Rasanya aneh sekali duduk di kursi ini sendirian. Pemain yang memilih mematikan komputer (Distress +20) menunjukkan gejala distres perpisahan yang kuat.

**Kriteria C (Gejala Tambahan)**
Gejala tambahan meliputi gangguan identitas, ketidakpercayaan, penghindaran (*avoidance*), rasa sakit emosional yang intens, mati rasa (*numbness*), dan perasaan hidup tidak bermakna.

*Contoh bukti perilaku implisit:* Keran air bocor... Membanting kunci inggris itu ke lantai sambil berteriak frustrasi. Kemarahan yang meledak pada benda mati menunjukkan rasa sakit emosional yang intens akibat kehilangan.

**Threshold risiko:** Sistem mendeteksi risiko gangguan duka tercapai jika terpenuhi minimal 1 gejala Kriteria B + minimal 3 gejala Kriteria C.

---

### 2.3 Basis Respons Sistem (CBT-Based)

**Referensi:** Komischke-Konnerup, K. B., et al. (2021). *Grief-Focused Cognitive Behavioral Therapies for Prolonged Grief Symptoms: A Systematic Review and Meta-Analysis.*

Penggunaan platform game sebagai media intervensi divalidasi oleh temuan bahwa CBT yang disampaikan melalui format digital menunjukkan efikasi yang sebanding dengan tatap muka dalam mengurangi gejala PGD. Sistem pakar ini mengadopsi tiga komponen utama:

**1. Strategi Paparan (Exposure)**
- *Target:* Mengatasi penghindaran cemas terhadap memori orang yang hilang.
- *Implementasi:* Jika sistem mendeteksi variabel Avoidance tinggi, sistem memberikan misi naratif untuk menghadapi stimulus yang dihindari secara bertahap (misal: *"Cobalah melihat satu foto kenangan hari ini"*).
- *Contoh respons:* *"Menghindar hanya menunda rasa sakit. Cobalah melihat satu foto kenangan hari ini, dan izinkan dirimu merasakannya sejenak."*

**2. Restrukturisasi Kognitif (Cognitive Restructuring)**
- *Target:* Mengubah kognisi maladaptif atau pikiran negatif otomatis (misal: rasa bersalah berlebihan).
- *Implementasi:* Jika sistem mendeteksi Rumination (tipe Brooding), sistem merespons dengan pertanyaan sokratik untuk menguji validitas pikiran tersebut.
- *Contoh respons:* *"Kamu menghukum tubuhmu karena kesalahan pikiranmu. Apakah pikiran 'tidak pantas' ini sebuah fakta, atau hanya perasaan sementaramu?"* & *"Pikiran bahwa ini semua salahmu adalah hal yang wajar dirasakan, tapi mari kita lihat faktanya: apakah kamu benar-benar memiliki kendali penuh atas kejadian itu?"*

**3. Aktivasi Perilaku (Behavioral Activation)**
- *Target:* Mengatasi penghindaran depresif dan penarikan diri dari aktivitas.
- *Implementasi:* Jika sistem mendeteksi Distress tinggi disertai pasivitas, sistem memberikan saran aktivitas kecil yang bernilai positif.
- *Contoh respons:* *"Dunia mimpi lebih ramah. Energi mungkin terasa minim, tapi bagaimana jika kita mulai dengan satu hal kecil? Cobalah duduk di tepi kasur selama 1 menit."* & *"Energi mungkin terasa minim, tapi bagaimana jika kita mulai dengan satu hal kecil? Menyiram tanaman atau berjalan kaki 5 menit?"*

---

## 3. Definisi Variabel & Threshold

| Variabel | Range | Threshold Kritis | Dampak |
| :--- | :--- | :--- | :--- |
| **distress** | 0–100 | > 85 | Memicu transisi ke Depression |
| **hope** | 0–100 | > 80 (awal) / > 80 (akhir) | Awal: Harapan palsu → trigger event. Akhir: True Acceptance |
| **denial** | 0–100 | > 60 | Menyembunyikan pilihan dialog realistis/logis |
| **rumination** | brooding/reflection | Brooding berturut-turut ≥ 3 hari | Percepat timer pertanyaan; munculkan pertanyaan bonus intervensi |
| **avoidance_count** | 0–∞ (int) | > 4 | Memicu repetitive question (simulasi "stuck") |
| **aggressive_choice_count** | 0–∞ (int) | ≥ 3 | Distress turun lalu naik 2x lipat (Boomerang Effect) |
| **internalized_anger_count** | 0–∞ (int) | ≥ 3 | Munculkan pertanyaan bonus intervensi depresi |
| **consecutive_hard_denial** | 0–∞ (int) | ≥ 3 | Output: *"Kamu percaya itu? Benar-benar percaya?"* |

---

## 4. Rule Base

### 4.1 Chapter: DENIAL

**Rule D-01 — Cognitive Depletion Trigger**
```
IF (distress >= 80 AND rumination == "brooding")
THEN trigger "Reality Crash" → transition to ANGER
```
*Basis (Stroebe & Schut, 2021 — DPM):* Menahan realita membutuhkan energi kognitif yang masif. Ketika Distress atau beban pikiran mencapai ambang batas maksimal, terjadi Cognitive Depletion (Kelelahan Kognitif). Pertahanan ego hancur, dan emosi yang ditekan akan meledak menjadi kemarahan.

---

**Rule D-02 — CBT Exposure Trigger (False Hope)**
```
IF (hope >= 80 OR denial >= 80) AND chapter == "denial"
THEN trigger "Melihat Mantan" event → distress = 100
```
*Basis (Boelen et al., dalam Komischke-Konnerup et al., 2021 — CBT):* Memiliki Hope >= 80 di saat baru putus bukanlah harapan yang sehat. Dalam terapi CBT, terapis melakukan *Exposure* (paparan realita) untuk memecahkan delusi ini. Sistem melakukan fungsi terapis tersebut dengan memunculkan event yang menghancurkan delusi secara mendadak. Ini akurat digambarkan dengan lonjakan Distress = 100.

---

**Rule D-03 — Cognitive Blindness**
```
IF (denial > 50)
THEN hide option_C (pilihan dialog logis/realistis)
```
*Basis (Eisma & Stroebe, 2021):* Kekakuan kognitif akibat penghindaran pengalaman. Ketika tingkat Denial seseorang tinggi, otak bagian Amigdala (pusat emosi) mengambil alih, sementara Korteks Prefrontal (pusat logika) diblokir untuk melindungi ego dari rasa sakit. Mekanik game menyembunyikan opsi C adalah representasi visual "Cognitive Blindness" — orang yang sedang denial parah tidak mampu melihat atau memproses jalan keluar yang logis.

---

**Rule D-04 — Hyperarousal Timer**
```
IF (rumination == "brooding" AND rumination_score > 50)
THEN speed_up(question_timer, factor=1.5)
```
*Basis (Eisma et al., 2025):* Ruminasi tipe Brooding secara langsung memicu Hyperarousal (peningkatan detak jantung, kecemasan, kepanikan). Dalam kondisi hyperarousal, seseorang mengalami distorsi persepsi waktu. Mempercepat timer adalah implementasi UX untuk mensimulasikan kepanikan serangan kecemasan akibat *overthinking*.

---

**Rule D-05 — Emotional Performance Detection**
```
IF (consecutive_hard_denial >= 3)
THEN output: "Kamu percaya itu? Benar-benar percaya?"

IF (choice == "logical" AND distress > 50)
THEN output: "Logikamu berkata tidak apa-apa, tapi tanganmu gemetar hebat."
```
*Basis (Moyer & Enck, 2021 — Grief Policing & Emotional Performance):* Sistem mendeteksi adanya Disonansi Kognitif (ketidakselarasan antara otak sadar dan emosi bawah sadar). Pemain memaksakan diri memilih jawaban logis/rasional, padahal indikator internal mereka (Distress) sedang hancur. Teguran sistem merujuk pada konsep *Somatic Experiencing* — duka sering bocor melalui respons fisik (gemetar, sesak, mual) sebelum otak sempat merasionalisasinya.

---

### 4.2 Chapter: ANGER

**Rule A-01 — Allostatic Overload → Depression**
```
IF (distress >= 85) AND chapter == "anger"
THEN load "depression" chapter
```
*Basis (Stroebe & Schut, 2021 — DPM):* Marah eksplosif memicu sistem saraf simpatik (*fight-or-flight*) secara maksimal. Namun, tubuh manusia tidak didesain untuk berada dalam mode tempur terus-menerus. Ketika Distress mencapai titik didih (>=85), otak akan melakukan *shutdown* paksa untuk menghemat energi. Fase *shutdown* inilah yang secara klinis bermanifestasi sebagai Depresi (kelesuan, apatis, kehilangan energi).

---

**Rule A-02 — Obsessive Bargaining Trigger**
```
IF (rumination == "brooding" AND rumination_score >= 80 AND distress < 80)
THEN transition to "bargaining" chapter
```
*Basis (Smith, Wild, & Ehlers, 2024):* Pemain dengan skor ruminasi tinggi yang tidak disertai ledakan distres emosional mengindikasikan bahwa mereka berada dalam fase obsesif kognitif, bukan kesedihan afektif. Fokus mereka tersita oleh pikiran berulang mengenai ketidakadilan situasi (*"Mengapa ini terjadi?"* atau *"Bagaimana cara membatalkan ini?"*). Fase di mana otak sibuk mengalkulasi kesalahan dan mencari celah keadilan ini adalah transisi kognitif yang mendefinisikan fase Bargaining.

---

**Rule A-03 — Boomerang Effect (Venting Backfire)**
```
IF (aggressive_choice_count >= 3)
THEN distress -= 20  // sementara
THEN distress += 40  // pada pemicu berikutnya (2x lipat)
```
*Basis (Eisma & Stroebe, 2021):* Banyak orang mengira melampiaskan kemarahan (banting barang/maki-maki) itu menyehatkan. Padahal, riset regulasi emosi modern membuktikan bahwa melampiaskan amarah secara agresif adalah strategi maladaptif. Perilaku agresif memang memberikan pelepasan dopamin sesaat (Distress turun sementara), namun justru memperkuat jalur saraf (*neural pathway*) kemarahan di otak. Akibatnya, pada pemicu berikutnya, amarah dan stres akan meledak jauh lebih besar.

---

**Rule A-04 — Depression Prevention Intervention**
```
IF (internalized_anger_count >= 3)
THEN trigger bonus_question (CBT Cognitive Restructuring)
```
*Basis (Komischke-Konnerup et al., 2021 — CBT):* Rasa bersalah yang berlebihan adalah prediktor utama (jalan tol) menuju depresi klinis dan niat bunuh diri. Jika sistem pakar mendeteksi pemain melakukan internalisasi kemarahan sebanyak 3 kali, memunculkan "Intervensi Pencegahan" adalah tindakan sistem terapis yang sesuai protokol CBT untuk segera melakukan Cognitive Restructuring sebelum pemain jatuh terlalu dalam.

---

**Rule A-05 — Defending Ex Behavior**
```
IF (denial_choice_count > 2) AND chapter == "anger"
THEN hope += 10, distress -= 5
THEN display_warning: "Kamu masih membela mantanmu."
```
*Basis (Civilotti et al., 2021):* Logika ini merepresentasikan fenomena perilaku setelah putus cinta yang dilandasi oleh gaya kelekatan cemas. Individu sering kali mengadopsi perilaku disfungsional yang didorong oleh motivasi rasa takut ditinggalkan, rasa tidak aman, dan harga diri yang rendah.

---

### 4.3 Chapter: BARGAINING

**Rule B-01 — Stuck Detection (Avoidance Loop)**
```
IF (avoidance_choice_count > 4) AND chapter == "bargaining"
THEN force "Repetitive Thought" question
THEN output: "Pikiran yang sama lagi. Dan lagi. Kapan kamu akan lelah?"
```
*Basis (DPM + CBT):* Mendeteksi pemain yang terjebak dalam siklus menghindar tanpa kemajuan. Output menyimulasikan perasaan "stuck" yang dirasakan secara nyata dalam grief berkepanjangan.

---

**Rule B-02 — Emotional Performance (Mass Delete)**
```
IF (action == "mass_delete_photos")
THEN measure response_time
IF (response_time < 2s) THEN record as "Emotional Performance"
IF (response_time > 8s) THEN record as "Genuine Readiness"
```
Sistem mendeteksi apakah pemain benar-benar siap melepaskan atau hanya melakukan "Emotional Performance" (masking) berdasarkan analisis waktu respons pilihan.

---

### 4.4 Chapter: DEPRESSION

**Rule Dep-01 — Stuck in Depression**
```
IF (distress >= 90 AND avoidance_choice_count > 4)
THEN force "Repetitive Question" (misi Menahan Diri dari Menghubungi)
THEN output: narasi intervensi Behavioral Activation
```

---

**Rule Dep-02 — Regression to Bargaining**
```
IF (struggle_button_failed) AND chapter == "depression"
THEN oscillate → bargaining chapter (sementara)
THEN distress += 15
```
Kegagalan menahan impuls menghubungi Dia menyebabkan regresi sementara ke pola pikir Bargaining — fenomena yang umum dalam proses grief non-linear.

---

### 4.5 Acceptance Criteria (True Ending)

```
IF (hope > 80 AND rumination != "brooding" AND distress < 40)
THEN set status = "true_acceptance"
THEN unlock epilogue
```

---

## 5. Contoh Pertanyaan Refleksi Malam

Berikut contoh pertanyaan yang diajukan kaktus kepada pemain setiap malam, beserta bobot variabel yang dipengaruhi:

| Pertanyaan | Pilihan A | Pilihan B | Pilihan C | Dampak |
| :--- | :--- | :--- | :--- | :--- |
| "Tadi waktu makan sendirian, apa yang kamu pikirkan?" | "Tidak ada, aku menikmatinya" (Hope +5) | "Kepikiran dia sedikit" (Distress +10) | "Terus-terusan kepikiran dia" (Distress +25, Rumination → brooding) | Ukur Kriteria B |
| "Kalau bisa mengulang waktu, apa yang kamu lakukan berbeda?" | "Tidak ada, aku tidak menyesal" (Denial -10) | "Mungkin beberapa hal kecil" (Rumination → reflection) | "Segalanya, dari awal" (Bargaining trigger, Distress +15) | Ukur Bargaining |
| "Tadi ada yang mengingatkanmu padanya. Kamu..." | "Langsung pergi dari situ" (Avoidance +1, Denial +10) | "Membiarkan diri merasakan sebentar" (Distress -5, Exposure +1) | "Menangis di kamar mandi" (Distress +10, Emotion Release +1) | Ukur Avoidance |

---

## 6. NPC Intervention Mechanic

Jika pemain terjebak dalam satu chapter melebihi **7 hari in-game** tanpa kemajuan variabel, sistem secara otomatis memunculkan dialog NPC intervensi:

- **Teman Curhat** muncul dengan pendekatan empatik: *"Kamu terlihat seperti menanggung sesuatu sendirian. Mau cerita?"*
- Jika pemain memilih cerita → misi dialogic khusus yang secara langsung menggerakkan variabel yang stagnan.
- Jika pemain menolak → NPC memberikan "ruang" tapi meninggalkan catatan di smartphone.

Mekanisme ini mencegah pemain terjebak selamanya dan memastikan progres naratif tetap berjalan.
