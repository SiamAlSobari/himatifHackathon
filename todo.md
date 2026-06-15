# TODO — Hackathon HIMATIF (Ruang / Jembatan Aman)

> **Produk:** Ruang — Platform Pertolongan Pertama Psikologis
> **Mulai:** Kamis, 11 Juni 2026
> **Target Demo:** Minggu, 20 Juni 2026
> **Update terakhir:** Minggu, 14 Juni 2026 (akhir pekan ke-1 MVP)
> **Posisi:** FASE 3 (MVP) — 2 hari lagi sebelum FASE 4 (Booking & Polish)

> ⚠️ **Catatan penting baca dulu:**
> 1. Ada **inkonsistensi nama produk**: PRD & auth pages pakai **"Ruang"**, tapi landing page & dashboard navbar pakai **"Jembatan Aman"**. AI di prompt = **"Lombut AI"**, di `ChatHeader` = **"AURA AI"**. **PUTUSKAN** salah satu sebelum demo.
> 2. UI/UX **tidak dibuat di Stitch** — semua didesain langsung di `tsx` (Tailwind + shadcn). Item Stitch di bawah dinonaktifkan.
> 3. Belum ada folder `prisma/migrations` — `npx prisma migrate dev --name init` **belum dijalankan** (DB belum spin up di kontainer dev).
> 4. `ChatPanel.tsx` **sudah terintegrasi** dengan `/api/ai/chat` & `/api/ai/session` via react-query hooks.
> 5. `schema.prisma` **belum ada** model `Psychologist`, `SessionSummary`, `Appointment`, `ConsultationNote` (model `Payment` ditiadakan karena pricing/billing ditiadakan). Harus ditambah sebelum FASE 4.

---

## Legenda
- `[ ]` belum mulai
- `[x]` selesai
- `[~]` sedang berjalan / sebagian
- `[!]` blocker / butuh keputusan
- `[?]` butuh klarifikasi

---

## FASE 1 — Kamis, 11/06: Breakdown Ide 🧠 ✅ DONE

> **Goal akhir hari ini:** PRD v0.1 selesai + TODO list ini committed + trigger rujukan diputuskan.

### Breakdown & Keputusan
- [x] Tulis `prd.md` draft v0.1
- [x] Tulis `todo.md` (file ini)
- [x] **Keputusan:** Trigger rujukan ke psikolog (kombinasi A+B+D + C sebagai saran)
- [!] **Keputusan:** Data on-chain = ~~hash ringkasan + signature~~ → **SKIP not MVP**
- [!] **Keputusan:** Chain pilihan = ~~Base L2~~ → **SKIP not MVP**
- [x] **Keputusan:** AI provider = **Google Gemini** (`gemini-2.5-flash` chat, fallback `gemini-3.1-flash-lite`; rangkuman/screening pakai model yang sama)
- [x] **Keputusan:** Database = **PostgreSQL lokal via Docker** (rencana migrasi ke VPS post-hackathon)
- [x] **Keputusan:** ORM = **Prisma** + `prisma.config.ts` (generator output ke `generated/prisma`)
- [x] **Keputusan:** Auth library = **Auth.js v5 (NextAuth.js)** dengan **@auth/prisma-adapter**
- [x] **Keputusan:** Form = **TanStack Form** + **Zod** (validator)
- [x] **Keputusan:** Realtime chat solution = **Pusher** (diinstall, integrasi belum)
- [x] **Keputusan:** Nama produk = ~~"Ruang"~~ → **`[!]` Belum final** (UI pakai "Jembatan Aman", PRD pakai "Ruang")
- [x] Distribusikan PRD ke seluruh tim
- [x] Set meeting kick-off untuk besok pagi
- [x] Tentukan pembagian peran awal
- [x] Set repo GitHub + invite anggota tim

---

## FASE 2 — Jumat, 12/06: Setup Techstack & UI/UX 🛠️ ✅ DONE

> **Goal akhir hari ini:** Repo jalan, semua tooling terpasang, design system jadi. ✅ Tercapai.

### Setup Repo
- [x] Inisialisasi Next.js app (single app, langsung di root)
- [x] Setup `.gitignore` ✅
- [ ] Setup branch protection `main`, branch `dev` untuk harian — **belum**
- [x] Tambah `.env.example` ✅
- [x] Setup ESLint ✅

