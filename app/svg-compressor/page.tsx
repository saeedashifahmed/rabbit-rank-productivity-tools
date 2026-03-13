import { Metadata } from 'next'
import SvgCompressorTool from '@/components/SvgCompressorTool'

export const metadata: Metadata = {
  title: 'Free SVG Compressor — Optimize SVG Files Online | Rabbit Rank Tools',
  description: 'Compress and optimize SVG files online for free. Remove metadata, comments, and redundant code for faster loading. No uploads — runs in your browser.',
  openGraph: {
    title: 'Free SVG Compressor — Optimize SVG Files Online',
    description: 'Compress and optimize SVG files online for free. Remove metadata, comments, and redundant code for faster loading.',
    url: 'https://tools.rabbitrank.com/svg-compressor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SVG Compressor — Optimize SVG Files Online',
    description: 'Compress and optimize SVG files for faster web performance. Free, private, and runs in your browser.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/svg-compressor',
  },
}

export default function SvgCompressorPage() {
  return <SvgCompressorTool />
}

