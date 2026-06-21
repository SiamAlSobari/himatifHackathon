import Image from "next/image";
import React from "react";

const features = [
  {
    label: "24/7",
    desc: "Selalu Siap Mendengarkan",
  },
  {
    label: "AI ADAPTIF",
    desc: "Pertanyaan Menyesuaikan Jawaban",
  },
  {
    label: "REFLEKSI\nPERSONAL",
    desc: "Berdasarkan Pola Bahasa Pengguna",
  },
];

export default function Section2() {
  return (
    <section
      id="kenali"
      className="bg-surface h-screen flex flex-col justify-center px-6 overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 mt-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-5xl font-bold text-foreground mb-3 leading-tight">
              Halo, Saya <span className="text-primary transition-colors duration-500">VERY</span> AI
            </h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2D3748]/50 mb-6">
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
                emosionalmu.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-3 bg-background rounded-xl px-4 py-4 transition-colors duration-500">
              <div className="w-1 min-h-9 rounded-full bg-primary shrink-0 mt-0.5 transition-colors duration-500" />
              <p className="text-sm text-[#2D3748]/70 font-medium leading-snug">
                Bukan untuk mendiagnosis, melainkan membantu kamu lebih mengenal
                dirimu sendiri.
              </p>
            </div>
          </div>

          {/* Right: AI Character Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Card */}
              <div
                className="relative bg-background rounded-2xl overflow-hidden border border-primary/10 transition-colors duration-500"
                style={{ height: "420px" }}
              >
                <Image
                  src="/mommy.jpg"
                  alt="VERY AI"
                  fill
                  className="object-cover object-top"
                />
                {/* Teal accent corner */}
                <div className="absolute bottom-0 right-0 w-14 h-14 bg-primary rounded-tl-2xl z-10 transition-colors duration-500" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-[#0D1B2A]">
                    Online sekarang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards — persis seperti Figma: border hitam, bg putih, radius besar, teks bold besar */}
        <div className="grid grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl px-8 py-8 text-center border-2 border-black/10 hover:border-primary transition-all duration-300"
            >
              <p className="text-3xl font-black text-[#0D1B2A] mb-3 whitespace-pre-line leading-tight tracking-tight">
                {f.label}
              </p>
              <p className="text-sm text-[#2D3748]/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