### Frontend
- [x] `npx create-next-app@latest` ✅ Next.js 16, App Router, TypeScript, Tailwind v4
- [x] Install `shadcn/ui` & inisialisasi ✅
- [x] Install semua shadcn components ✅
- [x] Setup folder structure — pakai `src/` (Next 16 + alias `@/*` = `./src/*`)
- [~] Setup fonts — pakai **Geist** (default Next 16), bukan Plus Jakarta/Inter. **Ganti?**
- [ ] Setup theme provider (untuk dynamic theming) — **belum**. `AppThemeEnum` ada, tidak dipakai
- [x] Catatan: Ganti dari npm → **Bun.js** (v1.3.9). `bun run dev` jalan normal ✅

### Backend / API
- [x] Setup API routes di Next.js (`/app/api/...`) ✅
- [~] **Setup PostgreSQL** — `docker-compose.yml` ✅, DB container **belum up** di banyak mesin
- [x] Tulis `docker-compose.yml` ✅
- [~] Setup DB & koneksi — `prisma.config.ts` ✅, `db.ts` pakai `PrismaPg` adapter, tapi **migration belum jalan**
- [x] Install Prisma + `npx prisma init` ✅
- [x] Tulis `schema.prisma` ✅
  - `User`: id, name, email, emailVerified, image, passwordHash?, usia?, jenisKelamin?, kontakDarurat? ✅
  - `Account`, `Session`, `VerificationToken` (adapter) ✅
  - `Screening`: id, userId, score, type (ONBOARDING/DAILY), answer (json) ✅
  - `ChatSession`: id, userId, status (ACTIVE/SEALED/COMPLETED) ✅
  - `ChatMessage`: id, sessionId, role (USER/ASSISTANT), content, metaData (json) ✅
  - `!` **Belum ada:** `Psychologist`, `SessionSummary`, `Appointment`, `ConsultationNote`, `Payment`
- [ ] `npx prisma migrate dev --name init` — **belum jalan**
- [ ] Tulis `seed.ts` untuk psikolog dummy — **belum**
- [x] Setup `.env.example` ✅
- [x] **Setup Auth.js v5** ✅
  - [x] `src/auth.ts` (bukan di root, karena alias `@/* = src/*`)
  - [x] PrismaAdapter + Credentials (email/password, bcrypt 12 salt)
  - [x] Google provider (conditional — aktif kalau `GOOGLE_CLIENT_ID/SECRET` di-set)
  - [x] Session strategy: `database`
  - [x] Route handler `app/api/auth/[...nextauth]/route.ts`
  - [x] `middleware.ts` — protected semua route non-public, public: `/`, `/login`, `/register`
  - [x] `lib/actions/register.ts` (server action, hash + simpan)
  - [x] UI Login/Register (shadcn, dengan Google button)

### AI Integration (Gemini)
- [x] Install SDK: `@google/generative-ai` + `@google/genai` ✅
- [~] Prompt system — **dipisah jadi 3 file di `src/ai/prompts/`** (bukan 1 file `lib/ai/prompts.ts`):
  - [x] `rootPrompt.prompt` — system instruction utama
  - [x] `chat.prompt` — JSON-formatted chat (suggestion + metaData {uiTheme, isCrisis, needPsychologist})
  - [x] `trigger.prompt` — first-message trigger (sapaan awal berdasarkan skor screening)
  - [x] `loader.ts` — file loader dengan cache
- [x] Endpoint `/api/ai/chat` (POST — **belum SSE streaming**)
- [x] Endpoint `/api/ai/session` (GET active + POST create)
- [x] `GEMINI_API_KEY` di `.env.example` (di-load via `envConfig.GeminiApiKey`)
- [ ] Test koneksi & response quality — **belum** (butuh DB + key)

### Smart Contract (skipped — not MVP) ✅
- [x] ~~Install Hardhat + OpenZeppelin~~ ❌ SKIP
- [x] ~~Tulis `ConsultationRegistry.sol`~~ ❌ SKIP
- [x] ~~Script deploy + verifikasi~~ ❌ SKIP

### Wallet Connect (skipped — not MVP) ✅
- [x] ~~Install `wagmi` + `viem` + `@rainbow-me/rainbowkit`~~ ❌ SKIP
- [x] ~~Halaman `/psychologist/wallet`~~ ❌ SKIP

