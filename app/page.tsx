'use client';

import React, { useState, useEffect } from 'react';
import { Locale, Project } from '@/lib/portfolio-data';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { WorkSection } from '@/components/WorkSection';
import { ContactSection } from '@/components/ContactSection';
import { ProjectModal } from '@/components/ProjectModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CircuitBackground } from '@/components/CircuitBackground';
import { Footer } from '@/components/Footer';

export default function PortfolioPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync dir and lang on <html> whenever locale changes
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="relative min-h-screen bg-[#0A0E14] text-[#F1F5F9] selection:bg-[#4CE0D2]/25 selection:text-white"
    >
      {/* Background Circuit Texture Motif */}
      <CircuitBackground />

      {/* Main Content Area */}
      <div className="relative flex flex-col min-h-screen">
        {/* Navigation Bar adhering to Top Bar Contract */}
        <Navbar
          locale={locale}
          onToggleLocale={toggleLocale}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1">
          {/* Section 1: Hero */}
          <Hero locale={locale} />

          {/* Section 2: Work (Projects Grid) */}
          <WorkSection
            locale={locale}
            onSelectProject={(project) => setSelectedProject(project)}
          />

          {/* Section 3: Contact (Display-Only Glass Panel) */}
          <ContactSection locale={locale} />
        </main>

        {/* Quiet Minimal Footer */}
        <Footer locale={locale} />
      </div>

      {/* Click-to-Expand Frosted Glass Project Modal */}
      <ProjectModal
        project={selectedProject}
        locale={locale}
        onClose={() => setSelectedProject(null)}
      />

      {/* Corner-Mirrored Floating WhatsApp Button */}
      <FloatingWhatsApp locale={locale} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
