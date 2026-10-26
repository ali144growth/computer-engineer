'use client';

import React from 'react';
import { Locale, portfolioData, contactDetails } from '@/lib/portfolio-data';
import { MessageSquare } from 'lucide-react';

interface FloatingWhatsAppProps {
  locale: Locale;
  isSidebarOpen?: boolean;
}

export function FloatingWhatsApp({ locale, isSidebarOpen = false }: FloatingWhatsAppProps) {
  const isRtl = locale === 'ar';

  return (
    <aside
      aria-label="Quick Communication"
      className={`fixed ${
        isSidebarOpen
          ? 'z-10 opacity-0 pointer-events-none scale-90'
          : 'z-30 opacity-100 pointer-events-auto scale-100'
      } bottom-6 ${isRtl ? 'left-6' : 'right-6'} transition-all duration-300`}
    >
      <a
        href={contactDetails.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#4CE0D2] text-[#0A0E14] shadow-[0_4px_20px_rgba(76,224,210,0.35)] hover:shadow-[0_6px_28px_rgba(76,224,210,0.55)] transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4CE0D2] focus-visible:ring-offset-[#0A0E14]"
        aria-label={portfolioData.floatingWhatsAppAria[locale]}
      >
        {/* Thin glass ring with subtle pulse animation */}
        <span
          className="absolute -inset-1.5 rounded-full border border-[#4CE0D2]/40 bg-[#4CE0D2]/10 animate-pulse pointer-events-none"
          aria-hidden="true"
        />

        {/* WhatsApp Chat Icon */}
        <MessageSquare className="w-6 h-6 fill-current" />
      </a>
    </aside>
  );
}
