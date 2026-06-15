# PRD — Platform Pertolongan Pertama Psikologis

> **Hackathon:** HIMATIF Hackathon
> **Owner:** Fiki (PPLG 2), Abshors (PPLG 2)
> **Versi:** 0.1 (Draft awal, 11 Juni 2026)
> **Status:** In Progress — menunggu keputusan poin Open Questions (Section 16)

---

## 1. Ringkasan Eksekutif

**Ruang** adalah Platform Pertolongan Pertama Psikologis yang dirancang khusus bagi individu yang merasa **ragu, bingung, atau sekadar ingin tahu** mengenai kondisi kesehatan mental mereka saat ini.

Ruang bertindak sebagai **"jembatan aman"** antara fase kebingungan pengguna menuju penanganan profesional, dengan memastikan mereka merasa didengar dan divalidasi terlebih dahulu sebelum bertemu ahlinya.

### 3 Pilar Utama

1. **Kenali (Screening Awal)** — Memetakan kondisi emosional pengguna secara cepat melalui kuesioner dasar dan harian. Hasilnya langsung mengubah nuansa visual antarmuka agar terasa lebih personal.
2. **Validasi (AI Chatbot Pendengar)** — AI mengambil inisiatif menyapa berdasarkan hasil screening. AI fokus menjadi teman curhat yang memvalidasi perasaan pengguna dan memberikan dukungan emosional dalam sesi-sesi yang terukur.
3. **Arahkan (Rujukan Profesional)** — Setelah pengguna merasa lebih tenang atau sistem mendeteksi kebutuhan penanganan lebih lanjut, AI mengarahkan pengguna secara mulus untuk melakukan konsultasi nyata dengan psikolog mitra.

### Nilai Tambah (Value Proposition)

| Stakeholder | Manfaat |
|-------------|---------|
| **Pengguna** | Mengenali kondisi mental sendiri tanpa beban stigma, merasa didengar sebelum bertemu profesional |
| **Psikolog** | Klien yang datang sudah memiliki **ringkasan kondisi terstruktur** (dari screening + sesi AI) sehingga psikolog bisa lebih cepat & dalam menganalisis |
| **Platform** | Diferensiasi via integritas data on-chain & personalisasi UI |

---

## 2. Latar Belakang & Masalah

### Masalah
- Banyak orang **tidak yakin** apakah kondisi mental mereka "cukup serius" untuk ditangani profesional.
- Stigma + biaya + waktu membuat banyak orang **menunda** atau **tidak pernah** konsultasi.
- Psikolog sering menerima klien tanpa konteks awal, membuang waktu sesi untuk klarifikasi dasar.

### Solusi
Ruang menyediakan **onboarding bertingkat** yang lembut:
1. Screening ringan → tidak terasa seperti "tes medis".
2. Chatbot sebagai **teman curhat** yang aman dan anonim-nyaman.
3. Rujukan profesional yang **terbimbing**, dengan ringkasan kondisi yang sudah disiapkan.

---

## 3. Tujuan Produk (SMART Goals)

| # | Goal | Metrik | Target MVP |
|---|------|--------|------------|
| G1 | Pengguna dapat mengenali kondisi mental awal | Completion rate screening | ≥ 80% |
| G2 | Pengguna merasa tervalidasi | Avg. durasi sesi chatbot | ≥ 5 menit |
| G3 | Rujukan ke psikolog berjalan mulus | Conversion sesi AI → booking | ≥ 10% |
| G4 | Psikolog mendapat konteks klien | % booking yang disertai brief | 100% |
| G5 | Integritas data konsultasi | % sesi yang di-hash on-chain | 100% |
| G6 | Retensi pengguna | D7 retention | ≥ 25% |

---

## 4. Target Pengguna & Persona

### Persona A — "Raka, 21, Mahasiswa"
- Merasa cemas berlebihan tapi **bingung apakah perlu ke psikolog**.
- Tidak nyaman curhat ke teman/keluarga.
- Butuh **tempat aman & anonim** untuk validasi.
- **Kebutuhan:** screening cepat, chatbot pendengar, opsi rujukan profesional.

