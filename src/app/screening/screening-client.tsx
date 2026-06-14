"use client"

import Navbar from "@/components/ui/Navbar"
import ProgressHeader from "@/components/screening/Progressheader"
import MoodSelector from "@/components/screening/MoodSelector"
import InfoSidebar from "@/components/screening/InfoSidebar"

export default function ScreeningClient() {
  const handleContinue = (selectedId: string | null) => {
    if (!selectedId) {
      alert("Silakan pilih salah satu perasaan Anda terlebih dahulu.")
      return
    }
    console.log("Lanjutkan dengan pilihan:", selectedId)
  }

  const handleSaveForLater = () => {
    console.log("Disimpan untuk nanti")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <ProgressHeader step={1} totalSteps={4} category="Kesehatan Mental" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MoodSelector
              onContinue={handleContinue}
              onSaveForLater={handleSaveForLater}
            />
          </div>

          <InfoSidebar />
        </div>
      </main>
    </div>
  )
}
