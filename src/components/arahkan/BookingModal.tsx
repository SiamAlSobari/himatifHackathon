import React from "react"
import { useTheme } from "@/components/providers/ThemeProvider"

interface Psychologist {
  id: string
  name: string
  role: string
  specialty: string
  imageUrl: string
  rating?: number
  experienceYears?: number
  availability?: string
  busyUntil?: string | null
  tags?: string[]
}

interface BookingModalProps {
  psychologist: Psychologist | null
  selectedDate: string
  setSelectedDate: (date: string) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
  mode?: "booking" | "profile"
  onRate?: (psychologistId: string, rating: number) => Promise<void>
}

const titleColorMap = {
  calm_blue: "text-teal-900",
  warm_yellow: "text-amber-800",
  alert_orange: "text-orange-800",
  deep_purple: "text-indigo-900",
}

const badgeStyleMap = {
  calm_blue: "bg-teal-50 text-teal-900 border border-teal-100/50",
  warm_yellow: "bg-amber-50 text-amber-800 border border-amber-100/50",
  alert_orange: "bg-orange-50 text-orange-800 border border-orange-100/50",
  deep_purple: "bg-indigo-50 text-indigo-900 border border-indigo-100/50",
}

const textDarkColorMap = {
  calm_blue: "text-teal-950",
  warm_yellow: "text-amber-950",
  alert_orange: "text-orange-950",
  deep_purple: "text-indigo-950",
}

const tagStyleMap = {
  calm_blue: "bg-teal-50 border border-teal-100 text-teal-900",
  warm_yellow: "bg-amber-50 border border-amber-200 text-amber-900",
  alert_orange: "bg-orange-50 border border-orange-200 text-orange-900",
  deep_purple: "bg-indigo-50 border border-indigo-200 text-indigo-900",
}

const primaryBtnMap = {
  calm_blue: "bg-teal-900 hover:bg-teal-950",
  warm_yellow: "bg-amber-800 hover:bg-amber-900",
  alert_orange: "bg-orange-800 hover:bg-orange-900",
  deep_purple: "bg-indigo-900 hover:bg-indigo-950",
}

const focusInputMap = {
  calm_blue: "focus:ring-teal-900 focus:border-teal-900",
  warm_yellow: "focus:ring-amber-800 focus:border-amber-800",
  alert_orange: "focus:ring-orange-800 focus:border-orange-800",
  deep_purple: "focus:ring-indigo-900 focus:border-indigo-900",
}

const activeSlotMap = {
  calm_blue: "bg-teal-900 text-white border-teal-900",
  warm_yellow: "bg-amber-800 text-white border-amber-800",
  alert_orange: "bg-orange-800 text-white border-orange-800",
  deep_purple: "bg-indigo-900 text-white border-indigo-900",
}

