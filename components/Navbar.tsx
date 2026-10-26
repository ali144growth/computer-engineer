'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Locale, portfolioData } from '@/lib/portfolio-data';
import { Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: () => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export function Navbar({
  locale,
  onToggleLocale,
  isSidebarOpen: controlledOpen,
  setIsSidebarOpen: setControlledOpen,
}: NavbarProps) {
  const content = portfolioData.nav;
  const isRtl = locale === 'ar';
  const [internalOpen, setInternalOpen] = useState(false);

  const isSidebarOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsSidebarOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  // Close sidebar on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSidebarOpen(false);
    }
  }, [setIsSidebarOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isSidebarOpen, handleKeyDown]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#4CE0D2]/10 bg-[#0A0E14]/80 backdrop-blur-lg transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Logo & Wordmark */}
          <a
            href="#"
            className="group flex items-center gap-2.5 text-base font-semibold tracking-tight text-white hover:text-[#4CE0D2] transition-colors whitespace-nowrap shrink-0"
          >
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Fahed Al-Mansoor Logo"
                width={32}
                height={32}
                className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <span>{content.brand[locale]}</span>
          </a>

          {/* Zone 2: Desktop Navigation Links (Hidden on small screens) */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300"
            aria-label="Desktop Navigation"
          >
            <a
              href="#work"
              className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-[#4CE0D2] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
            >
              {content.work[locale]}
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-[#4CE0D2] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
            >
              {content.contact[locale]}
            </a>
          </nav>

          {/* Zone 3: Actions (Locale Toggle + Mobile Hamburger) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Locale Toggle: Icon only on mobile view */}
            <button
              type="button"
              onClick={onToggleLocale}
              className="group flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 text-xs font-medium text-slate-200 bg-slate-900/60 border border-[#4CE0D2]/25 rounded-md hover:border-[#4CE0D2] hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
              aria-label={`Switch language to ${locale === 'en' ? 'Arabic' : 'English'}`}
            >
              <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#4CE0D2] transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline">{content.localeToggle[locale]}</span>
            </button>

            {/* Hamburger Button for Small Screens */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-slate-900/70 border border-[#4CE0D2]/25 text-slate-200 hover:text-white hover:border-[#4CE0D2] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
              aria-label={locale === 'en' ? 'Open navigation menu' : 'فتح قائمة التنقل'}
              aria-expanded={isSidebarOpen}
            >
              <Menu className="w-5 h-5 text-[#4CE0D2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Sidebar Overlay - elevated to z-[60] */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        {/* Dimmed & Blurred Frosted Backdrop */}
        <div
          className="absolute inset-0 bg-[#0A0E14]/80 backdrop-blur-md cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sliding Sidebar Panel */}
        <div
          className={`absolute top-0 bottom-0 w-72 sm:w-80 bg-[#0E1520]/95 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out z-[61] ${
            isRtl ? 'left-0 border-r border-[#4CE0D2]/20' : 'right-0 border-l border-[#4CE0D2]/20'
          } ${
            isSidebarOpen
              ? 'translate-x-0'
              : isRtl
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'en' ? 'Mobile Navigation' : 'قائمة التنقل للجوال'}
        >
          {/* Top of Sidebar: Brand & Close Button */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#4CE0D2]/15">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="Fahed Al-Mansoor Logo"
                    width={28}
                    height={28}
                    className="w-6 h-6 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-sm font-semibold text-white tracking-tight">
                  {content.brand[locale]}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white bg-slate-900/60 border border-[#4CE0D2]/20 hover:border-[#4CE0D2] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
                aria-label={locale === 'en' ? 'Close menu' : 'إغلاق القائمة'}
              >
                <X className="w-5 h-5 text-slate-200" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="mt-8 flex flex-col space-y-3" aria-label="Mobile Navigation Links">
              <a
                href="#work"
                onClick={(e) => handleLinkClick(e, 'work')}
                className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-white bg-slate-900/40 hover:bg-[#4CE0D2]/10 border border-transparent hover:border-[#4CE0D2]/30 transition-all cursor-pointer"
              >
                <span>{content.work[locale]}</span>
                <span className="text-[#4CE0D2] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                  #projects
                </span>
              </a>

              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-white bg-slate-900/40 hover:bg-[#4CE0D2]/10 border border-transparent hover:border-[#4CE0D2]/30 transition-all cursor-pointer"
              >
                <span>{content.contact[locale]}</span>
                <span className="text-[#4CE0D2] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                  #contact
                </span>
              </a>
            </nav>
          </div>

          {/* Bottom of Sidebar: Language Switch & Student Tag */}
          <div className="pt-6 border-t border-[#4CE0D2]/15 space-y-4">
            <button
              type="button"
              onClick={() => {
                onToggleLocale();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-slate-900/80 border border-[#4CE0D2]/25 rounded-lg hover:border-[#4CE0D2] hover:text-white transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#4CE0D2]" />
              <span>
                {locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
              </span>
            </button>

            <p className="text-[11px] text-center text-slate-500 font-normal">
              {locale === 'en'
                ? 'Computer Engineering · Kuwait University'
                : 'هندسة حاسب · جامعة الكويت'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
