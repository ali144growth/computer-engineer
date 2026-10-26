'use client';

import React from 'react';
import Image from 'next/image';
import { Locale, portfolioData } from '@/lib/portfolio-data';

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const content = portfolioData.hero;
  const isAr = locale === 'ar';

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const workElement = document.getElementById('work');
    if (workElement) {
      workElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-[#4CE0D2]/10 min-h-[600px] md:min-h-[660px] lg:min-h-[720px] flex items-center">
      {/* Background Hero Image Layer - Responsive (Desktop & Mobile) and flipped in Arabic */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Desktop Hero Background (768px+) */}
        <div
          className={`hidden md:block absolute inset-0 transition-transform duration-500 ease-in-out ${
            isAr ? 'scale-x-[-1]' : ''
          }`}
        >
          <Image
            src="/images/hero-bg-desktop.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Mobile Hero Background (< 768px) */}
        <div
          className={`block md:hidden absolute inset-0 transition-transform duration-500 ease-in-out ${
            isAr ? 'scale-x-[-1]' : ''
          }`}
        >
          <Image
            src="/images/hero-bg-mobile.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-bottom"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Dark Gradient Scrims for Text Legibility & Smooth Blend */}
        {/* Top bar blend */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0A0E14] via-[#0A0E14]/60 to-transparent" />

        {/* Bottom section blend into #0A0E14 */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0A0E14] via-[#0A0E14]/80 to-transparent" />

        {/* Directional text backing scrim */}
        <div
          className={`absolute inset-0 ${
            isAr
              ? 'bg-gradient-to-l from-[#0A0E14]/90 via-[#0A0E14]/65 md:via-[#0A0E14]/40 to-transparent'
              : 'bg-gradient-to-r from-[#0A0E14]/90 via-[#0A0E14]/65 md:via-[#0A0E14]/40 to-transparent'
          }`}
        />

        {/* Mobile dark overlay for high text contrast */}
        <div className="block md:hidden absolute inset-0 bg-[#0A0E14]/45" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 sm:py-28 md:py-36 lg:py-40">
        <div className="max-w-2xl space-y-7 md:space-y-8">
          {/* Status: Student and University */}
          <p className="text-sm md:text-base font-normal text-slate-300 tracking-wide drop-shadow-sm">
            {content.status[locale]}
          </p>

          {/* Short single-line manifesto */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.18] text-balance drop-shadow-md">
            {content.headline[locale]}
          </h1>

          {/* Single CTA button */}
          <div className="pt-2">
            <a
              href="#work"
              onClick={handleScrollToWork}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm md:text-base font-medium rounded-lg text-[#0A0E14] bg-[#4CE0D2] hover:bg-[#3ec4b7] transition-all duration-200 shadow-[0_0_24px_rgba(76,224,210,0.25)] hover:shadow-[0_0_32px_rgba(76,224,210,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4CE0D2] focus-visible:ring-offset-[#0A0E14] whitespace-nowrap active:scale-[0.98]"
            >
              {content.cta[locale]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
