"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { animate, stagger } from "animejs";

interface Section1Props {
  onCtaClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Section1({ onCtaClick }: Section1Props) {
  useEffect(() => {
    // Set initial styles for animation targets to avoid flash
    const elements = document.querySelectorAll(".anime-hero-reveal");
    elements.forEach((el) => {
      ;(el as HTMLElement).style.opacity = "0";
      ;(el as HTMLElement).style.transform = "translateY(30px)";
    });

    animate(".anime-hero-reveal", {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: stagger(100),
      duration: 1000,
      easing: "easeOutBack",
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen lg:h-screen bg-background flex flex-col justify-between overflow-hidden transition-colors duration-500"
    >
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-w-125 h-w-125 bg-[#1A8A7A]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#0D1B2A]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none animate-float-delayed" />

      {/* Hero Content — proporsi 45% layar */}
      <div className="flex flex-col items-center justify-end text-center px-6 pb-6 pt-24 max-w-4xl mx-auto w-full h-auto min-h-[45vh] lg:h-[45%]">
        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-3 anime-hero-reveal">
          Dengarkan{" "}
          <span className="text-primary relative transition-colors duration-500">
            Dirimu
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C50 2 100 1 198 4"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-foreground mb-2 anime-hero-reveal">
          Satu Percakapan Bisa Mengubah Banyak Hal.
        </p>

        <p className="text-sm md:text-base text-[#2D3748]/70 max-w-xl mb-6 leading-relaxed anime-hero-reveal">
          AI kami menyesuaikan setiap pertanyaan berdasarkan kondisi dan jawabanmu, membantu mengurai beban emosional secara alami dan aman.
        </p>

        {/* CTA */}
        <div className="anime-hero-reveal">
          <Link
            href="/dashboard"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 bg-foreground hover:bg-primary text-white text-sm font-medium px-7 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:shadow-xl hover-lift group"
          >
            Temukan dirimu
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hero Image Container — proporsi 55% layar */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-0 h-[280px] sm:h-[350px] lg:h-[55%] flex-1 relative anime-hero-reveal">
        <div className="w-full h-full">
          <div className="relative w-full h-full rounded-t-2xl overflow-hidden bg-[#D1D9E0] shadow-premium">
            <Image
              src="/thomas.jpg"
              alt="Hero"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Gradient overlay bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
