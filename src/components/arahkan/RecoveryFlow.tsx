"use client"

interface RecoveryFlowProps {
  latestScreeningScore: number | null
  appointment: {
    scheduledAt: string
    psychologist: { name: string }
  } | null
  formatDate: (dateStr: string) => string
}

export default function RecoveryFlow({
  latestScreeningScore,
  appointment,
  formatDate,
}: RecoveryFlowProps) {
  return (
    <div className="bg-white border border-[#bfc8c9]/40 rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs font-bold text-[#3f484a] uppercase tracking-wider mb-5">
        Alur Pemulihan Anda
      </h4>

      <div className="space-y-0">
        {/* Step 1: Deteksi Awal (always completed) */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className="material-symbols-outlined text-[#004349] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div className="w-px flex-1 bg-[#004349]" />
          </div>
          <div className="pb-5">
            <p className="text-sm font-bold text-[#0b1c30] leading-tight">Deteksi Awal</p>
            <p className="text-xs text-[#6f797a] mt-0.5 font-medium">
              Kuesioner PHQ-9 selesai.
            </p>
            {latestScreeningScore !== null && (
              <p className="text-[10px] text-[#004349] font-bold mt-0.5">
                Skor Terakhir: {latestScreeningScore}
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Pilih Pendamping */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            {appointment ? (
              <span
                className="material-symbols-outlined text-[#004349] text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            ) : (
              <div className="w-5 h-5 border-2 border-[#004349] rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#004349] rounded-full" />
              </div>
            )}
            <div className={`w-px flex-1 ${appointment ? "bg-[#004349]" : "bg-[#bfc8c9]/50"}`} />
          </div>
          <div className="pb-5">
            <p className="text-sm font-bold text-[#0b1c30] leading-tight">Pilih Pendamping</p>
            <p className="text-xs text-[#6f797a] mt-0.5 font-medium">
              {appointment
                ? `Telah memilih: ${appointment.psychologist.name.split(",")[0]}`
                : "Sedang memproses daftar ahli..."}
            </p>
          </div>
        </div>

        {/* Step 3: Konsultasi Pertama */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 border-2 rounded-full ${
                appointment ? "border-[#004349]" : "border-[#bfc8c9]"
              }`}
            />
          </div>
          <div>
            <p className={`text-sm font-bold leading-tight ${appointment ? "text-[#0b1c30]" : "text-[#bfc8c9]"}`}>
              Konsultasi Pertama
            </p>
            <p className={`text-xs mt-0.5 font-medium ${appointment ? "text-[#004349] font-bold" : "text-[#bfc8c9]"}`}>
              {appointment
                ? formatDate(appointment.scheduledAt)
                : "Jadwalkan sesi perdana."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
