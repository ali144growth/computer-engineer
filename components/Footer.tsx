import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/portfolio-data';
import { Lock } from 'lucide-react';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="w-full border-t border-[#4CE0D2]/10 py-8 px-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Fahed Al-Mansoor Logo"
            width={18}
            height={18}
            className="w-4 h-4 object-contain opacity-75"
            referrerPolicy="no-referrer"
          />
          <p>
            {locale === 'en'
              ? '© 2026 Fahed Al-Mansoor. Computer Engineering Coursework & Systems Portfolio.'
              : '© ٢٠٢٦ فهد المنصور. ملف أعمال مشاريع هندسة الحاسب والأنظمة المدمجة.'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <p className="text-slate-600">
            {locale === 'en' ? 'Kuwait City, Kuwait' : 'مدينة الكويت، دولة الكويت'}
          </p>
          <span aria-hidden="true" className="text-slate-700 select-none">·</span>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#4CE0D2] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4CE0D2] rounded px-1.5 py-0.5 group"
            aria-label={locale === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
          >
            <Lock className="w-3 h-3 text-slate-500 group-hover:text-[#4CE0D2] transition-colors" />
            <span className="group-hover:underline underline-offset-4">
              {locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
