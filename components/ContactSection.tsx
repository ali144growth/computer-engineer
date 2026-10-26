'use client';

import React from 'react';
import { Locale, portfolioData, contactDetails } from '@/lib/portfolio-data';
import { Phone, MessageSquare, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  locale: Locale;
}

export function ContactSection({ locale }: ContactSectionProps) {
  const content = portfolioData.contact;

  const contactItems = [
    {
      id: 'phone',
      label: content.phoneLabel[locale],
      value: contactDetails.phone.display,
      href: contactDetails.phone.href,
      icon: Phone,
      isExternal: false,
    },
    {
      id: 'whatsapp',
      label: content.whatsappLabel[locale],
      value: contactDetails.whatsapp.display,
      href: contactDetails.whatsapp.href,
      icon: MessageSquare,
      isExternal: true,
    },
    {
      id: 'email',
      label: content.emailLabel[locale],
      value: contactDetails.email.display,
      href: contactDetails.email.href,
      icon: Mail,
      isExternal: false,
    },
    {
      id: 'location',
      label: content.locationLabel[locale],
      value: contactDetails.location[locale],
      href: null,
      icon: MapPin,
      isExternal: false,
    },
    {
      id: 'github',
      label: content.githubLabel[locale],
      value: contactDetails.github.display,
      href: contactDetails.github.href,
      icon: Github,
      isExternal: true,
    },
    {
      id: 'linkedin',
      label: content.linkedinLabel[locale],
      value: contactDetails.linkedin.display,
      href: contactDetails.linkedin.href,
      icon: Linkedin,
      isExternal: true,
    },
  ];

  return (
    <section id="contact" className="relative w-full max-w-6xl mx-auto px-6 py-20 md:py-28 pb-32">
      {/* Section Title */}
      <div className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
          {content.heading[locale]}
        </h2>
      </div>

      {/* Single Frosted Glass Panel Container */}
      <div className="bg-slate-900/40 backdrop-blur-lg border border-[#4CE0D2]/20 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const contentBlock = (
              <div className="flex flex-col items-start gap-3 p-4 rounded-xl transition-all duration-150 group-hover:bg-slate-800/40">
                {/* Icon over label */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900/70 border border-[#4CE0D2]/25 text-[#4CE0D2] group-hover:border-[#4CE0D2] group-hover:shadow-[0_0_12px_rgba(76,224,210,0.25)] transition-all">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Label & Value */}
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>{item.label}</span>
                    {item.href && item.isExternal && (
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#4CE0D2] transition-colors" />
                    )}
                  </div>
                  <p className="text-sm md:text-base font-normal text-white group-hover:text-[#4CE0D2] transition-colors truncate">
                    {item.id === 'location' ? (
                      item.value
                    ) : (
                      <bdi
                        dir="ltr"
                        className="inline-block [direction:ltr] [unicode-bidi:isolate]"
                      >
                        {item.value}
                      </bdi>
                    )}
                  </p>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
                >
                  {contentBlock}
                </a>
              );
            }

            return (
              <div key={item.id} className="group block rounded-xl cursor-default">
                {contentBlock}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
