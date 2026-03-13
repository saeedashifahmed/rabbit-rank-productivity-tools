import { Metadata } from 'next'
import HeicToJpgTool from '@/components/HeicToJpgTool'

export const metadata: Metadata = {
  title: 'Free HEIC to JPG Converter — Convert Apple Photos Online | Rabbit Rank Tools',
  description: 'Convert HEIC and HEIF images to JPG format instantly. Free online converter with adjustable quality. No uploads — runs entirely in your browser.',
  openGraph: {
    title: 'Free HEIC to JPG Converter — Convert Apple Photos Online',
    description: 'Convert HEIC and HEIF images to JPG format instantly. Free online converter with adjustable quality control.',
    url: 'https://tools.rabbitrank.com/heic-to-jpg',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free HEIC to JPG Converter — Convert Apple Photos Online',
    description: 'Convert HEIC and HEIF images to JPG format instantly with adjustable quality. Free and private.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/heic-to-jpg',
  },
}

export default function HeicToJpgPage() {
  return <HeicToJpgTool />
}

