"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { bookAppointment, cancelAppointment } from "@/app/actions/psychologist"
import { getPusherClient } from "@/lib/pusher/pusher-client"

// Modular Components
import PsychologistCard from "@/components/arahkan/PsychologistCard"
import UrgentBanner from "@/components/arahkan/UrgentBanner"
import RecoveryFlow from "@/components/arahkan/RecoveryFlow"
import ActiveSessionWidget from "@/components/arahkan/ActiveSessionWidget"
import BookingModal from "@/components/arahkan/BookingModal"
import EmergencyHotlineModal from "@/components/arahkan/EmergencyHotlineModal"
import ConfirmEndSessionModal from "@/components/konsultasi/ConfirmEndSessionModal"

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface Psychologist {
  id: string
  name: string
  role: string
  specialty: string
  rating: number
  experienceYears: number
  imageUrl: string
  availability: string
  busyUntil?: string
  tags: string[]
}

interface ActiveAppointment {
  id: string
  scheduledAt: string
  psychologist: {
    id: string
    name: string
    role: string
    imageUrl: string
  }
}

interface ArahkanClientProps {
  psychologists: Psychologist[]
  activeAppointment: ActiveAppointment | null
  userProfile: { id: string; name: string; image?: string }
  latestScreeningScore: number | null
}

// ────────────────────────────────────────────
// Filter tag list
// ────────────────────────────────────────────

const FILTER_TAGS = ["Trauma", "Depresi", "Kecemasan", "Remaja"] as const

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

