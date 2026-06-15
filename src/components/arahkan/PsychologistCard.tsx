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
  isBooked = false,
}: PsychologistCardProps) {
  const isAvailable = availability === "AVAILABLE"

  return (
    <div className="bg-white border border-[#bfc8c9]/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-5 transition-shadow hover:shadow-md">
      {/* Photo */}
      <div className="flex-shrink-0 self-start">
        <img
          alt={name}
          src={imageUrl}
          className="w-[88px] h-[88px] rounded-full object-cover border-2 border-[#eff4ff]"
        />
      </div>

      {/* Info (middle column) */}
      <div className="flex-1 min-w-0">
        {/* Row: role tag + rating star */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Role tag */}
            <span className="inline-block px-2 py-0.5 bg-[#eff4ff] text-[#004349] rounded text-[10px] font-bold uppercase tracking-wider leading-none">
              {role}
            </span>

            {/* Name */}
            <h3 className="mt-1.5 text-lg font-bold text-[#0b1c30] leading-snug">
              {name}
            </h3>

            {/* Specialty */}
            <p className="mt-0.5 text-xs text-[#6f797a] font-medium">
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
            <span className="text-sm font-bold text-[#0b1c30]">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Divider + stats */}
        <div className="mt-3 pt-3 border-t border-[#bfc8c9]/30 flex items-center gap-8">
          <div>
            <span className="text-[10px] text-[#6f797a] font-medium block">Pengalaman</span>
            <span className="text-sm font-bold text-[#0b1c30]">{experienceYears} Tahun</span>
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
          <button
            onClick={onViewProfile}
            className="px-6 py-2.5 bg-teal-50 border border-teal-600 text-[#004349] text-xs font-bold rounded-lg hover:bg-teal-100/50 active:scale-95 transition-all cursor-pointer"
          >
            Terjadwal
          </button>
        ) : isAvailable ? (
          <button
            onClick={onBook}
            className="px-6 py-2.5 bg-[#004349] text-white text-xs font-bold rounded-lg hover:bg-[#003a3f] active:scale-95 transition-all cursor-pointer"
          >
            Jadwalkan
          </button>
        ) : (
          <button
            onClick={onViewProfile}
            className="px-6 py-2.5 border border-[#004349] text-[#004349] text-xs font-bold rounded-lg hover:bg-[#f8f9ff] active:scale-95 transition-all cursor-pointer"
          >
            Lihat Profil
          </button>
        )}
      </div>
    </div>
  )
}
