"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Update active section berdasarkan posisi scroll
      const sections = ['hero', 'kenali', 'validasi']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom >= 80) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'kenali', label: 'Kenali' },
    { id: 'validasi', label: 'Validasi' },
  ]
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleScrollTo(e, 'hero')}
          className="flex items-center gap-2 text-[#0D1B2A] font-semibold text-lg tracking-tight cursor-pointer"
        >
          <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain" />
          <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleScrollTo(e, id)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activeSection === id
                  ? 'text-[#0D1B2A] border-b-2 border-[#1A8A7A] pb-0.5'
                  : 'text-[#2D3748] hover:text-[#1A8A7A]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#2D3748] hover:text-[#1A8A7A] transition-colors hover-lift-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-[#0D1B2A] text-white px-4 py-2 rounded-full hover:bg-[#1A8A7A] transition-colors hover-lift-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}