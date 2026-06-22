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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover-lift shadow-premium transition-all duration-300 hover:border-primary/20">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
        Alur Pemulihan Anda
      </h4>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center border-2 border-primary">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <div className="w-px flex-1 bg-primary" />
          </div>
          <div className="pb-4">
            <p className="text-sm font-bold text-foreground leading-tight">Deteksi Awal</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Skrining harian untuk menganalisis kondisi emosional Anda.
            </p>
            {latestScreeningScore !== null && (
              <p className="text-[10px] text-primary font-bold mt-0.5">
                Skor Terakhir: {latestScreeningScore} / 21
              </p>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${appointment ? "bg-teal-50 border-primary" : "bg-white border-slate-200"}`}>
              {appointment ? (
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              ) : (
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              )}
            </div>
            <div className={`w-px flex-1 ${appointment ? "bg-primary" : "bg-slate-200"}`} />
          </div>
          <div className="pb-4">
            <p className="text-sm font-bold text-foreground leading-tight">Pilih Pendamping</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Pilih dan hubungi psikolog spesialis yang sesuai dengan rekomendasi kami.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                appointment ? "bg-teal-50 border-primary" : "bg-white border-slate-200"
              }`}
            >
              {appointment ? (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              )}
            </div>
          </div>
          <div>
            <p className={`text-sm font-bold leading-tight ${appointment ? "text-foreground" : "text-slate-300"}`}>
              Mulai Sesi
            </p>
            <p className={`text-xs mt-0.5 font-medium ${appointment ? "text-primary font-bold" : "text-slate-300"}`}>
              {appointment ? "Sesi Sedang Aktif" : "Menunggu Sesi Dimulai"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
