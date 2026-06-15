import React from "react"

interface EmergencyHotlineModalProps {
  visible: boolean
  onClose: () => void
}

export default function EmergencyHotlineModal({
  visible,
  onClose,
}: EmergencyHotlineModalProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-[#b9003e]">
          <span className="material-symbols-outlined text-4xl font-bold">emergency</span>
          <h3 className="text-lg font-bold">Hotline Darurat 24/7</h3>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
          Jika Anda atau seseorang yang Anda kenal sedang mengalami krisis kesehatan emosional atau pikiran bahaya, mohon segera hubungi salah satu kontak di bawah ini:
        </p>

        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-[#b9003e] text-xs">Layanan Darurat Nasional</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Nomor telepon utama kepolisian/ambulans</p>
            </div>
            <a
              href="tel:119"
              className="px-4 py-2 bg-[#b9003e] text-white rounded-lg font-bold text-xs hover:bg-[#a00035] transition-opacity"
            >
              Hubungi 119
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-teal-950 text-xs">Kementerian Kesehatan RI</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Hotline Pencegahan Bunuh Diri</p>
            </div>
            <a
              href="tel:500-454"
              className="px-4 py-2 bg-[#004349] text-white rounded-lg font-bold text-xs hover:bg-[#003034] transition-opacity"
            >
              Hubungi 500454
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-teal-950 text-xs">Into the Light Indonesia</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Komunitas pencegahan & panduan krisis</p>
            </div>
            <a
              href="https://www.intothelightid.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#004349] text-[#004349] rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Kunjungi Web
            </a>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
