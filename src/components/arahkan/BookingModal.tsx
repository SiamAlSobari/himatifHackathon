import React from "react"

interface Psychologist {
  id: string
  name: string
  role: string
  specialty: string
  imageUrl: string
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
}: BookingModalProps) {
  if (!psychologist) return null

  const timeSlots = ["09:00", "10:30", "13:00", "14:30", "16:00", "19:00"]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-[#004349]">Jadwalkan Konsultasi</h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Doctor Info Card */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
          <img
            src={psychologist.imageUrl}
            alt={psychologist.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200/50"
          />
          <div>
            <span className="px-2 py-0.5 bg-[#eff4ff] text-[#004349] rounded-md text-[9px] uppercase font-bold tracking-wider inline-block mb-1">
              {psychologist.role}
            </span>
            <h4 className="font-bold text-teal-950 text-sm leading-tight">
              {psychologist.name}
            </h4>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {psychologist.specialty}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-2">
              Pilih Tanggal Sesi
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#004349] focus:border-[#004349] focus:outline-none text-sm font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-2">
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
                      ? "bg-[#004349] text-white border-[#004349]"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {time} WIB
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
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
            className="flex-1 py-3 bg-[#004349] hover:bg-[#003034] text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Konfirmasi Jadwal"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
