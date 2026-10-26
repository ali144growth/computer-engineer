export type Locale = 'en' | 'ar';

export interface Project {
  id: string;
  title: Record<Locale, string>;
  image: string;
  tag: string; // The single minimal tag used strictly in the modal
  description: Record<Locale, string>;
}

export interface ContactInfo {
  phone: {
    display: string;
    href: string;
  };
  whatsapp: {
    display: string;
    href: string;
  };
  email: {
    display: string;
    href: string;
  };
  location: Record<Locale, string>;
  github: {
    display: string;
    href: string;
  };
  linkedin: {
    display: string;
    href: string;
  };
}

export interface PortfolioContent {
  nav: {
    brand: Record<Locale, string>;
    work: Record<Locale, string>;
    contact: Record<Locale, string>;
    localeToggle: Record<Locale, string>;
  };
  hero: {
    status: Record<Locale, string>;
    headline: Record<Locale, string>;
    cta: Record<Locale, string>;
  };
  work: {
    heading: Record<Locale, string>;
    expandAria: Record<Locale, string>;
  };
  modal: {
    closeAria: Record<Locale, string>;
  };
  contact: {
    heading: Record<Locale, string>;
    phoneLabel: Record<Locale, string>;
    whatsappLabel: Record<Locale, string>;
    emailLabel: Record<Locale, string>;
    locationLabel: Record<Locale, string>;
    githubLabel: Record<Locale, string>;
    linkedinLabel: Record<Locale, string>;
  };
  floatingWhatsAppAria: Record<Locale, string>;
}

export const portfolioData: PortfolioContent = {
  nav: {
    brand: {
      en: 'Fahed Al-Mansoor',
      ar: 'فهد المنصور',
    },
    work: {
      en: 'Work',
      ar: 'الأعمال',
    },
    contact: {
      en: 'Contact',
      ar: 'التواصل',
    },
    localeToggle: {
      en: 'العربية',
      ar: 'English',
    },
  },
  hero: {
    status: {
      en: 'Fahed Al-Mansoor, Computer Engineering Student, Kuwait University',
      ar: 'فهد المنصور، طالب هندسة حاسب، جامعة الكويت',
    },
    headline: {
      en: 'Turning Ideas into Technology',
      ar: 'أحوّل الأفكار إلى تكنولوجيا',
    },
    cta: {
      en: 'View My Work',
      ar: 'مشاهدة أعمالي',
    },
  },
  work: {
    heading: {
      en: 'Selected Work',
      ar: 'أعمال مختارة',
    },
    expandAria: {
      en: 'View project details',
      ar: 'عرض تفاصيل المشروع',
    },
  },
  modal: {
    closeAria: {
      en: 'Close detail window',
      ar: 'إغلاق نافذة التفاصيل',
    },
  },
  contact: {
    heading: {
      en: 'Contact',
      ar: 'التواصل',
    },
    phoneLabel: {
      en: 'Phone',
      ar: 'الهاتف',
    },
    whatsappLabel: {
      en: 'WhatsApp',
      ar: 'واتساب',
    },
    emailLabel: {
      en: 'Email',
      ar: 'البريد الإلكتروني',
    },
    locationLabel: {
      en: 'Location',
      ar: 'الموقع',
    },
    githubLabel: {
      en: 'GitHub',
      ar: 'جيت هب',
    },
    linkedinLabel: {
      en: 'LinkedIn',
      ar: 'لينكد إن',
    },
  },
  floatingWhatsAppAria: {
    en: 'Open WhatsApp chat',
    ar: 'محادثة عبر واتساب',
  },
};

export const contactDetails: ContactInfo = {
  phone: {
    display: '\u200E+965 9123 4567',
    href: 'tel:+96591234567',
  },
  whatsapp: {
    display: '\u200E+965 9123 4567',
    href: 'https://wa.me/96591234567',
  },
  email: {
    display: 'fahed.mansoor.ce@gmail.com',
    href: 'mailto:fahed.mansoor.ce@gmail.com',
  },
  location: {
    en: 'Kuwait City, Kuwait',
    ar: 'مدينة الكويت، الكويت',
  },
  github: {
    display: 'github.com/fahed-almansoor',
    href: 'https://github.com/fahed-almansoor',
  },
  linkedin: {
    display: 'linkedin.com/in/fahed-almansoor',
    href: 'https://linkedin.com/in/fahed-almansoor',
  },
};

export const projectsData: Project[] = [
  {
    id: 'smart-receptionist-door-lock',
    title: {
      en: 'Smart Receptionist / Door Lock',
      ar: 'قفل الباب الذكي ومسؤول الاستقبال',
    },
    image: '/images/smart-lock.jpg',
    tag: '#embedded',
    description: {
      en: 'Designed an automated access-control prototype utilizing an ESP32 microcontroller with RFID authentication and local facial verification. Handles hardware relay control for electronic strikes alongside local credential logging.',
      ar: 'نموذج أولي لنظام تحكم ذكي بالدخول باستخدام متحكم ESP32 مع مصادقة RFID والتعرف على الوجه، مع تشغيل قفل الباب الإلكتروني وسجل وصول محلي.',
    },
  },
  {
    id: 'network-wide-ad-blocker',
    title: {
      en: 'Network-Wide Ad Blocker',
      ar: 'مانع إعلانات على مستوى الشبكة',
    },
    image: '/images/network-adblock.jpg',
    tag: '#networking',
    description: {
      en: 'Configured a low-power, DNS sinkhole appliance built on lightweight Linux to intercept tracking domains and unwanted queries network-wide. Includes custom upstream resolver routing and latency monitoring.',
      ar: 'أداة شبكية ذاتية الاستضافة على نظام لينكس تحجب الإعلانات وأجهزة التتبع على مستوى نظام أسماء النطاقات (DNS) لجميع الأجهزة المتصلة بالشبكة مع مراقبة الأداء.',
    },
  },
  {
    id: 'home-cloud-nas-storage',
    title: {
      en: 'Home Cloud / NAS Storage',
      ar: 'سحابة منزلية ووحدة تخزين NAS',
    },
    image: '/images/nas-storage.jpg',
    tag: '#systems',
    description: {
      en: 'Architected a redundant network-attached storage node with automated snapshot backups, encrypted remote synchronization, and low-overhead local network share protocols.',
      ar: 'وحدة تخزين شبكية (NAS) ذاتية الاستضافة تدعم النسخ الاحتياطي التلقائي والمزامنة المشفرة ومشاركة الملفات السريعة عبر الشبكة المحلية.',
    },
  },
  {
    id: 'iot-environmental-monitor',
    title: {
      en: 'IoT Environmental Monitor',
      ar: 'محطة مراقبة بيئية لإنترنت الأشياء',
    },
    image: '/images/iot-monitor.jpg',
    tag: '#iot',
    description: {
      en: 'Engineered a low-power telemetry station integrating multi-channel I2C environmental sensors with MQTT transmission. Transmits atmospheric data intervals with sub-second polling and power-save modes.',
      ar: 'نظام قياس عن بُعد منخفض الاستهلاك يدمج حساسات بيئية لقياس درجات الحرارة والرطوبة وجودة الهواء ونقل البيانات لحظياً عبر بروتوكول MQTT.',
    },
  },
];
