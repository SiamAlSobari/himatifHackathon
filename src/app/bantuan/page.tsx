"use client"

import React, { useEffect, useState, useRef } from "react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { AppTheme } from "@/lib/types/theme"
import EmergencyBanner from "@/components/bantuan/EmergencyBanner"
import FaqAccordion from "@/components/bantuan/FaqAccordion"
import { animate, stagger } from "animejs"

const faqDataKrisis = [
  {
    question: "Apa yang harus saya lakukan jika merasa ingin menyakiti diri sendiri?",
    answer: "Tolong ingat bahwa Anda sangat berharga dan perasaan ini bisa berlalu. Jangan menghadapinya sendirian. Segera hubungi orang terdekat yang Anda percayai, atau hubungi layanan darurat seperti Layanan Sejiwa (119 ekstensi 8) sekarang juga. Kami di sini mendukung Anda, tetapi mohon segera cari bantuan profesional medis darurat."
  },
  {
    question: "Bagaimana cara membantu teman yang sedang depresi atau ingin bunuh diri?",
    answer: "Jadilah pendengar yang baik tanpa menghakimi. Hindari memberikan nasihat klise seperti 'jangan sedih' atau 'bersyukurlah'. Tanyakan secara langsung dan lembut apakah mereka memiliki niat menyakiti diri sendiri. Jika iya, jangan tinggalkan mereka sendirian, jauhkan benda berbahaya, dan segera bantu mereka menghubungi profesional kesehatan mental atau layanan darurat."
  }
]

const faqDataAplikasi = [
  {
    question: "Bagaimana cara memesan jadwal dengan psikolog?",
    answer: "Anda dapat masuk ke menu 'Konsultasi' di aplikasi, pilih psikolog yang sesuai dengan kebutuhan Anda, lihat profil dan jam kerja mereka, kemudian pilih slot waktu yang tersedia dan konfirmasi jadwal."
  },
  {
    question: "Bagaimana jika saya ingin membatalkan jadwal konsultasi?",
    answer: "Saat ini, jika Anda ingin membatalkan jadwal yang sudah dikonfirmasi, Anda bisa menghubungi admin kami melalui WhatsApp maksimal 24 jam sebelum jadwal dimulai agar kami dapat menyesuaikan antrean."
  },
  {
    question: "Apakah sesi dengan AI Chatbot (Arahkan) bisa menggantikan Psikolog?",
    answer: "Tidak. Chatbot AI kami (Arahkan) dirancang sebagai Pertolongan Pertama Psikologis (PFA) untuk meredakan emosi sesaat dan memberikan validasi. AI tidak memberikan diagnosis medis. Jika Anda membutuhkan penanganan klinis, kami sangat menyarankan Anda menjadwalkan sesi dengan psikolog kami."
  }
]

const faqDataPrivasi = [
  {
    question: "Apakah data cerita dan konsultasi saya dijamin kerahasiaannya?",
    answer: "Ya. Keamanan dan privasi Anda adalah prioritas utama. Verimind menggunakan enkripsi untuk melindungi pesan Anda, dan catatan medis psikolog dilindungi melalui teknologi blockchain (Polygon) untuk memastikan integritas dan kerahasiaan data hanya antara Anda dan psikolog yang menangani."
  }
]

const themeConfig: Record<
  AppTheme,
  {
    textHeader: string
    textDesc: string
    primaryBg: string
    primaryHover: string
    accentText: string
    accentBg: string
    accentBorder: string
    glowShadow: string
    badgeActive: string
    badgeInactive: string
  }