### Persona B — "Dr. Maya, Psikolog Klinis"
- Praktik online, ingin klien yang datang sudah punya **konteks awal**.
- Butuh ringkasan kondisi klien sebelum sesi.
- **Kebutuhan:** dashboard dengan brief klien terstruktur, integritas data konsultasi (tanda tangan on-chain).

### Persona C — "Admin Platform"
- Mengelola psikolog mitra, verifikasi profesional.
- Memantau KPI (booking, completion, revenue).

---

## 5. User Stories

### Screening
- US-01: Sebagai pengguna baru, saya ingin **menjawab pertanyaan dasar** saat onboarding agar aplikasi tahu kondisi awal saya.
- US-02: Sebagai pengguna, saya ingin **menjawab screening harian singkat** (≤ 3 pertanyaan) untuk merekam mood harian.
- US-03: Sebagai pengguna, saya ingin **UI berubah warna/tema** sesuai kondisi emosional saya agar terasa lebih personal.

### Chatbot
- US-04: Sebagai pengguna, saya ingin **AI yang menyapa duluan** dengan konteks perasaan saya (bukan chat kosong).
- US-05: Sebagai pengguna, saya ingin chatbot **memvalidasi perasaan** saya, bukan menghakimi.
- US-06: Sebagai pengguna, saya bisa **membuka sesi baru** kapan saja.
- US-07: Sebagai pengguna, saya ingin melihat **riwayat sesi** sebelumnya.

### Rujukan & Psikolog
- US-08: Sebagai pengguna, saya ingin **melihat daftar psikolog** dengan bio & jadwal.
- US-09: Sebagai pengguna, saya ingin **membuat janji konsultasi** dan membayar.
- US-10: Sebagai psikolog, saya ingin **menerima/menolak** permintaan janji.
- US-11: Sebagai psikolog, saya ingin **membaca brief klien** (ringkasan screening + AI) sebelum sesi.
- US-12: Sebagai psikolog, saya ingin **menandatangani ringkasan sesi** dan bukti tersimpan on-chain.

### Auth
- US-13: Sebagai pengguna, saya ingin **daftar/masuk** dengan email atau OAuth.
- US-14: Sebagai pengguna, saya ingin data saya **privat & aman** (hak hapus, enkripsi).

---

## 6. Fitur Inti (Spesifikasi Detail)

### 6.1 Auth & Profil
- Library: **Auth.js v5 (NextAuth.js)** + `@auth/prisma-adapter` (integrasi mulus dengan Prisma/Postgres).
- Sign up / login via email-password (Credentials Provider, password di-hash dengan bcrypt). OAuth (Google) = opsional post-MVP.
- Session strategy: `database` (karena pakai Prisma adapter — session row disimpan di Postgres, bukan JWT).
- Session helper: `auth()`, `signIn()`, `signOut()` dari `auth.ts` (root).
- Middleware `middleware.ts` untuk protected routes (`/app/dashboard`, `/app/screening`, `/app/chat`).
- Profil: nama, usia, jenis kelamin, kontak darurat opsional.
- Onboarding singkat (5 pertanyaan) → lanjut ke Screening Awal.

### 6.2 Screening Awal
- **Screening Onboarding** (5–7 pertanyaan dasar, wajib):
  - Skala mood, kecemasan, kualitas tidur, energi, pikiran negatif.
  - Output: skor per-dimensi + kategori kondisi (ringan/sedang/berat).
- **Screening Harian** (3 pertanyaan, ≤ 60 detik):
  - Mood hari ini, intensitas, catatan singkat.
  - Tren 7 hari ditampilkan sebagai grafik sederhana.
- **Dynamic Theming:**
  - Hasil kategori memetakan ke **3 tema UI**:
    - 🌤️ Cerah (kondisi baik) — palet hangat, ilustrasi cerah.
    - 🌥️ Mendung (kondisi sedang) — palet kalem, ilustrasi netral.
    - 🌧️ Hujan (kondisi perlu perhatian) — palet lembut, ilustrasi supportive.