export default function ArahkanClient({
  psychologists,
  activeAppointment,
  userProfile,
  latestScreeningScore,
}: ArahkanClientProps) {
  // Search & filter
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Psychologists list in state so we can update rating in real-time
  const [psychList, setPsychList] = useState<Psychologist[]>(psychologists)

  // Sync psychList if psychologists prop changes
  useEffect(() => {
    setPsychList(psychologists)
  }, [psychologists])

  // Appointment
  const [appointment, setAppointment] = useState<ActiveAppointment | null>(activeAppointment)
  const [isSessionVisible, setIsSessionVisible] = useState(true)

  // Booking / Profile modal
  const [bookingPsych, setBookingPsych] = useState<Psychologist | null>(null)
  const [modalMode, setModalMode] = useState<"booking" | "profile">("booking")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Emergency modal
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  // Cancel appointment custom modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Real-time synchronization of bookings via Pusher
  useEffect(() => {
    if (!userProfile?.id) return

    const pusher = getPusherClient()
    const channelName = `user-${userProfile.id}`
    const channel = pusher.subscribe(channelName)

    const handleAppointmentUpdate = (data: any) => {
      setAppointment(data.activeAppointment)
      if (data.activeAppointment) {
        toast.success(`Jadwal konsultasi diperbarui secara real-time: ${data.activeAppointment.psychologist.name}`)
      } else {
        toast.info("Jadwal konsultasi telah dibatalkan.")
      }
    }

    channel.bind("appointment-updated", handleAppointmentUpdate)

    return () => {
      channel.unbind("appointment-updated", handleAppointmentUpdate)
      pusher.unsubscribe(channelName)
    }
  }, [userProfile?.id])

  // ── Derived: filtered psychologist list ──

  const filteredPsychologists = psychList.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    const matchesTag = selectedTag ? p.tags.includes(selectedTag) : true
    return matchesSearch && matchesTag
  })

  // ── Handlers ──

  const handleOpenBooking = (psych: Psychologist) => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split("T")[0])
    setSelectedTime("09:00")
    setBookingPsych(psych)
    setModalMode("booking")
  }

  const handleOpenProfile = (psych: Psychologist) => {
    setBookingPsych(psych)
    setModalMode("profile")
  }

  const handleConfirmBooking = async () => {
    if (!bookingPsych) return
    setIsSubmitting(true)
    try {
      const dt = new Date(`${selectedDate}T${selectedTime}:00`)
      await bookAppointment(bookingPsych.id, dt)
      setBookingPsych(null)
      toast.success(`Berhasil mengajukan jadwal dengan ${bookingPsych.name}! Menunggu konfirmasi psikolog.`)
    } catch (err: any) {
      toast.error(err.message || "Gagal menjadwalkan konsultasi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelAppointment = (id: string) => {
    setCancelAppointmentId(id)
    setCancelModalOpen(true)
  }

  const handleConfirmCancelAppointment = async () => {
    if (!cancelAppointmentId) return
    setIsCancelling(true)
    try {
      await cancelAppointment(cancelAppointmentId)
      setAppointment(null)
      setCancelModalOpen(false)
      setCancelAppointmentId(null)
      toast.success("Jadwal konsultasi berhasil dibatalkan.")
    } catch (err: any) {
      toast.error(err.message || "Gagal membatalkan konsultasi.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleRatePsychologist = async (psychologistId: string, rating: number) => {
    try {
      const res = await fetch("/api/psychologist/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ psychologistId, rating }),
      })
      if (!res.ok) {
        throw new Error("Gagal mengirim rating")
      }
      const json = await res.json()
      if (json.success) {
        toast.success("Terima kasih! Rating Anda berhasil dikirim.")
        setPsychList((prev) =>
          prev.map((p) =>
            p.id === psychologistId ? { ...p, rating: json.data.rating } : p
          )
        )
        if (bookingPsych && bookingPsych.id === psychologistId) {
          setBookingPsych((prev) => prev ? { ...prev, rating: json.data.rating } : null)
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim rating.")
      throw err
    }
  }

  const formatAppointmentDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  }

  // ── Render ──

  return (
    <div className="bg-background text-foreground font-body-md antialiased transition-colors duration-500">
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-32 md:px-12">
        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search input */}
          <div className="relative w-full md:flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant/60 bg-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="Cari spesialis atau masalah (Trauma, Kecemasan...)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrolling-hide-scrollbar">
            {/* "Filter" chip (always-show reset) */}
            <button
              onClick={() => { setSelectedTag(null); setSearchQuery("") }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                !selectedTag && searchQuery === ""
                  ? "bg-primary text-white"
                  : "bg-surface border border-outline-variant/60 text-foreground/85 hover:bg-primary-fixed-dim"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filter
            </button>

            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-primary text-white"
                    : "bg-surface border border-outline-variant/60 text-foreground/85 hover:bg-primary-fixed-dim"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid: cards + sidebar ── */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: psychologist list */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground">
              Psikolog & Psikiater Terverifikasi
            </h2>

            {filteredPsychologists.length === 0 ? (
              <div className="bg-surface border border-outline-variant/40 rounded-2xl p-12 text-center shadow-sm">
                <span className="material-symbols-outlined text-slate-300 text-5xl">search_off</span>
                <p className="mt-4 font-bold text-foreground">Tidak ada spesialis ditemukan</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Coba gunakan kata kunci pencarian lain atau bersihkan filter.
                </p>
              </div>
            ) : (
              filteredPsychologists.map((psych) => {
                const isBooked = appointment?.psychologist.id === psych.id
                return (
                  <PsychologistCard
                    key={psych.id}
                    name={psych.name}
                    role={psych.role}
                    specialty={psych.specialty}
                    rating={psych.rating}
                    experienceYears={psych.experienceYears}
                    imageUrl={psych.imageUrl}
                    availability={psych.availability}
                    busyUntil={psych.busyUntil}
                    onBook={() => handleOpenBooking(psych)}
                    onViewProfile={() => handleOpenProfile(psych)}
                    onCancel={() => {
                      if (appointment) {
                        handleCancelAppointment(appointment.id)
                      }
                    }}
                    isBooked={isBooked}
                  />
                )
              })
            )}
          </div>

          {/* Right: sidebar widgets */}
          <aside className="lg:col-span-4 space-y-6">
            <UrgentBanner onCall={() => setShowEmergencyModal(true)} />

            <RecoveryFlow
              latestScreeningScore={latestScreeningScore}
              appointment={appointment}
              formatDate={formatAppointmentDate}
            />
          </aside>
        </div>
      </main>

      {/* ── Floating active-session widget ── */}
      <ActiveSessionWidget
        psychologistName={appointment?.psychologist.name ?? null}
        scheduledAt={appointment?.scheduledAt ?? null}
        appointmentId={appointment?.id ?? null}
        visible={isSessionVisible}
        onClose={() => {
          if (appointment) handleCancelAppointment(appointment.id)
          else setIsSessionVisible(false)
        }}
      />

      {/* ── Modals ── */}
      <BookingModal
        psychologist={bookingPsych}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        isSubmitting={isSubmitting}
        onClose={() => setBookingPsych(null)}
        onConfirm={handleConfirmBooking}
        mode={modalMode}
        onRate={handleRatePsychologist}
      />

      <EmergencyHotlineModal
        visible={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <ConfirmEndSessionModal
        isOpen={cancelModalOpen}
        title="Batalkan Jadwal Konsultasi"
        message="Apakah Anda yakin ingin membatalkan jadwal konsultasi ini?"
        onConfirm={handleConfirmCancelAppointment}
        onDecline={() => {
          setCancelModalOpen(false)
          setCancelAppointmentId(null)
        }}
        isConfirming={isCancelling}
        confirmLabel="Ya, Batalkan"
        declineLabel="Batal"
      />
    </div>
  )
}
