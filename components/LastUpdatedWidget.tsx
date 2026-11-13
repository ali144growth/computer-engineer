'use client';

import React, { useMemo } from 'react';
import { Locale } from '@/lib/portfolio-data';
import { useProjects } from '@/lib/projects-store';
import { useCv } from '@/lib/cv-store';
import { useSiteMeta, DEFAULT_LAST_UPDATED } from '@/lib/site-meta-store';

interface LastUpdatedWidgetProps {
  locale: Locale;
  isSidebarOpen?: boolean;
}

export function LastUpdatedWidget({
  locale,
  isSidebarOpen = false,
}: LastUpdatedWidgetProps) {
  const isRtl = locale === 'ar';
  const projects = useProjects();
  const cvDoc = useCv();
  const siteMeta = useSiteMeta();

  const latestIso = useMemo(() => {
    let maxTime = new Date(DEFAULT_LAST_UPDATED).getTime();
    let bestIso = DEFAULT_LAST_UPDATED;

    const consider = (iso?: string) => {
      if (!iso) return;
      const t = new Date(iso).getTime();
      if (!Number.isNaN(t) && t > maxTime) {
        maxTime = t;
        bestIso = iso;
      }
    };

    consider(siteMeta?.updatedAt);
    consider(cvDoc?.updatedAt);
    for (const p of projects) {
      consider(p.createdAt);
    }

    return bestIso;
  }, [projects, cvDoc, siteMeta]);

  const formattedDate = useMemo(() => {
    return new Date(latestIso).toLocaleDateString(
      locale === 'ar' ? 'ar-KW' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
  }, [latestIso, locale]);

  return (
    <aside
      aria-label={locale === 'en' ? 'Last website update' : 'آخر تحديث للموقع'}
      className={`fixed ${
        isSidebarOpen
          ? 'z-10 opacity-0 pointer-events-none scale-95'
          : 'z-30 opacity-100 pointer-events-auto scale-100'
      } ${
        isRtl ? 'bottom-24 left-6 sm:bottom-6 sm:left-24' : 'bottom-6 left-6'
      } transition-all duration-300 max-w-[calc(100vw-3rem)]`}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0E1520]/85 backdrop-blur-lg border border-[#4CE0D2]/25 shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 leading-none">
            {locale === 'en' ? 'Last updated' : 'آخر تحديث'}
          </p>
          <time
            dateTime={latestIso}
            suppressHydrationWarning
            className="block text-[11px] sm:text-xs font-mono text-slate-100 mt-1 truncate tabular-nums"
          >
            {formattedDate}
          </time>
        </div>
      </div>
    </aside>
  );
}