- **Trigger UI post-screening:**
  - Setelah selesai, tampilkan CTA: **"Mulai sesi curhat dengan AI?"** + opsi **"Lihat riwayat saja"**.

### 6.3 AI Chatbot Pendengar
- **Struktur Sesi:**
  - Sesi = 1 percakapan bertopik (bisa ditutup & dibuka baru).
  - Daftar sesi di sidebar dengan timestamp + label emosi (auto-generated).
- **Inisiasi oleh AI:**
  - Pesan pertama AI = rangkuman kondisi dari screening terakhir, lalu bertanya terbuka.
  - Contoh: *"Dari screening barusan, kamu merasa cukup lelah akhir-akhir ini. Mau cerita apa yang lagi bikin berat?"*
- **Peran AI:**
  - **Validasi:** "Wajar kalau kamu merasa begitu."
  - **Refleksi:** memparafrase perasaan pengguna.
  - **Dukungan:** coping sederhana (breathing, journaling prompt).
  - **TIDAK:** diagnosa, resep, klaim medis.
- **Penutupan Sesi:**
  - AI menghasilkan **ringkasan kondisi** (≤ 200 kata) tersimpan otomatis.
  - CTA: *"Mau lanjut cerita sesi baru?"* atau *"Lihat opsi ngobrol dengan psikolog"*.

### 6.4 Konsultasi Psikolog
- **Daftar Psikolog:** foto, spesialisasi, rating, jadwal.
- **Booking Flow:**
  1. Pilih psikolog → pilih slot waktu.
  2. Konfirmasi pemesanan jadwal.
  3. Psikolog menerima/menolak dalam 24 jam.
  4. Chat real-time saat jadwal (websocket).
- **Brief Otomatis untuk Psikolog:**
  - Hasil screening terakhir.
  - Ringkasan 1–3 sesi AI terakhir.
  - Tren mood 7 hari.
- **Pasca-sesi:**
  - Psikolog menulis **catatan sesi** (private ke psikolog & klien).
  - **Hash ringkasan disimpan on-chain** sebagai bukti integritas.

### 6.5 Dashboard Psikolog
- Antrian janji (pending, upcoming, completed).
- Detail klien + brief.
- Riwayat konsultasi.
- Tanda tangan digital sesi (tx on-chain).

---

## 7. User Flow End-to-End

```
[Visitor]
  │
  ▼
[Sign Up / Login] ───────────────────┐
  │                                   │
  ▼                                   │
[Onboarding (5 Q)]                    │
  │                                   │
  ▼                                   │
[Screening Awal (7 Q)]                │
  │                                   │
  ├──[Skip]──►[Home — tema netral]    │
  │                                   │
  ▼                                   │
[Hasil + UI berubah tema]             │
  │                                   │
  ├──[Mulai Sesi AI]──►[Chatbot]      │
  │                          │        │
  │                          ▼        │
  │                  [Ringkasan Sesi]  │
  │                          │        │
  │                          ▼        │
  │                  [Lanjut / Baru / │
  │                   Lihat Psikolog]  │
  │                                   │
  └──[Lihat Psikolog]──►[List]        │
                              │       │
                              ▼       │
                        [Booking]     │
                              │       │
                              ▼       │
                        [Payment]     │
                              │       │
                              ▼       │
                  [Psikolog Approve]  │
                              │       │
                              ▼       │
                    [Chat Real-time]  │
                              │       │
                              ▼       │
                    [Catatan Sesi]    │
                              │       │
                              ▼       │
                  [Hash ke Blockchain]│
                              │       │
                              ▼       │
                       [End / Selesai]
```

---

## 8. Trigger Rujukan ke Psikolog ⚠️ (Critical Decision)

Fiki: *"AI Mengarahkan pengguna ke psikolog (masih bingung triggernya gimana)."*

### Opsi yang Diusulkan

