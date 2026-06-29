"use client";

import Image from "next/image";
import React from "react";
import { Check, X, Shield, Brain, Cpu, Users, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <Cpu className="h-6 w-6 text-primary" />,
    title: "Very AI Refleksi 24/7",
    desc: "Obrolan reflektif adaptif yang menyesuaikan pertanyaan berdasarkan pola bahasa dan suasana hati Anda secara real-time.",
  },
  {
    icon: <Brain className="h-6 w-6 text-primary" />,
    title: "Skrining Klinis SRQ-20",
    desc: "Skrining kesehatan mental mandiri yang diakui WHO untuk mengukur tingkat kecemasan, stres, dan kelelahan mental secara objektif.",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Privasi Blockchain & IPFS",
    desc: "Riwayat percakapan dienkripsi secara penuh dan disimpan di IPFS & Polygon Blockchain, menjadikannya absolut aman dan tak dapat dimanipulasi.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Rujukan Psikolog Profesional",
    desc: "Terhubung langsung dengan mitra psikolog klinis profesional berlisensi untuk mendapatkan penanganan lebih dalam jika terdeteksi krisis.",
  },
];

const comparisons = [
  {
    feature: "Konsultasi Instan 24/7",
    verimind: true,
    ordinaryAi: true,
    traditional: false,
  },
  {
    feature: "Skrining Klinis Resmi (WHO SRQ-20)",
    verimind: true,
    ordinaryAi: false,
    traditional: false,
  },
  {
    feature: "Privasi Rekam Medis di Blockchain",
    verimind: true,
    ordinaryAi: false,
    traditional: false,
  },
  {
    feature: "Akses ke Psikolog Berlisensi",
    verimind: true,
    ordinaryAi: false,
    traditional: true,
  },
  {
    feature: "Deteksi & Penanganan Krisis",
    verimind: true,
    ordinaryAi: false,
    traditional: true,
  },
  {
    feature: "Analisis & Adaptasi Emosi Dinamis",
    verimind: true,
    ordinaryAi: false,
    traditional: false,
  },
];

export default function Section2() {
  return (
    <section
      id="kenali"
      className="bg-surface min-h-screen py-20 px-6 overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto w-full space-y-24">
        
        {/* Row 1: Mascot & Mascot Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-reveal">
          {/* Left: Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
              Meet VERY AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Halo, Saya <span className="text-primary transition-colors duration-500">VERY</span> AI
            </h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2D3748]/50">
              Pendamping Refleksi Emosionalmu
            </p>

            <div className="space-y-4 text-[#2D3748]/80 text-base leading-relaxed">
              <p>
                Aku dirancang untuk menemanimu memahami kondisi emosional
                melalui percakapan yang berkembang secara alami. Setiap
                pertanyaan yang kuberikan akan menyesuaikan dengan jawabanmu
                sebelumnya, sehingga setiap sesi terasa lebih personal dan
                bermakna.
              </p>
              <p>
                Aku juga menganalisis pola bahasa yang kamu gunakan untuk
                membantu memberikan gambaran refleksi mengenai kondisi
                emosionalmu, tanpa menghakimi atau mengasumsikan apa pun.
              </p>
            </div>

            {/* Sub-disclaimer */}
            <div className="flex items-start gap-3 bg-background rounded-xl px-4 py-4 border border-slate-100 shadow-sm">
              <div className="w-1 min-h-9 rounded-full bg-primary shrink-0 mt-0.5 transition-colors duration-500" />
              <p className="text-sm text-[#2D3748]/70 font-medium leading-snug">
                VERY AI dirancang untuk memandu refleksi mandiri, bukan mendiagnosis kondisi klinis.
              </p>
            </div>
          </div>

          {/* Right: AI Character Image (Retaining /mommy.jpg as requested) */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm animate-float">
              {/* Floating Wiggling Message bubble */}
              <div className="absolute -top-6 -right-6 z-30 bg-primary text-white p-3.5 rounded-2xl shadow-xl border-2 border-white animate-wiggle-float flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>

              {/* Card */}
              <div
                className="relative bg-background rounded-3xl overflow-hidden border border-primary/10 shadow-premium hover:shadow-xl transition-all duration-300"
                style={{ height: "420px" }}
              >
                <Image
                  src="/mommy.jpg"
                  alt="VERY AI Mascot"
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                {/* Teal accent corner */}
                <div className="absolute bottom-0 right-0 w-14 h-14 bg-primary rounded-tl-2xl z-10 transition-colors duration-500" />
              </div>

              {/* Floating status badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    VERY AI aktif 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Features Grid */}
        <div className="space-y-10 scroll-reveal">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-3xl font-bold text-slate-800">Fitur & Keunggulan Utama</h3>
            <p className="text-sm text-slate-500">
              VeriMind menggabungkan teknologi AI mutakhir, desentralisasi data, dan akses ke tenaga profesional dalam satu platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 space-y-4"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h4 className="text-base font-bold text-slate-800">{feat.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Comparison Section */}
        <div className="space-y-10 scroll-reveal">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-3xl font-bold text-slate-800">Mengapa Memilih VeriMind?</h3>
            <p className="text-sm text-slate-500">
              Lihat bagaimana VeriMind menawarkan solusi yang lebih aman, komprehensif, dan hemat dibandingkan alternatif lain.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100">
                    <th className="py-4 px-6 font-bold text-slate-700">Fitur & Layanan</th>
                    <th className="py-4 px-6 font-bold text-primary text-center">VeriMind</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-center">AI Chatbot Biasa</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-center">Konsultasi Tradisional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisons.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">{item.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {item.verimind ? (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <X className="h-4.5 w-4.5" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.ordinaryAi ? (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <X className="h-4.5 w-4.5" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.traditional ? (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <X className="h-4.5 w-4.5" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
