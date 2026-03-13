import { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Rabbit Rank Tools — Free Online Productivity Tools for Professionals',
  description: 'Free browser-based productivity tools: Word Counter, Case Converter, URL Trimmer, Image Compressor, HEIC to JPG Converter, and SVG Compressor. Fast, private, and no sign-up required.',
  openGraph: {
    title: 'Rabbit Rank Tools — Free Online Productivity Tools',
    description: 'A suite of free, browser-based tools for writers, developers, marketers, and SEO professionals. Word Counter, Case Converter, URL Trimmer, and more.',
    url: 'https://tools.rabbitrank.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rabbit Rank Tools — Free Online Productivity Tools',
    description: 'Free professional tools: Word Counter, Case Converter, Image Compressor, HEIC to JPG, SVG Compressor & URL Trimmer.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com',
  },
}

export default function Home() {
  return <HomePage />
}