export default function BookingModal({
  psychologist,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  isSubmitting,
  onClose,
  onConfirm,
  mode = "booking",
  onRate,
}: BookingModalProps) {
  const { theme } = useTheme()
  const [userRating, setUserRating] = React.useState<number>(0)
  const [hoverRating, setHoverRating] = React.useState<number>(0)
  const [isRatingSubmitting, setIsRatingSubmitting] = React.useState(false)
  const [hasRated, setHasRated] = React.useState(false)

  React.useEffect(() => {
    setUserRating(0)
    setHoverRating(0)
    setHasRated(false)
    setIsRatingSubmitting(false)
  }, [psychologist?.id])

  if (!psychologist) return null

  const timeSlots = ["09:00", "10:14", "13:00", "14:30", "16:00", "00:44"]

  // Get friendly clinical biography based on name/role
  const getBiography = (name: string) => {
    if (name.includes("Aris")) {
      return "Dr. Aris Setiawan adalah seorang psikolog klinis senior dengan pengalaman lebih dari 12 tahun. Spesialisasi beliau adalah penanganan trauma psikologis berat, PTSD, dan pendampingan krisis emosional. Menggunakan pendekatan kognitif perilaku (CBT) dan EMDR untuk membantu pemulihan pasien secara mendalam."
    }
    if (name.includes("Sarah")) {
      return "Dr. Sarah Wijaya adalah seorang dokter spesialis kedokteran jiwa (psikiater) dengan pengalaman 8 tahun. Beliau berfokus pada diagnosis dan manajemen klinis untuk gangguan kecemasan, depresi, gangguan tidur kronis (insomnia), dan mood swing. Pendekatan beliau mengkombinasikan psikofarmakoterapi dan psikoterapi suportif."
    }
    return "Dika Pratama adalah konselor sebaya tersertifikasi yang berfokus pada pendampingan kesehatan mental remaja dan dewasa awal. Memiliki pengalaman 5 tahun mendampingi tantangan overthinking, tekanan akademik, konflik relasi sosial, dan adaptasi fase hidup baru."
  }

  const isProfileMode = mode === "profile"

  const titleColor = titleColorMap[theme] || titleColorMap.calm_blue
  const badgeStyle = badgeStyleMap[theme] || badgeStyleMap.calm_blue
  const textDarkColor = textDarkColorMap[theme] || textDarkColorMap.calm_blue
  const tagStyle = tagStyleMap[theme] || tagStyleMap.calm_blue
  const primaryBtn = primaryBtnMap[theme] || primaryBtnMap.calm_blue
  const focusInput = focusInputMap[theme] || focusInputMap.calm_blue
  const activeSlot = activeSlotMap[theme] || activeSlotMap.calm_blue

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-bold ${titleColor}`}>
            {isProfileMode ? "Profil Spesialis" : "Jadwal Konsultasi"}
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Doctor Info Card */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-4">
          <img
            src={psychologist.imageUrl}
            alt={psychologist.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200/50"
          />
          <div>
            <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider inline-block mb-1 ${badgeStyle}`}>
              {psychologist.role}
            </span>
            <h4 className={`font-bold text-sm leading-tight ${textDarkColor}`}>
              {psychologist.name}
            </h4>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {psychologist.specialty}
            </p>
          </div>
        </div>

        {isProfileMode ? (
          /* Profile Details Mode */
          <div className="space-y-4">
            {/* Experience & Rating */}
            <div className="grid grid-cols-2 gap-4 mb-4 border-y border-slate-100 py-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Pengalaman
                </span>
                <span className={`text-sm font-bold mt-1 block ${textDarkColor}`}>
                  {psychologist.experienceYears ?? 5} Tahun
                </span>
              </div>
              <div className="text-center border-l border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Rating
                </span>
                <div className={`flex items-center justify-center gap-1 mt-1 text-sm font-bold ${textDarkColor}`}>
                  <span
                    className="material-symbols-outlined text-amber-400 text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {psychologist.rating?.toFixed(1) ?? "4.8"}
                </div>
              </div>
            </div>

            {/* Specialties tags */}
            {psychologist.tags && psychologist.tags.length > 0 && (
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textDarkColor}`}>
                  Fokus Penanganan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {psychologist.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tagStyle}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Biography */}
            <div className="pb-2">
              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${textDarkColor}`}>
                Tentang Spesialis
              </span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
                {getBiography(psychologist.name)}
              </p>
            </div>

            {/* Interactive Rating Component */}
            {onRate && (
              <div className="border-t border-slate-100 pt-4 mt-2">
                <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 text-center ${textDarkColor}`}>
                  Berikan Rating Anda
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || userRating)
                    return (
                      <button
                        key={star}
                        type="button"
                        disabled={isRatingSubmitting || hasRated}
                        onMouseEnter={() => !hasRated && setHoverRating(star)}
                        onMouseLeave={() => !hasRated && setHoverRating(0)}
                        onClick={async () => {
                          if (hasRated || isRatingSubmitting) return
                          setUserRating(star)
                          setIsRatingSubmitting(true)
                          try {
                            await onRate(psychologist.id, star)
                            setHasRated(true)
                          } catch (err) {
                            setUserRating(0)
                          } finally {
                            setIsRatingSubmitting(false)
                          }
                        }}
                        className={`material-symbols-outlined text-2xl transition-all duration-150 cursor-pointer ${
                          hasRated || isRatingSubmitting ? "opacity-50" : "hover:scale-125"
                        } ${active ? "text-amber-400" : "text-slate-300"}`}
                        style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
                      >
                        star
                      </button>
                    )
                  })}
                </div>
                {hasRated && (
                  <p className="text-[11px] text-emerald-600 font-semibold text-center mt-1">
                    Terima kasih atas rating Anda!
                  </p>
                )}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`w-full py-3 text-white rounded-xl font-bold text-xs transition-colors shadow-md text-center cursor-pointer ${primaryBtn}`}
            >
              Tutup Profil
            </button>
          </div>
        ) : (
          /* Normal Booking Fields Mode */
          <>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textDarkColor}`}>
                  Pilih Tanggal Sesi
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:outline-none text-sm font-semibold text-slate-800 ${focusInput}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textDarkColor}`}>
                  Pilih Waktu Sesi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        selectedTime === time
                          ? activeSlot
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {time} WIB
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                disabled={isSubmitting || !selectedDate}
                onClick={onConfirm}
                className={`flex-1 py-3 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer text-center shadow-md flex items-center justify-center gap-2 ${primaryBtn}`}
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Konfirmasi Jadwal"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
