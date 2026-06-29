"use client"

import React, { useState, useRef, useEffect } from "react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { animate, remove } from "animejs"

interface FaqItem {
  question: string
  answer: React.ReactNode
}

interface FaqAccordionProps {
  title: string
  items: FaqItem[]
}

const headerColorMap = {
  calm_blue: "text-teal-950",
  warm_yellow: "text-amber-950",
  alert_orange: "text-orange-950",
  deep_purple: "text-indigo-950",
}

const iconColorMap = {
  calm_blue: "text-teal-700",
  warm_yellow: "text-amber-700",
  alert_orange: "text-orange-700",
  deep_purple: "text-indigo-700",
}

interface FaqItemComponentProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  headerColor: string
  iconColor: string
}

function FaqItemComponent({ item, isOpen, onToggle, headerColor, iconColor }: FaqItemComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  // Height and opacity animation for expanding/collapsing FAQ items
  useEffect(() => {
    const contentEl = contentRef.current
    if (!contentEl) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      if (isOpen) {
        contentEl.style.height = "auto"
        contentEl.style.opacity = "1"
        contentEl.style.display = "block"
      } else {
        contentEl.style.height = "0px"
        contentEl.style.opacity = "0"
        contentEl.style.display = "none"
      }
      return
    }

    if (isOpen) {
      remove(contentEl)
      contentEl.style.display = "block"
      contentEl.style.height = "0px"
      const targetHeight = contentEl.scrollHeight

      animate(contentEl, {
        height: [0, targetHeight],
        opacity: [0, 1],
        duration: 400,
        easing: "easeOutCubic",
        complete: () => {
          contentEl.style.height = "auto"
        }
      })
    } else {
      remove(contentEl)
      const currentHeight = contentEl.offsetHeight

      animate(contentEl, {
        height: [currentHeight, 0],
        opacity: [1, 0],
        duration: 350,
        easing: "easeOutCubic",
        complete: () => {
          contentEl.style.display = "none"
        }
      })
    }
  }, [isOpen])

  // Springy rotation for the arrow icon
  useEffect(() => {
    const arrowEl = arrowRef.current
    if (!arrowEl) return

    if (isFirstRender.current) return

    animate(
      arrowEl,
      {
        rotate: isOpen ? 180 : 0,
        duration: 350,
        easing: "easeOutBack" // Springy bounce back effect
      })
  }, [isOpen])

  return (
    <div
      className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${isOpen
          ? "border-slate-300 shadow-md translate-x-[2px]"
          : "border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md hover:translate-x-[2px]"
        }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none group"
      >
        <span className={`font-bold text-sm sm:text-base ${headerColor} transition-colors ${isOpen ? "text-opacity-100" : "text-opacity-85 group-hover:text-opacity-100"}`}>
          {item.question}
        </span>
        <div
          ref={arrowRef}
          className={`shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${isOpen ? "bg-slate-100" : "bg-transparent group-hover:bg-slate-50"
            }`}
        >
          <span className={`material-symbols-outlined ${iconColor} select-none`}>
            keyboard_arrow_down
          </span>
        </div>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, display: "none" }}
      >
        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
          <div className="w-full h-px bg-slate-100 mb-4" />
          {item.answer}
        </div>
      </div>
    </div>
  )
}

export default function FaqAccordion({ title, items }: FaqAccordionProps) {
  const { theme } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll entrance animation using Intersection Observer + anime.js
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(element, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: "easeOutCubic"
          })
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const headerColor = headerColorMap[theme] || headerColorMap.calm_blue
  const iconColor = iconColorMap[theme] || iconColorMap.calm_blue

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div
      ref={containerRef}
      className="mb-8"
    >
      <h3 className={`font-extrabold text-lg sm:text-xl mb-4 ${headerColor} tracking-tight px-1`}>
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <FaqItemComponent
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => toggleAccordion(index)}
            headerColor={headerColor}
            iconColor={iconColor}
          />
        ))}
      </div>
    </div>
  )
}
