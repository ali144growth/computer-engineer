'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Project, Locale, portfolioData } from '@/lib/portfolio-data';
import { getStoredProjects, subscribeProjects } from '@/lib/projects-store';
import { Plus } from 'lucide-react';

interface WorkSectionProps {
  locale: Locale;
  onSelectProject: (project: Project) => void;
}

export function WorkSection({ locale, onSelectProject }: WorkSectionProps) {
  const content = portfolioData.work;
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());

  useEffect(() => {
    const unsubscribe = subscribeProjects(() => {
      setProjects(getStoredProjects());
    });
    return unsubscribe;
  }, []);

  return (
    <section id="work" className="relative w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
      {/* Clean section title */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
          {content.heading[locale]}
        </h2>
      </div>

      {/* Grid: 1 column on mobile, 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project)}
            className="group relative flex flex-col text-start w-full rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-lg border border-[#4CE0D2]/15 hover:border-[#4CE0D2]/50 hover:bg-slate-900/60 transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2] cursor-pointer"
            aria-label={`${project.title[locale]} - ${content.expandAria[locale]}`}
          >
            {/* Project Image */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E14]/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
            </div>

            {/* Card Content: ONLY title and minimal plus/expand affordance icon */}
            <div className="p-5 md:p-6 flex items-center justify-between gap-4">
              <h3 className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-[#4CE0D2] transition-colors leading-snug">
                {project.title[locale]}
              </h3>

              {/* Expand / Plus affordance icon */}
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-[#4CE0D2]/25 bg-slate-900/50 text-[#4CE0D2] group-hover:bg-[#4CE0D2] group-hover:text-[#0A0E14] group-hover:border-[#4CE0D2] transition-all duration-150">
                <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