> = {
  calm_blue: {
    textHeader: "text-teal-950",
    textDesc: "text-teal-800/70",
    primaryBg: "bg-teal-600",
    primaryHover: "hover:bg-teal-700",
    accentText: "text-teal-700",
    accentBg: "bg-teal-50",
    accentBorder: "border-teal-100",
    glowShadow: "shadow-teal-600/10",
    badgeActive: "bg-teal-600 text-white shadow-md shadow-teal-600/20 border-teal-600",
    badgeInactive: "bg-white text-teal-800 border-teal-100/80 hover:bg-teal-50/50"
  },
  warm_yellow: {
    textHeader: "text-amber-950",
    textDesc: "text-amber-800/70",
    primaryBg: "bg-amber-600",
    primaryHover: "hover:bg-amber-700",
    accentText: "text-amber-700",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-100",
    glowShadow: "shadow-amber-600/10",
    badgeActive: "bg-amber-600 text-white shadow-md shadow-amber-600/20 border-amber-600",
    badgeInactive: "bg-white text-amber-800 border-amber-100/80 hover:bg-amber-50/50"
  },
  alert_orange: {
    textHeader: "text-orange-950",
    textDesc: "text-orange-800/70",
    primaryBg: "bg-orange-600",
    primaryHover: "hover:bg-orange-700",
    accentText: "text-orange-700",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    glowShadow: "shadow-orange-600/10",
    badgeActive: "bg-orange-600 text-white shadow-md shadow-orange-600/20 border-orange-600",
    badgeInactive: "bg-white text-orange-800 border-orange-100/80 hover:bg-orange-50/50"
  },
  deep_purple: {
    textHeader: "text-indigo-950",
    textDesc: "text-indigo-800/70",
    primaryBg: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",
    accentText: "text-indigo-700",
    accentBg: "bg-indigo-50",
    accentBorder: "border-indigo-100",
    glowShadow: "shadow-indigo-600/10",
    badgeActive: "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border-indigo-600",
    badgeInactive: "bg-white text-indigo-800 border-indigo-100/80 hover:bg-indigo-50/50"
  }
}

