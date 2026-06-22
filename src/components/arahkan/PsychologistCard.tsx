"use client"

interface PsychologistCardProps {
  name: string
  role: string
  specialty: string
  rating: number
  experienceYears: number
  imageUrl: string
  availability: string
  busyUntil?: string | null
  onBook: () => void
  onViewProfile?: () => void
  onCancel?: () => void
  isBooked?: boolean
}

export default function PsychologistCard({
  name,
  role,
  specialty,
  rating,
  experienceYears,
  imageUrl,
  availability,
  busyUntil,
  onBook,
  onViewProfile,
  onCancel,
  isBooked = false,
}: PsychologistCardProps) {
  const isAvailable = availability === "AVAILABLE"

  return (
    <div className="bg-surface border border-outline-variant/60 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 hover-lift shadow-premium hover:border-primary/20">
      {/* Photo */}
      <div className="flex-shrink-0 self-start">
        <img
          alt={name}
          src={imageUrl}
          className="w-[88px] h-[88px] rounded-full object-cover border-2 border-primary-fixed"
        />
      </div>

      {/* Info (middle column) */}
      <div className="flex-1 min-w-0">
        {/* Row: role tag + rating star */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Role tag */}
            <span className="inline-block px-2 py-0.5 bg-primary-fixed text-primary rounded text-[10px] font-bold uppercase tracking-wider leading-none transition-colors duration-500">
              {role}
            </span>

            {/* Name */}
            <h3 className="mt-1.5 text-lg font-bold text-foreground leading-snug">
              {name}
            </h3>

            {/* Specialty */}
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Spesialis: {specialty}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <span
              className="material-symbols-outlined text-amber-400 text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Divider + stats */}
        <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center gap-8">
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">Pengalaman</span>
            <span className="text-sm font-bold text-foreground">{experienceYears} Tahun</span>
          </div>
          {/* Price omitted — psikolog gratis per project requirement */}
        </div>
      </div>

      {/* Action column (right) */}
      <div className="flex flex-col items-end justify-end gap-2 sm:w-40 shrink-0">
        <span
          className={`text-xs font-semibold ${
            isBooked
              ? "text-teal-600"
              : isAvailable
              ? "text-emerald-600"
              : "text-[#6f797a]"
          }`}
        >
          {isBooked
            ? "Jadwal Anda"
            : isAvailable
            ? "Tersedia Sekarang"
            : `Sibuk (Tersedia jam ${busyUntil || "16:00"})`}
        </span>

        {isBooked ? (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={onViewProfile}
              className="w-full text-center px-4 py-2 bg-teal-50 border border-teal-600 text-primary text-xs font-bold rounded-lg hover:bg-teal-100/50 active:scale-95 transition-all cursor-pointer transition-colors duration-500"
            >
              Terjadwal
            </button>
            <button
              onClick={onCancel}
              className="w-full text-center px-4 py-2 bg-red-50 border border-red-500 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100/50 active:scale-95 transition-all cursor-pointer"
            >
              Batalkan Sesi
            </button>
          </div>
        ) : isAvailable ? (
          <button
            onClick={onBook}
            className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container active:scale-95 transition-all cursor-pointer transition-colors duration-500"
          >
            Jadwalkan
          </button>
        ) : (
          <button
            onClick={onViewProfile}
            className="px-6 py-2.5 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-teal-50 active:scale-95 transition-all cursor-pointer transition-colors duration-500"
          >
            Lihat Profil
          </button>
        )}
      </div>
    </div>
  )
}
