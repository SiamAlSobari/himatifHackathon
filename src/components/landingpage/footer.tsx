import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-semibold text-lg mb-2">
              Jembatan <span className="text-[#1A8A7A]">Aman</span>
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pendamping refleksi emosional berbasis AI yang memahami kamu secara personal.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Platform
            </p>
            <ul className="space-y-2">
              {['Cara Kerja', 'LOMBUT AI', 'Mulai Sekarang'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#1A8A7A] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {['Tentang Kami', 'Blog', 'Karir'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#1A8A7A] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#1A8A7A] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2024 Jembatan Aman. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Bukan pengganti profesional kesehatan mental.
          </p>
        </div>
      </div>
    </footer>
  )
}