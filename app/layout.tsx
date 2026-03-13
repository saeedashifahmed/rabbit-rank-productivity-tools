import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Rabbit Rank Tools - Free Professional Productivity Suite',
    template: '%s | Rabbit Rank Tools'
  },
  description: 'Free browser-based productivity tools for professionals — Word Counter, Case Converter, URL Trimmer, Image Compressor, HEIC to JPG, and SVG Compressor.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tools.rabbitrank.com/',
    siteName: 'Rabbit Rank Tools',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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