| Trigger | Deskripsi | Pro | Kontra |
|---------|-----------|-----|--------|
| **A. Deteksi Krisis** | Keyword self-harm / suicide ideation | Mendesak & menyelamatkan nyawa | False positive bisa membuat panik |
| **B. Skor Screening Tinggi** | Kategori "berat" otomatis | Konsisten & objektif | Tidak semua orang terbuka di screening |
| **C. Setelah N Sesi Chatbot** | Misal ≥ 3 sesi | Memberi ruang proses | Bisa terlalu lambat |
| **D. User Eksplisit Minta** | Tombol "Saya mau bicara dengan psikolog" | Otonomi pengguna | Tidak proaktif |

### Rekomendasi: **Kombinasi A + B + D (otomatis) + C (suggested)**

- **A (Krisis):** WAJIB immediate referral + tampilkan hotline darurat. (Selalu aktif, tidak opsional)
- **B (Skor Berat):** Otomatis tampilkan banner lembut: *"Kami rasa ngobrol dengan profesional bisa membantu. Mau lihat psikolog mitra kami?"*
- **C (Sesi ≥ 3):** Saran halus, tidak memaksa.
- **D (User Minta):** Selalu tersedia, 1-tap ke daftar psikolog.

**Status:** Membutuhkan diskusi & konfirmasi tim.

---

## 9. Layanan Konsultasi Psikolog (MVP Non-Komersial)

### Alur Konsultasi
1. **Gratis & Terjangkau**: Untuk fase MVP, layanan screening, AI Chatbot, profil, dan konsultasi dengan psikolog disediakan tanpa biaya (Gratis) guna meminimalkan hambatan akses dan menghindari regulasi pembayaran medis yang rumit di awal.
2. **Tanpa Alur Transaksi**: Pengguna dapat langsung memilih jadwal psikolog dan melakukan booking tanpa melalui proses pembayaran (payment gateway).

### Booking & Approval
1. Pengguna memilih psikolog dan slot waktu konsultasi → mengirimkan permintaan booking secara langsung.
2. Status: `pending_psychologist` → `confirmed` / `declined`.
3. Psikolog memiliki waktu **24 jam** untuk menyetujui atau menolak permintaan konsultasi.
4. Ketika jadwal konsultasi tiba, fitur chat real-time akan otomatis aktif.

---

## 10. Tech Stack (Rencana)

| Layer | Pilihan | Alasan |
|-------|---------|--------|
| **Frontend** | Next.js 16 (App Router) + TypeScript | Cepat di-setup, SSR, ekosistem luas |
| **Styling** | Tailwind CSS + shadcn/ui | Cepat & konsisten dengan Stitch |
| **Design Tool** | Stitch (Google) | Sesuai brief tim |
| **Backend** | Next.js API Routes (server actions) | Hemat waktu MVP, monorepo ringan |
| **Database (Dev/MVP)** | **PostgreSQL lokal** via Docker (Postgres image) | Mudah di-setup, portabel, siap migrasi ke VPS |
| **ORM** | **Prisma** | Type-safe, migrasi mudah, dokumentasi luas untuk pemula |
| **Auth** | **Auth.js v5 (NextAuth.js)** + `@auth/prisma-adapter` | Standar industri Next.js, integrasi native dengan Prisma |
| **Form & Validasi** | **TanStack Form** + **Zod** | Type-safe, headless, integrasi resmi shadcn/ui |
| **Data Fetching** | **TanStack Query (React Query)** | Cache, invalidation, devtools, standar untuk Next.js |
| **State Management** | **Zustand** | Ringan, untuk state global (UI tema, session UI state) |
| **Koneksi DB** | `postgresql://user:pass@localhost:5432/ruang` | Standar, tinggal swap host saat deploy VPS |
| **AI** | **Google Gemini** (`gemini-2.5-flash` untuk chat real-time, `gemini-2.5-pro` untuk rangkuman sesi & screening scoring) | Cepat, murah, konteks panjang, API simpel, mendukung streaming |
| **Smart Contract** | Solidity + Hardhat + Base/Polygon (L2 murah) | ❌ NOT MVP — skip |
| **Wallet Connect** | RainbowKit + Wagmi (psikolog only) | ❌ NOT MVP — skip |
| **Payment** | Midtrans (atau stub untuk MVP) | Standar ID |
| **Runtime** | **Bun.js** (v1.3.9) | Package manager & runtime, handle native bindings lebih stabil |
| **Hosting (Dev)** | Docker Postgres di laptop masing-masing + Next.js dev server (via `bun run dev`) | Offline-friendly untuk hackathon |
| **Hosting (Prod/VPS)** | VPS (DigitalOcean/Hetzner/IdCloudHost) + managed Postgres | Rencana migrasi post-hackathon |
| **Versioning** | Git + GitHub | Standar |