### UI/UX di Stitch — TIDAK DILAKUKAN
> **Keputusan:** Desain UI/UX **langsung di `tsx` (Tailwind + shadcn)**, bukan Stitch. Item-item di bawah dinonaktifkan.
- [x] ~~Semua 18 screen di Stitch~~ → didesain langsung di komponen
- [x] ~~Design tokens 3 tema di Stitch~~ → sementara hardcode warna di `tsx`

### Lock MVP Scope
- [x] Finalisasi fitur MVP: Auth, Screening, Chatbot, List Psikolog, Booking (mock) ✅
- [x] Finalisasi NON-MVP: ❌ Web3/Smart Contract, Wallet Connect — skip ✅
- [~] Finalisasi post-MVP: Payment asli, Catatan Psikolog lengkap, Analytics — sebagian

---

## FASE 3 — Sabtu 13/06 – Selasa 16/06: MVP 🧱 ⏳ IN PROGRESS

> **Goal akhir fase:** Sesi bisa dilakukan end-to-end: daftar → screening → chatbot 50%. Tidak perlu sempurna.
> **Status hari ini (Min 14/06):** Backend AI + screening **siap**. Frontend **belum tersambung**.

### Auth (Sab, 13/06) ✅ SEBAGIAN BESAR
- [x] Halaman sign up + login ✅ (`(auth)/login`, `(auth)/register`)
- [ ] Hook `useAuth` (session management) — **tidak dipakai**, pakai `auth()` server-side + `signIn()` client-side dari `next-auth/react`
- [x] Protected routes middleware ✅
- [x] ~~Onboarding 5 pertanyaan (mini screening)~~ → **dilewati**, screening langsung di `/screening`
- [x] Simpan profil ke Postgres (via Prisma) ✅ (register action + Auth.js adapter)
- [!] **Inkonsistensi:** `register.ts` server action masih expect field `usia` & `jenisKelamin` di form, tapi `register-form.tsx` **sudah hapus** field itu. Akan selalu `null` di DB.

### Screening Awal (Sab, 13/06 – Min, 14/06) ⏳ 40% DONE
- [~] Halaman screening onboarding (7 Q) — **PARTIAL**:
  - [x] Step 1: Mood selector (6 opsi emoji) — visual ✅
  - [x] 4 pertanyaan didefinisikan di `lib/constants/questions.ts` (4, bukan 7)
  - [x] 4 answer options (Likert 0-3) ✅
  - [ ] Step 2-7: Multi-step form dengan Q1-Q4 (atau lebih) — **belum dibangun**
  - [ ] Save progress antar step — **belum**
- [x] Logika scoring (skor per-dimensi + kategori) — `ScreeningService.calculateScreeningScore` ✅
- [x] Simpan ke `Screening` table — `ScreeningService.saveScreeningResult` + repo ✅
- [~] **Dynamic theming** — backend ✅ (return `AppThemeEnum` di result), frontend **belum apply** ke UI
- [ ] CTA post-screening: "Mulai sesi AI" / "Lihat riwayat" — **belum**
- [ ] Screening harian (3 Q) + reminder — **belum**

### AI Chatbot (Min, 14/06 – Sel, 16/06) — target 50% ⏳ 35% DONE
- [~] Halaman chatbot: sidebar sesi + chat area
  - [x] Layout 3-kolom: ChatPanel + SummarySidebar ✅
  - [x] Komponen: `ChatHeader`, `ChatBubble`, `ChatInput`, `DateDivider`, `Datedivider`, `DeleteDivider`, `LevelIndicator`, `SummarySidebar`, `WellbeingScoreCard`, `SymptomAnalysis`, `Symptomitem`, `AiSuggestionCard`, `Emergencyhelpsection`
  - [x] `Navbar` dengan menu Home/Kenali/Validasi
  - [ ] **Sidebar sesi (riwayat chat)** — **belum ada**. Komponen `DeleteDivider` ada tapi isinya duplikat `ChatInput` (perlu cek/rename)
  - [x] `ChatPanel` **sudah terintegrasi** dengan `/api/ai/chat` & `/api/ai/session` via hooks ✅
