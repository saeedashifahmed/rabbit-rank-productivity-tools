import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Rabbit Rank Tools — Free Online Productivity Tools for Professionals',
    template: '%s | Rabbit Rank Tools'
  },
  description: 'Free browser-based productivity tools for professionals — Word Counter, Case Converter, URL Trimmer, Image Compressor, HEIC to JPG, and SVG Compressor. Fast, private, no sign-up.',
  metadataBase: new URL('https://tools.rabbitrank.com'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tools.rabbitrank.com/',
    siteName: 'Rabbit Rank Tools',
    title: 'Rabbit Rank Tools — Free Online Productivity Tools',
    description: 'Free browser-based productivity tools for writers, developers, marketers, and SEO professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@RabbitRank',
    creator: '@RabbitRank',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://tools.rabbitrank.com/#website',
      url: 'https://tools.rabbitrank.com/',
      name: 'Rabbit Rank Tools',
      description: 'Free browser-based productivity tools for professionals',
      publisher: { '@id': 'https://rabbitrank.com/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://rabbitrank.com/#organization',
      name: 'Rabbit Rank LLC',
      url: 'https://rabbitrank.com/',
      logo: 'https://rabbitrank.com/logo.svg',
      sameAs: [
        'https://www.facebook.com/rabbitrank.llc',
        'https://x.com/RabbitRank',
        'https://www.linkedin.com/company/rabbitrank/',
        'https://www.instagram.com/rabbit.rank/',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