**Status:** ✅ Finalisasi 12 Juni 2026. Web3 opsional (skip dulu).

---

## 11. Arsitektur Data

### On-chain (Blockchain) 🔗
> Hanya data yang perlu **integritas publik & tidak bisa disangkal**.

| Data | Bentuk On-chain | Tujuan |
|------|-----------------|--------|
| Hash ringkasan sesi konsultasi | `bytes32` | Bukti integritas tidak diubah |
| ID psikolog (wallet address) | `address` | Identitas kriptografis |
| ID klien (hashed UUID) | `bytes32` | Privasi |
| Timestamp | `uint256` | Audit trail |
| Signature psikolog | `bytes` | Tanda tangan digital |

> **Smart Contract `ConsultationRegistry.sol`:**
> ```
> function registerSession(
>     bytes32 sessionId,
>     bytes32 clientHash,
>     bytes32 summaryHash,
>     uint256 timestamp,
>     bytes calldata signature
> ) external onlyPsychologist
> ```

### Off-chain (Database) 🗄️
> Semua data PII, chat history, billing — disimpan di **PostgreSQL** (lokal saat dev, VPS saat prod).

| Tabel | Isi |
|-------|-----|
| `users` | Profil, auth (password hash) |
| `screening_responses` | Jawaban screening (onboarding & harian) |
| `chat_sessions` | Metadata sesi AI |
| `chat_messages` | Isi pesan (encrypted at rest) |
| `session_summaries` | Ringkasan kondisi (sumber hash on-chain) |
| `psychologists` | Profil profesional, wallet address |
| `appointments` | Booking, status |
| `consultation_notes` | Catatan pasca-sesi psikolog |

#### Setup Database Lokal (Dev)
- **Docker Compose** (file `docker-compose.yml` di repo root):
  ```yaml
  services:
    postgres:
      image: postgres:16-alpine
      environment:
        POSTGRES_USER: ruang
        POSTGRES_PASSWORD: ruang_dev
        POSTGRES_DB: ruang
      ports:
        - "5432:5432"
      volumes:
        - pgdata:/var/lib/postgresql/data
  volumes:
    pgdata:
  ```
- Jalankan: `docker compose up -d`
- Koneksi dari Next.js: `DATABASE_URL=postgresql://ruang:ruang_dev@localhost:5432/ruang`
- Migrasi awal: `npx prisma migrate dev --name init`

#### Migrasi ke VPS (Post-Hackathon)
- Dump lokal: `pg_dump ruang > backup.sql`
- Restore di VPS: `psql -h <vps-host> -U ruang -d ruang < backup.sql`
- Update `DATABASE_URL` di environment VPS (jangan commit `.env`).

---

## 12. Non-Functional Requirements

| Aspek | Requirement |
|-------|-------------|
| **Privasi & Keamanan** | Chat messages dienkripsi at-rest (AES-256). TLS in-transit. Hak hapus data (GDPR-like). |
| **Crisis Safety** | Hot-line ID (Yayasan Pulih, Into The Light, LSM Jangan Bunuh Diri) selalu tersedia. |
| **Latency** | Chat AI: respons pertama ≤ 3 detik. Chat real-time: ≤ 500 ms. |
| **Scalability MVP** | 100 concurrent users cukup. |
| **Aksesibilitas** | Mobile-first. Kontras WCAG AA. Font readable. |
| **Bahasa** | Bahasa Indonesia (utama) + English (opsional post-MVP). |
| **Disclaimer** | Banner jelas: *"Ruang bukan pengganti profesional. Untuk darurat, hubungi [hotline]."* |

---

## 13. Metrics Kesuksesan

