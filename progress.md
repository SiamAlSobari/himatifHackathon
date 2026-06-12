# Progress — Ruang

> **Hackathon:** HIMATIF Hackathon
> **Tim:** Fiki (PPLG 2), Abshors (PPLG 2)

---

## Fase 1 — Kamis, 11 Juni 2026

- **2026-06-11 20:00 WIB:** PRD v0.1 selesai ditulis. Mencakup 3 pilar utama (Kenali, Validasi, Arahkan), user stories, spesifikasi fitur, tech stack, arsitektur data on-chain/off-chain, roadmap, dan open questions.
- **2026-06-11 21:30 WIB:** TODO list dibuat sebagai panduan pengerjaan per fase (Fase 1–4 + Backlog). Ada 437 baris checklist lengkap dengan daftar library yang harus diinstall.

---

## Fase 2 — Jumat, 12 Juni 2026

- **2026-06-12 09:00 WIB:** Kick-off meeting. Stack: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Prisma + PostgreSQL + Auth.js v5 + Google Gemini + Pusher. Web3 (smart contract + wallet connect) diputuskan **skip — not MVP**. Alasan: fokus ke fitur utama dulu, Web3 dikerjakan post-hackathon.
- **2026-06-12 10:30 WIB:** `create-next-app` di-root folder project (bukan subfolder). Next.js 16 dengan App Router, TypeScript, Tailwind v4, ESLint.
- **2026-06-12 11:00 WIB:** Semua shadcn/ui component terinstall (button, input, form, card, dialog, sheet, tabs, toast, dll — 30+ komponen).
- **2026-06-12 12:00 WIB:** Library dependencies terinstall:
  - TanStack Form + Zod (form & validasi)
  - TanStack Query + Zustand (data fetching & state)
  - Prisma + Prisma Client (ORM, schema sudah ditulis)
  - Auth.js v5 + `@auth/prisma-adapter` + bcrypt (auth)
  - `@google/generative-ai` (AI chatbot)
  - Pusher + pusher-js (realtime chat nanti)
  - lucide-react, date-fns, clsx, framer-motion, sonner (utilitas UI)
  - prettier, husky, lint-staged (dev tools)
- **2026-06-12 12:30 WIB:** `.env.example` & `.env.local` ditulis dengan placeholder semua API keys.
- **2026-06-12 13:00 WIB:** Prisma diinit + schema awal (hanya `User`, `AuthSession`, `AuthAccount` — model lain nanti konfirmasi tim). Catatan: Turbopack gak support platform, pake `npm run dev:wp` (webpack).
- **2026-06-12 13:30 WIB:** `prd.md` & `todo.md` diupdate sesuai progress. Web3 ditandai explicit NOT MVP di kedua dokumen.
- **2026-06-12 14:00 WIB:** `progress.md` dibuat (file ini). Semua keputusan & progress dicatat dengan timestamp WIB.
- **2026-06-12 15:00 WIB:** Schema Prisma diupdate pakai model adapter-compatible (User, Account, Session, VerificationToken). Biar cocok sama `@auth/prisma-adapter`. `passwordHash` dibuat nullable (buat nampung Google login nanti).
- **2026-06-12 15:30 WIB:** Auth.js v5 setup:
  - `auth.ts` (root) — konfigurasi PrismaAdapter + Credentials (email/password, bcrypt) + Google (conditional, tunggu API key)
  - Route handler `app/api/auth/[...nextauth]/route.ts`
  - Helper `lib/auth.ts`
  - Middleware `middleware.ts` — protected: `/dashboard`, public: `/`, `/login`, `/register`
- **2026-06-12 16:00 WIB:** UI auth:
  - Halaman login: form email + password, divider Google (muncul kalau `NEXT_PUBLIC_GOOGLE_ENABLED=true`)
  - Halaman register: nama, email, password
  - Dashboard sederhana (protected) — cuma nampilin nama + tombol keluar
  - Landing page polosan dengan tombol Masuk / Daftar
  - Server action register: hash password (bcrypt, 12 salt rounds), simpan ke DB
- **2026-06-12 16:30 WIB:** Fix auth.ts path. `auth.ts` dipindah dari root ke `src/auth.ts` karena `@/*` alias = `./src/*`. `src/lib/auth.ts` (re-export) dihapus, semua import langsung ke `@/auth`. Build aman.
- **2026-06-12 17:00 WIB:** Google login disederhanakan. Button Google selalu tampil (tanpa flag `NEXT_PUBLIC_GOOGLE_ENABLED`). Tinggal isi `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` di `.env.local` — langsung nyambung.
- **2026-06-12 17:00 WIB:** Usia & jenis kelamin dihapus dari form register. Nanti diisi user pas onboarding.
- **2026-06-12 17:30 WIB:** Switch dari npm ke **Bun.js** (v1.3.9) sebagai package manager & runtime. Alasan: Turbopack/SWC binary npm corrupted di platform ini, Bun handle native bindings lebih baik. `npm run dev` error, `bun run dev` jalan normal.

---

## Keputusan Teknis Utama

| Keputusan | Pilihan | Alasan |
|-----------|---------|--------|
| **Framework** | Next.js 16 (App Router) | Versi terbaru, stabil, ekosistem luas |
| **Styling** | Tailwind v4 + shadcn/ui | Cepat, komponen siap pakai, konsisten |
| **ORM** | Prisma | Type-safe, migrasi mudah, dokumentasi luas |
| **Database** | PostgreSQL (native / Docker) | Fleksibel, siap migrasi kapan aja |
| **Auth** | Auth.js v5 + Prisma adapter | Standar industri Next.js, integrasi native |
| **Form** | TanStack Form + Zod | Type-safe, headless, integrasi resmi shadcn |
| **State** | TanStack Query + Zustand | Cache + global state yang ringan |
| **AI** | Google Gemini (flash + pro) | Cepat, murah, konteks panjang, streaming |
| **Realtime** | Pusher | Managed service, setup simpel |
| **Blockchain** | ❌ Skip (not MVP) | Fokus ke fitur inti dulu |
| **Payment** | Mock/stub untuk MVP | Gak perlu gateway asli buat demo |