export default function BantuanPage() {
  const { theme } = useTheme()
  const cfg = themeConfig[theme] || themeConfig.calm_blue
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("semua")
  
  // Staggered mount animation
  useEffect(() => {
    // Reset opacity & transform to avoid flash of content
    const els = document.querySelectorAll(".anime-mount")
    els.forEach((el) => {
      ;(el as HTMLElement).style.opacity = "0"
      ;(el as HTMLElement).style.transform = "translateY(20px)"
    })

    animate(".anime-mount", {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(60),
      duration: 750,
      easing: "easeOutCubic"
    })
  }, [])

  // Staggered filter update animation
  useEffect(() => {
    animate(".anime-faq-group", {
      opacity: [0, 1],
      translateY: [15, 0],
      delay: stagger(40),
      duration: 500,
      easing: "easeOutCubic"
    })
  }, [searchQuery, activeCategory])

  const contactAdminWhatsApp = () => {
    window.open("https://wa.me/6281234567890?text=Halo%20Admin%20Verimind,%20saya%20butuh%20bantuan...", "_blank")
  }

  const contactAdminEmail = () => {
    window.open("mailto:support@verimind.com?subject=Bantuan%20Verimind", "_blank")
  }

  // FAQ Category definitions with counts
  const faqCategories = [
    {
      id: "krisis",
      title: "Krisis & Penanganan Pertama",
      icon: "emergency",
      items: faqDataKrisis
    },
    {
      id: "aplikasi",
      title: "Penggunaan Aplikasi",
      icon: "phone_android",
      items: faqDataAplikasi
    },
    {
      id: "privasi",
      title: "Privasi & Keamanan Data",
      icon: "shield",
      items: faqDataPrivasi
    }
  ]

  // Filter logic
  const filteredCategories = faqCategories.map(category => {
    const filteredItems = category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return {
      ...category,
      items: filteredItems
    }
  }).filter(category => {
    if (activeCategory !== "semua" && category.id !== activeCategory) {
      return false
    }
    return category.items.length > 0
  })

  const totalFilteredFaqs = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)

  // Get question counts for badges
  const getCategoryCount = (catId: string) => {
    if (catId === "semua") {
      return faqDataKrisis.length + faqDataAplikasi.length + faqDataPrivasi.length
    }
    const found = faqCategories.find(c => c.id === catId)
    return found ? found.items.length : 0
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500 pb-16">
      <div className="max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Header Section */}
        <div className="mb-12 text-center lg:text-left anime-mount">
          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${cfg.textHeader} tracking-tight`}>
            Pusat Bantuan
          </h1>
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 ${cfg.textDesc} leading-relaxed`}>
            Temukan jawaban untuk pertanyaan Anda, informasi kontak dukungan, dan nomor darurat krisis kesehatan mental.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Search, Categories, Live Support Status (Sticky on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-3 space-y-6 lg:sticky lg:top-8 anime-mount">
            
            {/* Search Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className={`font-bold text-sm uppercase tracking-wider text-slate-400 mb-3`}>Cari Bantuan</h3>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 absolute left-4 select-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Ketik pertanyaan Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[var(--primary)] focus:bg-white rounded-2xl text-slate-700 text-sm outline-none transition-all duration-300 placeholder-slate-400 shadow-inner focus:ring-4 focus:ring-[var(--primary)]/10"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 w-7 h-7 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className={`font-bold text-sm uppercase tracking-wider text-slate-400 mb-4`}>Kategori</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: "semua", label: "Semua Pertanyaan", icon: "forum" },
                  { id: "krisis", label: "Krisis & Darurat", icon: "emergency" },
                  { id: "aplikasi", label: "Penggunaan Aplikasi", icon: "phone_android" },
                  { id: "privasi", label: "Privasi & Keamanan", icon: "shield" }
                ].map((cat) => {
                  const isActive = activeCategory === cat.id
                  const count = getCategoryCount(cat.id)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left font-bold text-sm cursor-pointer border transition-all duration-300 ${
                        isActive ? cfg.badgeActive : cfg.badgeInactive
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-xl select-none">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 border border-slate-200/40"
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live Support Status Widget */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm">Dukungan Langsung</h3>
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider">Aktif</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Butuh jawaban cepat? Tim CS kami aktif dan rata-rata merespon dalam kurang dari 10 menit.
              </p>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-base select-none">schedule</span>
                  <span>09:00 - 17:00 WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-base select-none">calendar_today</span>
                  <span>Senin s/d Jumat</span>
                </div>
              </div>
            </div>

          </div>

          {/* MIDDLE COLUMN: Scrollable FAQs */}
          <div className="lg:col-span-7 xl:col-span-5 space-y-6 lg:mt-0 anime-mount">
            {totalFilteredFaqs > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="anime-faq-group">
                  <FaqAccordion title={category.title} items={category.items} />
                </div>
              ))
            ) : (
              /* No Results State */
              <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center shadow-sm anime-faq-group">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 select-none animate-pulse">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-lg mb-2">Tidak ada hasil ditemukan</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
                  Kata kunci &ldquo;<span className="font-bold text-slate-700">{searchQuery}</span>&rdquo; tidak cocok dengan pertanyaan apa pun. Coba kata kunci lain atau pilih kategori di samping.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("semua")
                  }}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-sm text-white transition-all cursor-pointer ${cfg.primaryBg} ${cfg.primaryHover}`}
                >
                  Reset Pencarian
                </button>
              </div>
            )}
            
            {/* Spacer */}
            <div className="h-6 w-full hidden lg:block"></div>
          </div>

          {/* RIGHT COLUMN: Emergency Banner, Contacts, Quick Stats (Sticky on Wide Screens) */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6 xl:sticky xl:top-8 anime-mount">
            
            {/* Emergency Banner */}
            <EmergencyBanner />

            {/* Direct Contact Options */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className={`text-xl sm:text-2xl font-extrabold mb-6 ${cfg.textHeader}`}>Masih Butuh Bantuan?</h2>
              
              <div className="flex flex-col gap-4">
                {/* WhatsApp Support Card */}
                <div 
                  className="group bg-slate-50/50 hover:bg-white border border-slate-200/50 hover:border-green-200 p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  onClick={contactAdminWhatsApp}
                >
                  <div className="w-11 h-11 shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 select-none">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-green-700 transition-colors">Chat via WhatsApp</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Hubungi tim operasional untuk respon cepat jam kerja.
                    </p>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 text-green-600 select-none">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </div>

                {/* Email Support Card */}
                <div 
                  className="group bg-slate-50/50 hover:bg-white border border-slate-200/50 hover:border-blue-200 p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  onClick={contactAdminEmail}
                >
                  <div className="w-11 h-11 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 select-none">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-700 transition-colors">Kirim Email</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pertanyaan administrasi, kemitraan, atau kendala blockchain.
                    </p>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 text-blue-600 select-none">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid Widget */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-3">Komitmen Layanan Kami</h3>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { value: "99.2%", label: "Kepuasan User", desc: "Ulasan positif" },
                  { value: "<10m", label: "Respon Cepat", desc: "Waktu tunggu CS" },
                  { value: "Polygon", label: "Audit On-Chain", desc: "Data medis aman" },
                  { value: "AES-256", label: "Enkripsi Chat", desc: "Privasi terjaga" }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/30 text-center hover:scale-[1.03] transition-transform duration-300 shadow-sm"
                  >
                    <div className={`font-extrabold text-base ${cfg.accentText}`}>{stat.value}</div>
                    <div className="font-bold text-[10px] text-slate-800 mt-1">{stat.label}</div>
                    <div className="text-[9px] text-slate-400">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  )
}