| Metrik | Target MVP (Hackathon) | Target Pasca-MVP |
|--------|------------------------|------------------|
| Completion rate screening | ≥ 80% | ≥ 90% |
| Avg. durasi sesi chatbot | ≥ 5 menit | ≥ 8 menit |
| Conversion AI → booking | ≥ 5% | ≥ 15% |
| Chat real-time success rate | ≥ 95% | ≥ 99% |
| On-chain tx success | ≥ 95% | ≥ 99% |
| D7 retention | ≥ 20% | ≥ 40% |
| NPS | ≥ 30 | ≥ 50 |

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| **False positive deteksi krisis** | Panik & kehilangan trust | Konfirmasi 2-langkah sebelum tampilkan hotline. |
| **AI beri saran berbahaya** | Tinggi | System prompt ketat, no-medical-advice, fallback ke manusia. |
| **Pembatalan konsultasi** | Jadwal terbuang | Batasi jumlah booking aktif per user. |
| **Gas spike blockchain** | Tx gagal | Pakai L2 (Base/Polygon), fixed gas. |
| **Psikolog tidak approve** | UX buruk | Notifikasi + auto-cancel + refund 24 jam. |
| **Privasi bocor** | Fatal | Enkripsi, access control ketat, audit log. |
| **Scope creep** | MVP molor | Lock fitur MVP di akhir 12 Juni. |

---

## 15. Roadmap & Milestone

| Tanggal | Fase | Deliverable |
|---------|------|-------------|
| **Kam, 11/06** | Breakdown Ide | PRD v0.1 + TODO list + keputusan trigger rujukan |
| **Jum, 12/06** | Setup Techstack & UI/UX | Repo + stack + design Stitch semua screen |
| **Sab, 13/06 – Sel, 16/06** | MVP | Screening + Chatbot 50% + Auth + List Psikolog |
| **Rab, 17/06 – Min, 20/06** | Booking, Payment & Polish | Booking + payment mock + chat realtime + catatan sesi + demo |

---

## 16. Open Questions (Belum Diputuskan)

> ⚠️ Keputusan ini **wajib** sebelum Sprint MVP dimulai (12 Juni).

1. **Trigger rujukan ke psikolog** — apakah kombinasi A+B+D yang direkomendasi disetujui?
2. ~~**Data on-chain**~~ ❌ **SKIP — not MVP**, ditunda post-hackathon
3. ~~**Chain pilihan**~~ ❌ **SKIP — not MVP**
4. ~~**Payment MVP**~~ ❌ **DITIADAKAN** (Konsultasi dibuat gratis)
5. ~~**Wallet psikolog**~~ ❌ **SKIP — not MVP**
6. ~~**AI provider** — Claude (Anthropic) atau GPT-4o-mini?~~ ✅ **Diputuskan: Google Gemini** (`gemini-2.5-flash` untuk chat, `gemini-2.5-pro` untuk rangkuman)
7. **Nama produk** — "Ruang" atau ada nama lain?
8. **Jumlah psikolog mitra** — apakah perlu 1 psikolog dummy untuk demo, atau lebih?
9. **Disclaimer krisis** — hotline mana yang ditampilkan? (Yayasan Pulih: 119 ext 8, Into The Light, dll.)
10. **Database screening** — apakah pakai instrumen terstandar (PHQ-9, GAD-7) atau pertanyaan custom?
11. ~~**ORM pilihan** — Prisma atau Drizzle?~~ ✅ **Diputuskan: Prisma** (untuk pemula, lebih banyak tutorial)
12. ~~**Auth library** — NextAuth.js atau Lucia?~~ ✅ **Diputuskan: Auth.js v5 (NextAuth.js)** + Prisma Adapter
13. ~~**Form library** — React Hook Form atau TanStack Form?~~ ✅ **Diputuskan: TanStack Form + Zod** (integrasi resmi shadcn/ui)
14. ~~**Data fetching** — SWR atau React Query?~~ ✅ **Diputuskan: TanStack Query (React Query)**

---

*Dokumen ini adalah living document. Update setiap ada keputusan baru.*
