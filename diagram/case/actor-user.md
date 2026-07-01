
# 🧑 Use Case Diagram — Actor: User (Pengguna)

> **Fokus:** Semua use case yang dilakukan *User/Pengguna* saja. Sistem & Psikolog tidak dibahas di sini.
>
> Render diagram ini di [PlantUML Editor](https://www.plantuml.com/plantuml/uml/).

---

## Use Case — User

```plantuml
@startuml
skinparam backgroundColor #F0F8FF
skinparam actorBorderColor #004349
skinparam actorFontColor #004349
skinparam actorFontSize 14
skinparam useCaseBorderColor #2563EB
skinparam useCaseFontColor #1a1a2e
skinparam useCaseBorderThickness 2
skinparam packageBackgroundColor #EFF6FF
skinparam packageBorderColor #2563EB

left to right direction

actor "👤 User\n(Pengguna)" as user

rectangle "🔐 Akun" {
  usecase "UC1" as UC1 "Register Akun\n(Email + Password)"
  usecase "UC2" as UC2 "Login\n(Email/Google)"
  usecase "UC3" as UC3 "Reset Password\n(Lupa Password)"
  usecase "UC4" as UC4 "Update Profil\n(Foto, Nama, No. HP)"
}

rectangle "📋 Onboarding &\nScreening" {
  usecase "UC5" as UC5 "Isi Data Diri Awal\n(Usia, Gender, Kontak Darurat)"
  usecase "UC6" as UC6 "Jawab Screening Harian\n(7 Pertanyaan PHQ-9/GAD-7)"
  usecase "UC7" as UC7 "Lihat Riwayat Screening\n(Score + Grafik Mood)"
  usecase "UC8" as UC8 "Lihat Detail Screening\n(Anxiety, Stress, Kategori)"
}

rectangle "🤖 Chat AI\n(Very AI)" {
  usecase "UC9" as UC9 "Mulai Sesi Chat\n(New Chat Session)"
  usecase "UC10" as UC10 "Kirim Pesan ke Very AI"
  usecase "UC11" as UC11 "Terima Respons AI\n(Streaming Real-time)"
  usecase "UC12" as UC12 "Lihat Ringkasan Sesi\n(Setelah Sesi Selesai)"
  usecase "UC13" as UC13 "Validasi Darurat\n(AI Deteksi Krisis → Modal)"
}

rectangle "📅 Booking &\nKonsultasi" {
  usecase "UC14" as UC14 "Cari & Lihat Profil Psikolog"
  usecase "UC15" as UC15 "Booking Jadwal Psikolog"
  usecase "UC16" as UC16 "Chat Real-time dengan Psikolog"
  usecase "UC17" as UC17 "Lihat Riwayat Konsultasi\n(Sesi Selesai)"
}

rectangle "📊 Dashboard &\nNavigasi" {
  usecase "UC18" as UC18 "Lihat Dashboard Utama\n(Ringkasan Mood, Jadwal, Skor)"
  usecase "UC19" as UC19 "Akses Halaman Bantuan\n(FAQ, Layanan Darurat)"
  usecase "UC20" as UC20 "Lihat Notifikasi\n(Booking, Reminder, dll)"
}

' ===== Relasi User → Use Case =====
user --> UC1
user --> UC2
user --> UC3
user --> UC4
user --> UC5
user --> UC6
user --> UC7
user --> UC8
user --> UC9
user --> UC10
user --> UC12
user --> UC13
user --> UC14
user --> UC15
user --> UC16
user --> UC17
user --> UC18
user --> UC19
user --> UC20

' ===== Include/Extend =====
UC9 ..> UC10 : <<include>>
UC10 ..> UC11 : <<include>>
UC15 ..> UC14 : <<include>>
UC15 ..> UC16 : <<extend>>\n(setelah approve)

note right of UC13
  Ketika AI mendeteksi
  krisis / score >= 14
  → redirect ke halaman
  validasi darurat
end note

note right of UC15
  Booking → PENDING
  tunggu approve psikolog
  baru bisa chat
end note

@enduml
```

---

## Ringkasan Use Case User

| # | Use Case | Trigger | Output |
|---|----------|---------|--------|
| UC1 | Register Akun | User baru | Akun tersimpan di DB |
| UC2 | Login | Kembali pakai | Session JWT |
| UC3 | Reset Password | Lupa password | Email reset link |
| UC4 | Update Profil | Mau ganti foto/nama | Profil terupdate |
| UC5 | Isi Data Diri | Pertama kali | `isOnboarded = true` |
| UC6 | Screening Harian | Setiap hari | Score + Theme |
| UC7 | Lihat Riwayat Screening | Ingin lihat progres | Grafik mood chart |
| UC8 | Lihat Detail Screening | Ingin detail | Anxiety/stress breakdown |
| UC9 | Mulai Sesi Chat | Ingin curhat ke AI | ChatSession baru |
| UC10 | Kirim Pesan | Mengetik pesan | Streaming AI response |
| UC11 | Terima Respons AI | AI selesai proses | Teks real-time via Pusher |
| UC12 | Lihat Ringkasan Sesi | Sesi COMPLETED | Summary text |
| UC13 | Validasi Darurat | Krisis terdeteksi | Emergency modal + redirect |
| UC14 | Cari Psikolog | Ingin lihat opsi | Daftar psikolog + rating |
| UC15 | Booking Psikolog | Pilih jadwal | Appointment PENDING |
| UC16 | Chat Psikolog | Booking approved | Chat real-time |
| UC17 | Riwayat Konsultasi | Sesi selesai | Chat history |
| UC18 | Dashboard | Buka app | Ringkasan kondisi |
| UC19 | Bantuan | Butuh info darurat | FAQ + kontak krisis |
| UC20 | Notifikasi | Ada update | Toast/list notif |

---

## Alur User — Sederhana (Text Diagram)

```
Landing → Login/Register
       → Onboarding (1x)
       → Screening (harian)
            ↓
       Score < 14? → Arahkan (pilih):
       │               ├─ Chat Very AI → Kirim pesan → Streaming → Summary → [Booking?]
       │               ├─ Booking Psikolog → Pilih → Tunggu Approve → Chat
       │               ├─ Bantuan (FAQ Krisis)
       │               └─ Dashboard (Mood chart, Riwayat)
       │
       Score >= 14? → Validasi Darurat → Emergency modal → Hubungi 119
```
