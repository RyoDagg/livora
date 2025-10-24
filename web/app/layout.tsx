import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/src/components/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://livora.tn'),
  title: {
    default: 'Livora',
    template: '%s | Livora',
  },
  description:
    'Livora est une plateforme 100 % gratuite pour publier, rechercher et gérer vos annonces immobilières en Tunisie.',
  keywords: [
    'immobilier Tunisie',
    'ventes',
    'locations',
    'maisons',
    'appartements',
    'agences immobilières',
    'Livora',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://livora.tn',
    siteName: 'Livora',
    title: 'Livora',
    description:
      'Trouvez, vendez ou louez des biens immobiliers facilement avec Livora, la plateforme 100 % gratuite en Tunisie.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Livora',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Livora',
    description: 'Trouvez, vendez ou louez des biens immobiliers facilement avec Livora.',
    images: ['/og-image.png'],
    creator: '@livora',
  },
  icons: {
    icon: '/icon.svg',
  },
  alternates: {
    canonical: 'https://livora.tn',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <Navbar />
          {children}
          <Toaster />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