- [x] Endpoint `/api/chat/sessions` (list, create, get) — `api/ai/session/route.ts` (GET active + POST create) ✅
- [x] Endpoint `/api/chat/messages` (post, stream) — `api/ai/chat/route.ts` POST ✅ (belum SSE)
- [x] **Inisiasi AI:** `chat.service.ts` deteksi first message, load `trigger.prompt`, inject `{{ui_theme}}` dari skor screening ✅
- [x] Prompt AI: validation, reflection, no-medical-advice — `rootPrompt.prompt` + `chat.prompt` ✅
- [x] JSON contract: `{ suggestion, metaData: { uiTheme, isCrisis, needPsychologist } }` ✅
- [x] Parser: `AIResponseFormatter` di `lib/utils.ts` (handle markdown ```json) ✅
- [ ] **Streaming response (SSE)** — **belum** (return JSON utuh)
- [ ] Tutup sesi → generate ringkasan → simpan ke `SessionSummary` — **belum** (model `SessionSummary` belum ada di schema)
- [~] **Crisis detection** (keyword-based) — di prompt ✅, button "Butuh Bantuan Segera?" di `Emergencyhelpsection` ✅, **belum integrated** dengan deteksi AI
- [ ] Riwayat sesi: list + detail — **belum**

### Psikolog List (Sel, 16/06) ⏳ 0% DONE
- [ ] Tambah model `Psychologist` ke `schema.prisma` — **belum**
- [ ] Seed data 3 psikolog dummy — **belum** (no `seed.ts`)
- [ ] Halaman list psikolog (filter spesialisasi) — belum (pricing/billing ditiadakan)
- [ ] Halaman detail psikolog — **belum**
- [ ] (Belum payment, belum booking — masuk FASE 4)

### Polish & Bug Fix (Sel, 16/06 malam) ⏳ 0% DONE
- [ ] Responsive check (mobile-first) — landing pakai `h-screen` di section, perlu dicek di mobile
- [ ] Empty states & loading states — sebagian (`loading` di login/register form)
- [ ] Error handling dasar — di API pakai `errorResponse()` ✅; UI error pakai `Alert`
- [ ] Demo flow rehearsal — **belum**

---

## FASE 4 — Rabu 17/06 – Minggu 20/06: Booking, Payment & Polish 🎯 ⏳ NOT STARTED

> **Goal akhir fase:** End-to-end booking berjalan, demo siap dipresentasikan.

### ⏸️ Smart Contract & Wallet Connect — SKIP (not MVP) ✅
> Web3 dikerjakan post-hackathon. Fokus ke fitur utama dulu.

### Schema Additions (RAB, 17/06) ⏳ 0% DONE
> Harus ditambah SEBELUM booking agar tidak refactor besar di tengah jalan.
- [ ] Tambah `Psychologist` model: id, name, email, spesialisasi, bio, foto, rating, verified (hargaPer30 & hargaPer60 ditiadakan)
- [ ] Tambah `SessionSummary` model: id, chatSessionId, content, uiTheme, createdAt
- [ ] Tambah `Appointment` model: id, userId, psychologistId, scheduledAt, durationMin, status (pending_psychologist/confirmed/declined/completed)
- [ ] Tambah `ConsultationNote` model: id, appointmentId, psychologistId, content, createdAt
- [ ] ~~Tambah Payment model~~ ❌ SKIP (pricing/billing ditiadakan)
- [ ] `npx prisma migrate dev --name add_booking_models`
- [ ] Tulis `prisma/seed.ts` untuk psikolog dummy

### Booking & Konsultasi (Jum, 19/06) ⏳ 0% DONE
- [ ] Halaman booking: pilih slot
- [x] **Keputusan:** payment ditiadakan untuk MVP (sudah diputuskan ✅)
- [ ] Status flow: `pending_psychologist` → `confirmed` / `declined`
- [ ] Notifikasi ke psikolog (in-app)
- [ ] ~~Halaman payment mock~~ ❌ SKIP (pricing/billing ditiadakan)

### Chat Real-time dengan Psikolog (Jum, 19/06) ⏳ 0% DONE
- [x] Library Pusher terinstall ✅ (belum dipakai)
- [ ] Setup Pusher client + server wrapper (`lib/pusher.ts`)
- [ ] Channel chat per appointment (`appointment-{id}`)
- [ ] UI chat dua arah (klien & psikolog) — base-nya bisa reuse `ChatPanel` + `ChatBubble`
- [ ] Catatan pasca-sesi (psychologist only) — model `ConsultationNote`

### Dashboard Psikolog (Jum, 19/06) ⏳ 0% DONE
- [ ] Route group `(psychologist)` dengan layout sendiri
- [ ] Antrian janji (pending, upcoming, completed)
- [ ] Detail klien + brief (screening + ringkasan AI)
- [ ] Tanda tangan digital sesi → **SKIP** (on-chain bukan MVP)

### Polish & Demo Prep (Sab, 20/06) ⏳ 0% DONE
- [ ] **PUTUSKAN** nama produk: "Ruang" atau "Jembatan Aman"? Konsisten di semua file
- [ ] **PUTUSKAN** nama AI: "Lombut" atau "AURA"? Konsisten di prompt + UI
- [ ] **FIX**: `register.ts` server action field `usia` & `jenisKelamin` (sudah dihapus dari form)
- [ ] **FIX**: `ChatPanel` konek ke `/api/ai/chat` & `/api/ai/session`
- [ ] **FIX**: Dynamic theming — apply `AppThemeEnum` ke `globals.css` atau `<body>` class
- [ ] **FIX**: `DeleteDivider.tsx` isinya duplikat `ChatInput` (rename atau hapus)
- [ ] **FIX**: Halaman screening multi-step (Q1-Q4 minimal)
- [ ] **FIX**: Sidebar riwayat chat di `/chat`
- [ ] End-to-end test semua flow
- [ ] Bug fix terakhir
- [ ] Siapkan script demo (5 menit):
  1. Sign up + screening (1 menit)
  2. Chatbot sesi (1.5 menit)
  3. Booking langsung (1 menit)
  4. Psikolog lihat brief klien (1.5 menit)
- [ ] Siapkan slide pitch deck (5–7 slide)
- [ ] Rekam video demo (backup)
- [ ] Final check deploy (Vercel)

---

## Backlog (Post-Hackathon) 📦

> Tidak masuk MVP, simpan untuk iterasi selanjutnya.

- [ ] **Migrasi database ke VPS** (dump & restore Postgres, update `DATABASE_URL` di env VPS)
- [ ] Setup managed Postgres di VPS (backup otomatis, monitoring)
- [ ] OAuth Google (sudah aktif kalau env di-set, tinggal test penuh)
- [ ] Payment gateway asli (Midtrans/Xendit) — saat ini stub
- [ ] Onboarding psikolog baru (verifikasi SIPP/STR)
- [ ] Analytics dashboard (admin)
- [ ] Notifikasi push (reminder screening, jadwal konsultasi)
- [ ] Multi-bahasa (English)
- [ ] Voice/video call (advanced)
- [ ] Grup support (anonim)
- [ ] Standar instrumen screening (PHQ-9, GAD-7) replace custom — saat ini pakai 4 Q custom
- [ ] AI fine-tuning dengan data profesional
- [ ] Mobile app (React Native)
- [ ] On-chain hash konsultasi + signature psikolog
- [ ] Wallet connect psikolog
- [ ] SSE streaming untuk `/api/ai/chat` (sekarang return JSON utuh)
- [ ] Switch font ke Plus Jakarta Sans / Inter (opsional)
- [ ] Encrypt chat messages at-rest (AES-256) sesuai NFR PRD

---

## 📦 Daftar Library yang Harus Diinstall

> Semua library **sudah terinstall** (cek `package.json`). Tinggal integrasi & testing.

### Library ter-install (verified di `package.json`)
```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.2",
    "@google/genai": "^2.8.0",
    "@google/generative-ai": "^0.24.1",
    "@prisma/adapter-pg": "^7.8.0",
    "@tanstack/react-form": "^1.33.0",
    "@tanstack/react-query": "^5.101.0",
    "@tanstack/react-query-devtools": "^5.101.0",
    "bcrypt": "^6.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^1.17.0",
    "next": "^16.2.9",
    "next-auth": "^5.0.0-beta.31",
    "next-themes": "^0.4.6",
    "prisma": "^7.8.0",
    "pusher": "^5.3.4",
    "pusher-js": "^8.5.0",
    "react": "^19.2.7",
    "react-day-picker": "^10.0.1",
    "react-dom": "^19.2.7",
    "react-resizable-panels": "^4.11.2",
    "recharts": "^3.8.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.14"
  }
}
```

### Catatan tambahan
- ❌ **SKIP** Web3: `wagmi`, `viem`, `@rainbow-me/rainbowkit`, `hardhat`, `@openzeppelin/contracts` → tidak diinstall
- ❌ **SKIP** Payment asli: `midtrans-client`, `xendit-node` → tidak diinstall
- ❌ **SKIP** Testing: `vitest`, `@testing-library/*`, `playwright` → tidak diinstall (opsional post-MVP)
- ✅ **Runtime:** Bun.js (v1.3.9). `bun run dev` jalan normal.
- ✅ **Generated Prisma client** di `generated/prisma/` (bukan `node_modules/.prisma/client`)

---

## 🐛 Discrepancy Log (yang harus difix)

> Ditemukan saat review codebase tgl 14/06. Fix SEBELUM demo.

1. **Nama produk tidak konsisten**
   - PRD: "Ruang"
   - Login/Register page: "Ruang"
   - `landingpage/navbar.tsx`, `footer.tsx`, `(auth)/layout.tsx`, `ui/Navbar.tsx`: "Jembatan Aman"
   - **Fix:** Ganti salah satu, search-replace global.

2. **Nama AI tidak konsisten**
   - `rootPrompt.prompt`, `chat.prompt`, `trigger.prompt`: "Lombut AI"
   - `landingpage/section2.tsx`: "LOMBUT AI"
   - `chat/ChatHeader.tsx`: "AURA AI"
   - **Fix:** Pilih satu (recommend "Lombut" karena sudah konsisten di prompt).

3. **`register.ts` field `usia` & `jenisKelamin` fixed** ✅
   - Server action baca `formData.get("usia")` & `"jenisKelamin")` sudah dihapus dari server action registerUser.

4. **`ChatPanel.tsx` tidak konek API fixed** ✅
   - `useState<Message[]>(initialMessages)` sudah dihapus, beralih ke react-query hooks `useCreateChatSession` dan `useSendChatMessage`.

5. **`DeleteDivider.tsx` isinya duplikat `ChatInput`**
   - Kemungkinan salah nama/rename yang kelupaan.
   - **Fix:** Cek git diff, atau hapus file ini (delete divider bisa dibuat inline).

6. **Dynamic theming backend ready, frontend tidak apply**
   - `ScreeningService` return `AppThemeEnum` (calm_blue/warm_yellow/alert_orange/deep_purple).
   - `globals.css` cuma punya `--background` & `--foreground` putih/hitam.
   - **Fix:** Tambah CSS variables untuk 4 tema di `globals.css`, apply via `<body data-theme="...">` atau Zustand store.

7. **Halaman screening cuma 1 step**
   - Plan: 7 Q. Realita: 1 mood selector + 4 Q di constants (belum ada UI).
   - **Fix:** Bikin multi-step form (Mood → Q1 → Q2 → Q3 → Q4 → Result). Bisa pakai `useState<step>` atau library `react-day-picker`-style.

8. **Belum ada folder `prisma/migrations`**
   - DB tidak punya tabel, app bakal crash saat pertama call Prisma.
   - **Fix:** `docker compose up -d` lalu `bunx prisma migrate dev --name init`.

9. **Schema belum lengkap untuk FASE 4**
   - Tidak ada `Psychologist`, `SessionSummary`, `Appointment`, `ConsultationNote`, `Payment`.
   - **Fix:** Tambah sebelum FASE 4 dimulai (lihat list di FASE 4 > Schema Additions).

10. **Pusher terinstall, belum dipakai**
    - Dependency ada di `package.json`, tidak ada file `lib/pusher.ts` atau import.
    - **Fix:** Buat wrapper + channel per appointment saat FASE 4.

11. **Geist font, bukan Plus Jakarta/Inter**
    - PRD rencanakan Plus Jakarta/Inter. Realita: pakai Geist (default Next 16).
    - **Fix (opsional):** Ganti di `layout.tsx` kalau ada waktu.

---

## Catatan Penting 📌

1. **Privasi & Keamanan** — ini app kesehatan mental. Data PII dienkripsi, access control ketat, audit log. (Encryption at-rest belum diimplementasi → backlog)
2. **Crisis Safety** — selalu tampilkan hotline emergency saat keyword krisis terdeteksi. TIDAK BOLEH AI diagnosa.
3. **Demo First** — fokus ke demo flow yang mulus. Fitur tersier di-backlog.
4. **Scope Lock** — setelah 12 Juni, **tidak ada fitur baru** masuk MVP. Tulis di backlog.
5. **Daily Standup** — 15 menit, 09.00 pagi. Apa yang dikerjakan kemarin, hari ini, blocker.
6. **Git Hygiene** — PR review sebelum merge `dev` → `main`. Commit message jelas.

---

*Update file ini setiap hari. Coret checklist, tambahin temuan baru.*
