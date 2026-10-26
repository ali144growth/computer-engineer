import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fahed Al-Mansoor: Computer Engineering Portfolio',
  description:
    'Minimalist bilingual portfolio of Fahed Al-Mansoor, Computer Engineering Student in Kuwait. Coursework, embedded access-control systems, DNS appliances, storage clusters, and IoT telemetry.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Fahed Al-Mansoor: Computer Engineering Portfolio',
    description:
      'Minimalist bilingual portfolio of Fahed Al-Mansoor, Computer Engineering Student in Kuwait. Coursework, embedded hardware, networking, and systems projects.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fahed Al-Mansoor: Computer Engineering Portfolio',
    description:
      'Minimalist bilingual portfolio of Fahed Al-Mansoor, Computer Engineering Student in Kuwait.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="bg-[#0A0E14] text-[#F1F5F9] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
