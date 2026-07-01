
# 🧑‍⚕️ Use Case Diagram — Actor: Psikolog (Psychologist)

> **Fokus:** Semua use case yang dilakukan *Psikolog* saja. User & Sistem tidak dibahas di sini.
>
> Render diagram ini di [PlantUML Editor](https://www.plantuml.com/plantuml/uml/).

---

## Use Case — Psikolog

```plantuml
@startuml
skinparam backgroundColor #F0FFF4
skinparam actorBorderColor #065F46
skinparam actorFontColor #065F46
skinparam actorFontSize 14
skinparam useCaseBorderColor #059669
skinparam useCaseFontColor #1a1a2e
skinparam useCaseBorderThickness 2
skinparam packageBackgroundColor #ECFDF5
skinparam packageBorderColor #059669

left to right direction

actor "🧑‍⚕️ Psikolog\n(Psychologist)" as psikolog

rectangle "🔐 Akun" {
  usecase "UP1" as UP1 "Register Akun Psikolog"
  usecase "UP2" as UP2 "Login Psikolog"
  usecase "UP3" as UP3 "Update Profil Psikolog\n(Foto, Spesialisasi, dll)"
}

rectangle "📋 Onboarding\nProfesional" {
  usecase "UP4" as UP4 "Isi Profesional Profile\n(Role, Spesialisasi, Pengalaman)"
  usecase "UP5" as UP5 "Atur Jam Operasional\n(Slot Waktu Tersedia)"
  usecase "UP6" as UP6 "Atur Tags Keahlian\n(Trauma, Depresi, Kecemasan, dll)"
}

rectangle "📊 Dashboard\nPsikolog" {
  usecase "UP7" as UP7 "Lihat Dashboard\n(Ringkasan Jadwal Hari Ini)"
  usecase "UP8" as UP8 "Lihat Konsultasi Hari Ini\n(Daftar Sesi Terjadwal)"
  usecase "UP9" as UP9 "Lihat Riwayat Konsultasi\n(Tabel History Sesi)"
}

rectangle "📅 Manajemen\nBooking" {
  usecase "UP10" as UP10 "Terima Notifikasi Booking Baru\n(Realtime via Pusher)"
  usecase "UP11" as UP11 "Approve Booking Klien"
  usecase "UP12" as UP12 "Decline Booking Klien"
}

rectangle "💬 Konsultasi" {
  usecase "UP13" as UP13 "Chat Real-time dengan Klien"
  usecase "UP14" as UP14 "Lihat Brief Klien\n(Trend Mood + Summary AI)"
  usecase "UP15" as UP15 "Akhiri Sesi Konsultasi\n(Trigger Blockchain Sync)"
}

rectangle "👥 Klien" {
  usecase "UP16" as UP16 "Lihat Daftar Klien\n(Client List)"
}

' ===== Relasi Psikolog → Use Case =====
psikolog --> UP1
psikolog --> UP2
psikolog --> UP3
psikolog --> UP4
psikolog --> UP5
psikolog --> UP6
psikolog --> UP7
psikolog --> UP8
psikolog --> UP9
psikolog --> UP10
psikolog --> UP11
psikolog --> UP12
psikolog --> UP13
psikolog --> UP14
psikolog --> UP15
psikolog --> UP16

' ===== Include/Extend =====
UP4 ..> UP5 : <<include>>
UP4 ..> UP6 : <<include>>
UP11 ..> UP10 : <<include>>
UP12 ..> UP10 : <<include>>
UP13 ..> UP14 : <<include>>
UP15 ..> UP13 : <<extend>>

note right of UP10
  Booking datang real-time
  via Pusher. Psikolog
  dapat notif langsung
  di dashboard.
end note

note right of UP14
  Brief klien berisi:
  - Tren mood 7 hari
  - Ringkasan AI session
  - Score screening
  Biar psikolog ga perlu
  tanya ulang dari awal.
end note

note right of UP15
  Akhiri sesi → otomatis:
  1. Upload chat ke IPFS
  2. Simpan CID ke DB
  3. Buat transaksi Polygon
  4. Simpan txHash
end note

@enduml
```

---

## Ringkasan Use Case Psikolog

| # | Use Case | Trigger | Output |
|---|----------|---------|--------|
| UP1 | Register Akun Psikolog | Psikolog baru | Akun dengan role PSYCHOLOGY |
| UP2 | Login Psikolog | Kembali pakai | Session JWT |
| UP3 | Update Profil Psikolog | Ganti foto/jam kerja | Profil terupdate |
| UP4 | Isi Profesional Profile | Pertama kali login | Profile lengkap |
| UP5 | Atur Jam Operasional | Atur ketersediaan | Slot waktu tersimpan |
| UP6 | Atur Tags Keahlian | Spesialisasi | Tags untuk filtering |
| UP7 | Lihat Dashboard | Buka dashboard | Ringkasan jadwal + statistik |
| UP8 | Lihat Konsultasi Hari Ini | Persiapan sesi | Daftar sesi hari ini |
| UP9 | Lihat Riwayat Konsultasi | Evaluasi | Table history sesi |
| UP10 | Terima Notif Booking | Ada booking baru | Notif real-time |
| UP11 | Approve Booking | Setuju terima | Status → APPROVED |
| UP12 | Decline Booking | Tidak bisa | Status → DECLINED |
| UP13 | Chat Real-time | Sesi dimulai | Chat dua arah via Pusher |
| UP14 | Lihat Brief Klien | Sebelum chat | Ringkasan kondisi klien |
| UP15 | Akhiri Sesi | Sesi selesai | IPFS + Blockchain sync |
| UP16 | Lihat Daftar Klien | Ingin lihat semua | List klien |

---

## Alur Psikolog — Sederhana (Text Diagram)

```
Login Psikolog → Onboarding Profesional (1x)
              → Dashboard
                   ↓
              Ada Booking Baru? (Realtime Notif)
              ├── Approve → Jadwal masuk daftar konsultasi
              └── Decline → User dapat notif
                   ↓
              Waktu Sesi Tiba → Buka Chat
              ├── Lihat Brief Klien (Mood + Summary AI)
              ├── Chat Real-time dengan Klien
              └── Akhiri Sesi → Blockchain Auto-Sync
                   ↓
              Sesi COMPLETED → Masuk Riwayat
```
