'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Project, Locale, portfolioData } from '@/lib/portfolio-data';
import { X } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  locale: Locale;
  onClose: () => void;
}

export function ProjectModal({ project, locale, onClose }: ProjectModalProps) {
  const content = portfolioData.modal;

  // Handle ESC key dismiss
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (project) {
      document.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [project, handleKeyDown]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Dimmed & blurred backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0E14]/80 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Detail Window: Full-screen sheet on mobile, floating frosted glass panel on sm+ */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-[#0E1520]/85 border border-[#4CE0D2]/25 sm:rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button - positioned in end corner (top-right in LTR, top-left in RTL) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 z-20 p-2 text-slate-300 hover:text-white bg-[#0A0E14]/70 hover:bg-[#0A0E14] border border-[#4CE0D2]/20 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
          aria-label={content.closeAria[locale]}
        >
          <X className="w-5 h-5 text-slate-200" />
        </button>

        {/* Modal Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Large Project Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-900 border-b border-[#4CE0D2]/15">
            <Image
              src={project.image}
              alt={project.title[locale]}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
            {/* Subtle bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1520] via-transparent to-transparent opacity-60" />
          </div>

          {/* Project Details */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* Project Tag - strictly monospace as designated for this single detail */}
            <div>
              <span className="font-mono text-xs tracking-wider text-[#4CE0D2] uppercase select-all">
                {project.tag}
              </span>
            </div>

            {/* Project Title */}
            <h2
              id="modal-project-title"
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-snug"
            >
              {project.title[locale]}
            </h2>

            {/* 1-2 sentence plain, factual description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
              {project.description[locale]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
